import { unlink } from 'node:fs/promises';
import { join } from 'node:path';

import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../app.js';
import { generateAccessToken } from '../lib/token.js';
import { projectUploadsDirectory } from '../lib/project-upload.js';
import { prisma } from '../lib/prisma.js';

const adminToken = generateAccessToken({ sub: 'upload-admin', role: 'ADMIN' });
const uploadedFiles: string[] = [];

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(uploadedFiles.splice(0).map((filename) => unlink(join(projectUploadsDirectory, filename)).catch(() => undefined)));
});

describe('project image upload', () => {
  it('requires an authenticated admin for multipart uploads', async () => {
    const response = await request(createApp())
      .post('/api/v1/admin/uploads')
      .attach('file', Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), { filename: 'x.png', contentType: 'image/png' });

    expect(response.status).toBe(401);
  });

  it('rejects a non-admin authenticated user', async () => {
    const userToken = generateAccessToken({ sub: 'upload-user', role: 'USER' });
    const response = await request(createApp())
      .post('/api/v1/admin/uploads')
      .set('Authorization', `Bearer ${userToken}`)
      .attach('file', Buffer.from('%PDF-1.7\n%%EOF'), { filename: 'paper.pdf', contentType: 'application/pdf' });

    expect(response.status).toBe(403);
  });

  it('stores signature-checked PNG uploads with a generated public path', async () => {
    const pngBytes = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
    vi.spyOn(prisma.uploadAsset, 'create').mockImplementation(({ data }) => Promise.resolve({
      ...data,
      id: 'asset-test-id',
      createdAt: new Date()
    }) as never);
    const app = createApp();
    const response = await request(app)
      .post('/api/v1/admin/uploads')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('purpose', 'project-image')
      .attach('file', pngBytes, { filename: '../my-project.png', contentType: 'image/png' });

    expect(response.status).toBe(201);
    expect(response.body.data.url).toMatch(/^\/uploads\/[\w-]+\.png$/);
    expect(response.body.data.originalName).toBe('my-project.png');
    expect(response.body.data.purpose).toBe('project-image');
    uploadedFiles.push(response.body.data.url.split('/').pop());

    const imageResponse = await request(app).get(response.body.data.url);
    expect(imageResponse.status).toBe(200);
    expect(imageResponse.headers['content-type']).toMatch(/^image\/png/);
  });

  it('rejects executable or unsupported file types', async () => {
    const response = await request(createApp())
      .post('/api/v1/admin/uploads')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', Buffer.from('not an executable'), { filename: 'payload.exe', contentType: 'application/octet-stream' });

    expect(response.status).toBe(415);
    expect(response.body.error.code).toBe('UNSUPPORTED_MEDIA_TYPE');
  });

  it('rejects a mismatched image signature', async () => {
    const response = await request(createApp())
      .post('/api/v1/admin/uploads')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', Buffer.from('not a png'), { filename: 'fake.png', contentType: 'image/png' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INVALID_FILE_SIGNATURE');
  });

  it('rejects SVG files containing executable script', async () => {
    const response = await request(createApp())
      .post('/api/v1/admin/uploads')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'), { filename: 'art.svg', contentType: 'image/svg+xml' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INVALID_FILE_SIGNATURE');
  });

  it('rejects files larger than the configured limit', async () => {
    const tooLarge = Buffer.alloc(10 * 1024 * 1024 + 1, 0x41);
    const response = await request(createApp())
      .post('/api/v1/admin/uploads')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', tooLarge, { filename: 'large.pdf', contentType: 'application/pdf' });

    expect(response.status).toBe(413);
    expect(response.body.error.code).toBe('UPLOAD_TOO_LARGE');
  });
});