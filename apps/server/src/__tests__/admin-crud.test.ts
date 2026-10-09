import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';

import { createApp } from '../app.js';
import { env } from '../config/env.js';
import { generateAccessToken } from '../lib/token.js';
import { prisma } from '../lib/prisma.js';

const ADMIN_EMAIL_PREFIX = 'phase9-admin-';
const RESOURCE_PREFIX = 'phase9-';

const cleanupPhase9Records = async () => {
  await prisma.project.deleteMany({ where: { slug: { startsWith: RESOURCE_PREFIX } } });
  await prisma.skill.deleteMany({ where: { name: { startsWith: RESOURCE_PREFIX } } });
  await prisma.experience.deleteMany({ where: { company: { startsWith: RESOURCE_PREFIX } } });
  await prisma.education.deleteMany({ where: { school: { startsWith: RESOURCE_PREFIX } } });
  await prisma.researchItem.deleteMany({ where: { title: { startsWith: RESOURCE_PREFIX } } });
  await prisma.achievement.deleteMany({ where: { title: { startsWith: RESOURCE_PREFIX } } });
  await prisma.service.deleteMany({ where: { title: { startsWith: RESOURCE_PREFIX } } });
  await prisma.blogPost.deleteMany({ where: { slug: { startsWith: RESOURCE_PREFIX } } });
  await prisma.admin.deleteMany({ where: { email: { startsWith: ADMIN_EMAIL_PREFIX } } });
};

afterEach(async () => {
  await cleanupPhase9Records();
});

