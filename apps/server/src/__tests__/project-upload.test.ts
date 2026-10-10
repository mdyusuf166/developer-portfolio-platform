import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../app.js';
import { generateAccessToken } from '../lib/token.js';
import type { StoredObject, UploadStorage } from '../lib/upload-storage.js';
import { prisma } from '../lib/prisma.js';

const adminToken = generateAccessToken({ sub: 'upload-admin', role: 'ADMIN' });
const pngBytes = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
let stored: StoredObject | null = null;
const mockStorage: UploadStorage = {
  authorizeUpload: async ({ objectKey, expiresAt }) => ({ url: `https://storage.invalid/${objectKey}`, method: 'PUT', headers: {}, expiresAt: expiresAt.toISOString() }),
  inspectObject: async () => stored,
  authorizeRead: async ({ objectKey }) => `https://storage.invalid/read/${objectKey}`,
  deleteObject: async () => { stored = null; }
};

afterEach(() => {
  stored = null;
  vi.restoreAllMocks();
});

describe('direct upload authorization and finalization', () => {
  it('requires an authenticated admin for upload authorization', async () => {
    const response = await request(createApp({ uploadStorage: mockStorage }))
      .post('/api/v1/admin/uploads/authorize')
      .send({ originalName: 'image.png', contentType: 'image/png', size: pngBytes.length });

    expect(response.status).toBe(401);
  });

  it('rejects a non-admin authenticated user', async () => {
    const userToken = generateAccessToken({ sub: 'upload-user', role: 'USER' });
    const response = await request(createApp({ uploadStorage: mockStorage }))
      .post('/api/v1/admin/uploads/authorize')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ originalName: 'paper.pdf', contentType: 'application/pdf', size: 12 });

    expect(response.status).toBe(403);
  });

  it('creates private metadata only after inspecting stored bytes', async () => {
    vi.spyOn(prisma.uploadAsset, 'findUnique').mockResolvedValue(null as never);
    vi.spyOn(prisma.uploadAsset, 'create').mockImplementation(({ data }) => Promise.resolve({
      ...data,
      id: 'asset-test-id',
      createdAt: new Date()
    }) as never);
    const app = createApp({ uploadStorage: mockStorage });
    const authorization = await request(app)
      .post('/api/v1/admin/uploads/authorize')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ originalName: '../my-project.png', contentType: 'image/png', size: pngBytes.length, purpose: 'project-image' });

    expect(authorization.status).toBe(201);
    expect(authorization.body.data.url).toMatch(/^https:\/\/storage\.invalid\//);
    expect(authorization.body.data.maximumBytes).toBe(10 * 1024 * 1024);
    const objectKey = new URL(authorization.body.data.url).pathname.slice(1);
    stored = { objectKey, contentType: 'image/png', bytes: pngBytes };
    const finalized = await request(app)
      .post('/api/v1/admin/uploads/finalize')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ uploadToken: authorization.body.data.uploadToken });

    expect(finalized.status).toBe(201);
    expect(finalized.body.data.url).toBe(`/uploads/${objectKey}`);
    expect(finalized.body.data.ownerAdminId).toBe('upload-admin');
  });
});
