import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';

import { createApp } from '../app.js';
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';

const ADMIN_EMAIL_PREFIX = 'phase11-admin-';
const RESOURCE_PREFIX = 'phase11-';

const cleanup = async () => {
  await prisma.project.deleteMany({ where: { slug: { startsWith: RESOURCE_PREFIX } } });
  await prisma.skill.deleteMany({ where: { name: { startsWith: RESOURCE_PREFIX } } });
  await prisma.blogPost.deleteMany({ where: { slug: { startsWith: RESOURCE_PREFIX } } });
  await prisma.admin.deleteMany({ where: { email: { startsWith: ADMIN_EMAIL_PREFIX } } });
};

afterEach(async () => {
  await cleanup();
});

const registerAdmin = async (app: ReturnType<typeof createApp>) => {
  const email = `${ADMIN_EMAIL_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;

  const response = await request(app).post('/api/v1/auth/register').send({
    name: 'Phase11 Admin',
    email,
    password: 'StrongPass123!',
    bootstrapSecret: env.adminBootstrapSecret
  });

  expect(response.status).toBe(201);
  return { token: response.body.data.accessToken };
};

const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

describe('phase 11 list query behavior', () => {
  it('returns paginated admin list responses with default metadata', async () => {
    const app = createApp();
    const { token } = await registerAdmin(app);

    for (const index of [1, 2, 3]) {
      await request(app)
        .post('/api/v1/admin/projects')
        .set(auth(token))
        .send({
          slug: `${RESOURCE_PREFIX}project-${index}`,
          title: `Project ${index}`,
          summary: `Summary ${index}`,
          description: `Description ${index}`,
          category: 'AI',
          featured: index % 2 === 0,
          status: 'draft'
        });
    }

    const response = await request(app)
      .get('/api/v1/admin/projects?page=1&limit=2')
      .set(auth(token));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.meta).toMatchObject({
      page: 1,
      limit: 2,
      total: 3,
      totalPages: 2,
      hasNextPage: true,
      hasPreviousPage: false
    });
  });

  it('supports search, filtering, and sorting for admin collection queries', async () => {
    const app = createApp();
    const { token } = await registerAdmin(app);

    const items = [
      { slug: `${RESOURCE_PREFIX}alpha`, title: 'Alpha Vision', summary: 'AI product design', description: 'Alpha desc', category: 'AI', featured: true, status: 'published' },
      { slug: `${RESOURCE_PREFIX}beta`, title: 'Beta Platform', summary: 'Platform product', description: 'Beta desc', category: 'Platform', featured: false, status: 'published' },
      { slug: `${RESOURCE_PREFIX}gamma`, title: 'Gamma Insights', summary: 'Insights analytics', description: 'Gamma desc', category: 'AI', featured: true, status: 'draft' }
    ];

    for (const item of items) {
      await request(app)
        .post('/api/v1/admin/projects')
        .set(auth(token))
        .send(item);
    }

    const response = await request(app)
      .get('/api/v1/admin/projects?category=AI&search=vision&sortBy=updatedAt&sortOrder=desc')
      .set(auth(token));

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toMatchObject({ title: 'Alpha Vision' });
    expect(response.body.meta).toMatchObject({ page: 1, limit: 10, total: 1 });
  });

  it('rejects invalid query values and invalid sort fields', async () => {
    const app = createApp();
    const { token } = await registerAdmin(app);

    const invalidLimit = await request(app)
      .get('/api/v1/admin/projects?page=0&limit=0')
      .set(auth(token));

    expect(invalidLimit.status).toBe(400);
    expect(invalidLimit.body.success).toBe(false);

    const invalidSort = await request(app)
      .get('/api/v1/admin/projects?sortBy=notARealField')
      .set(auth(token));

    expect(invalidSort.status).toBe(400);
    expect(invalidSort.body.success).toBe(false);
  });
});