const makeAdminRegistration = () => {
  const email = `${ADMIN_EMAIL_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;

  return {
    name: 'Phase9 Admin',
    email,
    password: 'StrongPass123!',
    bootstrapSecret: env.adminBootstrapSecret
  };
};

const registerAdmin = async (app: ReturnType<typeof createApp>) => {
  const payload = makeAdminRegistration();
  const response = await request(app).post('/api/v1/auth/register').send(payload);

  expect(response.status).toBe(201);
  expect(response.body.success).toBe(true);

  return {
    token: response.body.data.accessToken,
    email: payload.email
  };
};

const buildAdminAuthHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

const buildUserToken = () => generateAccessToken({ sub: 'user-123', role: 'USER' });

describe('admin content management', () => {
  it('requires authentication and admin authorization for administrative content routes', async () => {
    const app = createApp();
    const { token } = await registerAdmin(app);

    const unauthenticated = await request(app).get('/api/v1/admin/projects');
    expect(unauthenticated.status).toBe(401);

    const forbidden = await request(app)
      .get('/api/v1/admin/projects')
      .set(buildAdminAuthHeader(buildUserToken()));
    expect(forbidden.status).toBe(403);

    const allowed = await request(app)
      .get('/api/v1/admin/projects')
      .set(buildAdminAuthHeader(token));
    expect(allowed.status).toBe(200);
  });

  it('creates, lists, fetches, updates, and deletes projects via admin routes', async () => {
    const app = createApp();
    const { token } = await registerAdmin(app);
    const resourcePrefix = `${RESOURCE_PREFIX}project-${Date.now()}`;
    const createPayload = {
      slug: `${resourcePrefix}-slug`,
      title: 'Phase9 Project',
      summary: 'A project summary',
      description: 'A longer description of the project',
      featured: true,
      status: 'draft'
    };

    const createResponse = await request(app)
      .post('/api/v1/admin/projects')
      .set(buildAdminAuthHeader(token))
      .send(createPayload);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.success).toBe(true);
    expect(createResponse.body.data).toMatchObject({
      slug: createPayload.slug,
      title: createPayload.title,
      status: createPayload.status
    });
    expect(createResponse.body.data).not.toHaveProperty('passwordHash');

    const listResponse = await request(app)
      .get('/api/v1/admin/projects')
      .set(buildAdminAuthHeader(token));

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.success).toBe(true);
    expect(listResponse.body.data).toEqual(expect.arrayContaining([expect.objectContaining({ slug: createPayload.slug })]));

    const itemId = createResponse.body.data.id;

    const getResponse = await request(app)
      .get(`/api/v1/admin/projects/${itemId}`)
      .set(buildAdminAuthHeader(token));

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.data.slug).toBe(createPayload.slug);

    const updateResponse = await request(app)
      .patch(`/api/v1/admin/projects/${itemId}`)
      .set(buildAdminAuthHeader(token))
      .send({ title: 'Phase9 Project Updated', summary: 'Updated summary' });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.title).toBe('Phase9 Project Updated');

    const duplicateResponse = await request(app)
      .post('/api/v1/admin/projects')
      .set(buildAdminAuthHeader(token))
      .send(createPayload);

    expect(duplicateResponse.status).toBe(409);

    const missingResponse = await request(app)
      .patch('/api/v1/admin/projects/nonexistent-id')
      .set(buildAdminAuthHeader(token))
      .send({ title: 'Ghost' });

    expect(missingResponse.status).toBe(404);

    const deleteResponse = await request(app)
      .delete(`/api/v1/admin/projects/${itemId}`)
      .set(buildAdminAuthHeader(token));

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.success).toBe(true);
  });

  it('publishes projects to public list/detail routes and hides drafts', async () => {
    const app = createApp();
    const { token } = await registerAdmin(app);
    const slug = `${RESOURCE_PREFIX}public-${Date.now()}`;
    const authHeader = buildAdminAuthHeader(token);

    const created = await request(app)
      .post('/api/v1/admin/projects')
      .set(authHeader)
      .send({ slug, title: 'CMS project record', summary: 'Published through CMS', description: 'Details', status: 'draft' });
    expect(created.status).toBe(201);

    let publicList = await request(app).get('/api/v1/projects');
    expect(publicList.status).toBe(200);
    expect(publicList.body.data.some((project: { slug: string }) => project.slug === slug)).toBe(false);
    expect((await request(app).get(`/api/v1/projects/${slug}`)).status).toBe(404);

    const published = await request(app).patch(`/api/v1/admin/projects/${created.body.data.id}`).set(authHeader).send({ status: 'published' });
    expect(published.status).toBe(200);
    publicList = await request(app).get('/api/v1/projects');
    expect(publicList.body.data).toContainEqual(expect.objectContaining({ slug, status: 'published' }));
    expect((await request(app).get(`/api/v1/projects/${slug}`)).body.data).toMatchObject({ slug, title: 'CMS project record' });

    const unpublished = await request(app).patch(`/api/v1/admin/projects/${created.body.data.id}`).set(authHeader).send({ status: 'draft' });
    expect(unpublished.status).toBe(200);
    expect((await request(app).get(`/api/v1/projects/${slug}`)).status).toBe(404);

    expect((await request(app).delete(`/api/v1/admin/projects/${created.body.data.id}`).set(authHeader)).status).toBe(200);
  });

  it('creates, lists, fetches, updates, and deletes skills via admin routes', async () => {
    const app = createApp();
    const { token } = await registerAdmin(app);
    const resourcePrefix = `${RESOURCE_PREFIX}skill-${Date.now()}`;
    const createPayload = {
      name: `${resourcePrefix} Skill`,
      category: 'Frontend',
      featured: true
    };

    const createResponse = await request(app)
      .post('/api/v1/admin/skills')
      .set(buildAdminAuthHeader(token))
      .send(createPayload);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data.name).toBe(createPayload.name);

    const listResponse = await request(app)
      .get('/api/v1/admin/skills')
      .set(buildAdminAuthHeader(token));
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data).toEqual(expect.arrayContaining([expect.objectContaining({ name: createPayload.name })]));

    const getResponse = await request(app)
      .get(`/api/v1/admin/skills/${createResponse.body.data.id}`)
      .set(buildAdminAuthHeader(token));
    expect(getResponse.status).toBe(200);

    const updateResponse = await request(app)
      .patch(`/api/v1/admin/skills/${createResponse.body.data.id}`)
      .set(buildAdminAuthHeader(token))
      .send({ category: 'Full Stack' });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.category).toBe('Full Stack');

    const deleteResponse = await request(app)
      .delete(`/api/v1/admin/skills/${createResponse.body.data.id}`)
      .set(buildAdminAuthHeader(token));
    expect(deleteResponse.status).toBe(200);
  });

  it('creates, lists, fetches, updates, and deletes experience via admin routes', async () => {
    const app = createApp();
    const { token } = await registerAdmin(app);
    const resourcePrefix = `${RESOURCE_PREFIX}exp-${Date.now()}`;
    const createPayload = {
      company: `${resourcePrefix} Company`,
      role: 'Senior Engineer',
      location: 'Remote',
      current: true,
      description: 'Led product engineering work.'
    };

    const createResponse = await request(app)
      .post('/api/v1/admin/experience')
      .set(buildAdminAuthHeader(token))
      .send(createPayload);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data.company).toBe(createPayload.company);

    const listResponse = await request(app)
      .get('/api/v1/admin/experience')
      .set(buildAdminAuthHeader(token));
    expect(listResponse.status).toBe(200);

    const getResponse = await request(app)
      .get(`/api/v1/admin/experience/${createResponse.body.data.id}`)
      .set(buildAdminAuthHeader(token));
    expect(getResponse.status).toBe(200);

    const updateResponse = await request(app)
      .patch(`/api/v1/admin/experience/${createResponse.body.data.id}`)
      .set(buildAdminAuthHeader(token))
      .send({ role: 'Staff Engineer' });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.role).toBe('Staff Engineer');

    const deleteResponse = await request(app)
      .delete(`/api/v1/admin/experience/${createResponse.body.data.id}`)
      .set(buildAdminAuthHeader(token));
    expect(deleteResponse.status).toBe(200);
  });

  it('creates, lists, fetches, updates, and deletes education via admin routes', async () => {
    const app = createApp();
    const { token } = await registerAdmin(app);
    const resourcePrefix = `${RESOURCE_PREFIX}edu-${Date.now()}`;
    const createPayload = {
      school: `${resourcePrefix} University`,
      degree: 'BSc',
      field: 'Computer Science',
      location: 'Boston',
      description: 'Focused on software systems.'
    };

    const createResponse = await request(app)
      .post('/api/v1/admin/education')
      .set(buildAdminAuthHeader(token))
      .send(createPayload);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data.school).toBe(createPayload.school);

    const listResponse = await request(app)
      .get('/api/v1/admin/education')
      .set(buildAdminAuthHeader(token));
    expect(listResponse.status).toBe(200);

    const getResponse = await request(app)
      .get(`/api/v1/admin/education/${createResponse.body.data.id}`)
      .set(buildAdminAuthHeader(token));
    expect(getResponse.status).toBe(200);

    const updateResponse = await request(app)
      .patch(`/api/v1/admin/education/${createResponse.body.data.id}`)
      .set(buildAdminAuthHeader(token))
      .send({ degree: 'MSc' });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.degree).toBe('MSc');

    const deleteResponse = await request(app)
      .delete(`/api/v1/admin/education/${createResponse.body.data.id}`)
      .set(buildAdminAuthHeader(token));
    expect(deleteResponse.status).toBe(200);
  });

  it('creates, lists, fetches, updates, and deletes research items via admin routes', async () => {
    const app = createApp();
    const { token } = await registerAdmin(app);
    const resourcePrefix = `${RESOURCE_PREFIX}research-${Date.now()}`;
    const createPayload = {
      title: `${resourcePrefix} Research`,
      summary: 'Investigated a resilient architecture pattern.',
      status: 'draft'
    };

    const createResponse = await request(app)
      .post('/api/v1/admin/research')
      .set(buildAdminAuthHeader(token))
      .send(createPayload);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data.title).toBe(createPayload.title);

    const listResponse = await request(app)
      .get('/api/v1/admin/research')
      .set(buildAdminAuthHeader(token));
    expect(listResponse.status).toBe(200);

    const getResponse = await request(app)
      .get(`/api/v1/admin/research/${createResponse.body.data.id}`)
      .set(buildAdminAuthHeader(token));
    expect(getResponse.status).toBe(200);

    const updateResponse = await request(app)
      .patch(`/api/v1/admin/research/${createResponse.body.data.id}`)
      .set(buildAdminAuthHeader(token))
      .send({ status: 'published' });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.status).toBe('published');

    const deleteResponse = await request(app)
      .delete(`/api/v1/admin/research/${createResponse.body.data.id}`)
      .set(buildAdminAuthHeader(token));
    expect(deleteResponse.status).toBe(200);
  });

  it('creates, lists, fetches, updates, and deletes achievements via admin routes', async () => {
    const app = createApp();
    const { token } = await registerAdmin(app);
    const resourcePrefix = `${RESOURCE_PREFIX}achievement-${Date.now()}`;
    const createPayload = {
      title: `${resourcePrefix} Award`,
      description: 'Recognized for product quality.',
      issuer: 'Microsoft',
      awardDate: '2024-01-01T00:00:00.000Z'
    };

    const createResponse = await request(app)
      .post('/api/v1/admin/achievements')
      .set(buildAdminAuthHeader(token))
      .send(createPayload);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data.title).toBe(createPayload.title);

    const listResponse = await request(app)
      .get('/api/v1/admin/achievements')
      .set(buildAdminAuthHeader(token));
    expect(listResponse.status).toBe(200);

    const getResponse = await request(app)
      .get(`/api/v1/admin/achievements/${createResponse.body.data.id}`)
      .set(buildAdminAuthHeader(token));
    expect(getResponse.status).toBe(200);

    const updateResponse = await request(app)
      .patch(`/api/v1/admin/achievements/${createResponse.body.data.id}`)
      .set(buildAdminAuthHeader(token))
      .send({ description: 'Updated description' });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.description).toBe('Updated description');

    const deleteResponse = await request(app)
      .delete(`/api/v1/admin/achievements/${createResponse.body.data.id}`)
      .set(buildAdminAuthHeader(token));
    expect(deleteResponse.status).toBe(200);
  });

  it('creates, lists, fetches, updates, and deletes services via admin routes', async () => {
    const app = createApp();
    const { token } = await registerAdmin(app);
    const resourcePrefix = `${RESOURCE_PREFIX}service-${Date.now()}`;
    const createPayload = {
      title: `${resourcePrefix} Service`,
      description: 'Custom software design and delivery.',
      category: 'Consulting'
    };

    const createResponse = await request(app)
      .post('/api/v1/admin/services')
      .set(buildAdminAuthHeader(token))
      .send(createPayload);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data.title).toBe(createPayload.title);

    const listResponse = await request(app)
      .get('/api/v1/admin/services')
      .set(buildAdminAuthHeader(token));
    expect(listResponse.status).toBe(200);

    const getResponse = await request(app)
      .get(`/api/v1/admin/services/${createResponse.body.data.id}`)
      .set(buildAdminAuthHeader(token));
    expect(getResponse.status).toBe(200);

    const updateResponse = await request(app)
      .patch(`/api/v1/admin/services/${createResponse.body.data.id}`)
      .set(buildAdminAuthHeader(token))
      .send({ category: 'Engineering' });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.category).toBe('Engineering');

    const deleteResponse = await request(app)
      .delete(`/api/v1/admin/services/${createResponse.body.data.id}`)
      .set(buildAdminAuthHeader(token));
    expect(deleteResponse.status).toBe(200);
  });

  it('creates, lists, fetches, updates, and deletes blog posts via admin routes', async () => {
    const app = createApp();
    const { token } = await registerAdmin(app);
    const resourcePrefix = `${RESOURCE_PREFIX}blog-${Date.now()}`;
    const createPayload = {
      slug: `${resourcePrefix}-article`,
      title: 'Phase9 Blog Post',
      excerpt: 'A short summary.',
      content: 'A complete article body.',
      category: 'Engineering',
      published: true
    };

    const createResponse = await request(app)
      .post('/api/v1/admin/blog-posts')
      .set(buildAdminAuthHeader(token))
      .send(createPayload);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.data.slug).toBe(createPayload.slug);

    const listResponse = await request(app)
      .get('/api/v1/admin/blog-posts')
      .set(buildAdminAuthHeader(token));
    expect(listResponse.status).toBe(200);

    const getResponse = await request(app)
      .get(`/api/v1/admin/blog-posts/${createResponse.body.data.id}`)
      .set(buildAdminAuthHeader(token));
    expect(getResponse.status).toBe(200);

    const updateResponse = await request(app)
      .patch(`/api/v1/admin/blog-posts/${createResponse.body.data.id}`)
      .set(buildAdminAuthHeader(token))
      .send({ title: 'Updated Blog Post Title' });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.title).toBe('Updated Blog Post Title');

    const duplicateResponse = await request(app)
      .post('/api/v1/admin/blog-posts')
      .set(buildAdminAuthHeader(token))
      .send(createPayload);
    expect(duplicateResponse.status).toBe(409);

    const deleteResponse = await request(app)
      .delete(`/api/v1/admin/blog-posts/${createResponse.body.data.id}`)
      .set(buildAdminAuthHeader(token));
    expect(deleteResponse.status).toBe(200);
  });

  it('rejects invalid create and update payloads and returns 404 for missing resources', async () => {
    const app = createApp();
    const { token } = await registerAdmin(app);

    const invalidCreate = await request(app)
      .post('/api/v1/admin/projects')
      .set(buildAdminAuthHeader(token))
      .send({ title: '', summary: '' });
    expect(invalidCreate.status).toBe(400);

    const projectCreate = await request(app)
      .post('/api/v1/admin/projects')
      .set(buildAdminAuthHeader(token))
      .send({
        slug: `${RESOURCE_PREFIX}invalid-project-${Date.now()}`,
        title: 'Test Project',
        summary: 'A summary',
        description: 'A description',
        featured: false,
        status: 'draft'
      });

    const invalidUpdate = await request(app)
      .patch(`/api/v1/admin/projects/${projectCreate.body.data.id}`)
      .set(buildAdminAuthHeader(token))
      .send({ slug: '' });
    expect(invalidUpdate.status).toBe(400);

    const missingDelete = await request(app)
      .delete('/api/v1/admin/projects/missing-resource-id')
      .set(buildAdminAuthHeader(token));
    expect(missingDelete.status).toBe(404);
  });

  it('does not expose sensitive fields from admin content payloads', async () => {
    const app = createApp();
    const { token } = await registerAdmin(app);

    const response = await request(app)
      .post('/api/v1/admin/projects')
      .set(buildAdminAuthHeader(token))
      .send({
        slug: `${RESOURCE_PREFIX}sensitive-${Date.now()}`,
        title: 'Sensitive Data Test',
        summary: 'No hashes here.',
        description: 'No internal state exposed.',
        featured: false,
        status: 'draft'
      });

    expect(response.status).toBe(201);
    expect(response.body.data).not.toHaveProperty('passwordHash');
    expect(response.body.data).not.toHaveProperty('refreshToken');
    expect(response.body.data).not.toHaveProperty('tokenHash');
  });
});
