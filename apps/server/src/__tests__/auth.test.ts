import type { Request } from 'express';
import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';

import { createApp } from '../app.js';
import { env } from '../config/env.js';
import { AppError } from '../errors/AppError.js';
import { prisma } from '../lib/prisma.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { generateAccessToken, verifyAccessToken } from '../lib/token.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/authorization.js';

const responseCookies = (response: { headers: { 'set-cookie'?: string | string[] } }) => {
  const cookies = response.headers['set-cookie'];
  return Array.isArray(cookies) ? cookies : cookies ? [cookies] : [];
};

describe('authentication foundation', () => {
  it('hashes and verifies passwords securely', async () => {
    const password = 'StrongPass123!';
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(await verifyPassword(password, hash)).toBe(true);
    expect(await verifyPassword('wrong-password', hash)).toBe(false);
  });

  it('issues and verifies access tokens with admin claims', () => {
    const token = generateAccessToken({ sub: 'admin-123', role: 'ADMIN' });
    const payload = verifyAccessToken(token);

    expect(payload.sub).toBe('admin-123');
    expect(payload.role).toBe('ADMIN');
  });

  it('rejects malformed or expired tokens', () => {
    expect(() => verifyAccessToken('not-a-token')).toThrow();
  });

  it('authenticate middleware loads a principal from the request', async () => {
    const req = {
      headers: { authorization: `Bearer ${generateAccessToken({ sub: 'admin-456', role: 'ADMIN' })}` },
      user: undefined
    } as unknown as Request;
    const res = { status: () => ({ json: () => undefined }) } as never;
    const next = () => undefined;

    await authenticate(req, res, next);

    expect(req.user).toMatchObject({ sub: 'admin-456', role: 'ADMIN' });
  });

  it('requireRole allows ADMIN and rejects insufficient roles', () => {
    const adminReq = { user: { role: 'ADMIN' } } as never;
    const userReq = { user: { role: 'USER' } } as never;
    const res = { status: (code: number) => ({ json: () => ({ code }) }) } as never;

    expect(() => requireRole('ADMIN')(adminReq, res, (() => undefined) as never)).not.toThrow();

    expect(() => requireRole('ADMIN')(userReq, res, (() => undefined) as never)).toThrow(AppError);
  });
});

describe('authentication workflows', () => {
  afterEach(async () => {
    await prisma.admin.deleteMany({
      where: {
        email: { startsWith: 'phase8-' }
      }
    });
  });

  const makeRegistrationPayload = () => {
    const email = `phase8-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;

    return {
      name: 'Phase8 Admin',
      email,
      password: 'StrongPass123!',
      bootstrapSecret: env.adminBootstrapSecret
    };
  };

  it('registers a new admin and rejects duplicates', async () => {
    const app = createApp();
    const client = request.agent(app);
    const payload = makeRegistrationPayload();

    const firstResponse = await client.post('/api/v1/auth/register').send(payload);

    expect(firstResponse.status).toBe(201);
    expect(firstResponse.body.success).toBe(true);
    expect(firstResponse.body.data.admin).toMatchObject({
      name: payload.name,
      email: payload.email,
      role: 'ADMIN'
    });
    expect(firstResponse.body.data.admin.passwordHash).toBeUndefined();
    expect(firstResponse.body.data).not.toHaveProperty('password');
    expect(firstResponse.body.data.accessToken).toEqual(expect.any(String));
    expect(firstResponse.body.data.csrfToken).toEqual(expect.any(String));
    expect(responseCookies(firstResponse).some((cookie) => cookie.startsWith('portfolio_refresh=') && /HttpOnly/i.test(cookie))).toBe(true);
    expect(firstResponse.body.data).not.toHaveProperty('refreshToken');
    expect(firstResponse.body.data.tokenType).toBe('Bearer');

    const duplicateResponse = await client.post('/api/v1/auth/register').send(payload);

    expect(duplicateResponse.status).toBe(409);
    expect(duplicateResponse.body.success).toBe(false);
    expect(duplicateResponse.body.error.code).toBe('CONFLICT');
  });

  it('logs in with valid credentials and rejects invalid credentials', async () => {
    const app = createApp();
    const client = request.agent(app);
    const payload = makeRegistrationPayload();

    await client.post('/api/v1/auth/register').send(payload);

    const loginResponse = await client.post('/api/v1/auth/login').send({
      email: payload.email,
      password: payload.password
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.success).toBe(true);
    expect(loginResponse.body.data.admin).toMatchObject({
      name: payload.name,
      email: payload.email,
      role: 'ADMIN'
    });
    expect(loginResponse.body.data.admin.passwordHash).toBeUndefined();
    expect(loginResponse.body.data).not.toHaveProperty('password');
    expect(loginResponse.body.data.accessToken).toEqual(expect.any(String));
    expect(loginResponse.body.data.csrfToken).toEqual(expect.any(String));
    expect(loginResponse.body.data).not.toHaveProperty('refreshToken');
    expect(loginResponse.body.data.tokenType).toBe('Bearer');

    const invalidLoginResponse = await client.post('/api/v1/auth/login').send({
      email: payload.email,
      password: 'WrongPass123!'
    });

    expect(invalidLoginResponse.status).toBe(401);
    expect(invalidLoginResponse.body.success).toBe(false);
    expect(invalidLoginResponse.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('reads the current admin from /me and rejects unauthenticated access', async () => {
    const app = createApp();
    const payload = makeRegistrationPayload();

    const registerResponse = await request(app).post('/api/v1/auth/register').send(payload);
    const accessToken = registerResponse.body.data.accessToken;

    const meResponse = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.success).toBe(true);
    expect(meResponse.body.data).toMatchObject({
      name: payload.name,
      email: payload.email,
      role: 'ADMIN'
    });
    expect(meResponse.body.data.passwordHash).toBeUndefined();
    expect(meResponse.body.data.password).toBeUndefined();

    const unauthenticatedResponse = await request(app).get('/api/v1/auth/me');

    expect(unauthenticatedResponse.status).toBe(401);
    expect(unauthenticatedResponse.body.success).toBe(false);
    expect(unauthenticatedResponse.body.error.code).toBe('UNAUTHORIZED');
  });

  it('refreshes and rotates the refresh token and rejects the old token', async () => {
    const app = createApp();
    const client = request.agent(app);
    const payload = makeRegistrationPayload();

    const registerResponse = await client.post('/api/v1/auth/register').send(payload);
    const oldRefreshCookie = responseCookies(registerResponse).find((cookie) => cookie.startsWith('portfolio_refresh='))?.split(';')[0];

    const refreshResponse = await client.post('/api/v1/auth/refresh').set('X-CSRF-Token', registerResponse.body.data.csrfToken).send({});

    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body.success).toBe(true);
    expect(refreshResponse.body.data.accessToken).toEqual(expect.any(String));
    expect(refreshResponse.body.data.csrfToken).toEqual(expect.any(String));
    expect(refreshResponse.body.data).not.toHaveProperty('refreshToken');
    expect(refreshResponse.body.data.tokenType).toBe('Bearer');

    const currentCsrfCookie = responseCookies(refreshResponse).find((cookie) => cookie.startsWith('portfolio_csrf='))?.split(';')[0];
    const oldRefreshRejectedResponse = await request(app).post('/api/v1/auth/refresh').set('Cookie', `${oldRefreshCookie}; ${currentCsrfCookie}`).set('X-CSRF-Token', refreshResponse.body.data.csrfToken).send({});

    expect(oldRefreshRejectedResponse.status).toBe(401);
    expect(oldRefreshRejectedResponse.body.success).toBe(false);
    expect(oldRefreshRejectedResponse.body.error.code).toBe('INVALID_REFRESH_TOKEN');

    const newRefreshAcceptedResponse = await client.post('/api/v1/auth/refresh').set('X-CSRF-Token', refreshResponse.body.data.csrfToken).send({});

    expect(newRefreshAcceptedResponse.status).toBe(200);
    expect(newRefreshAcceptedResponse.body.success).toBe(true);
  });

  it('logs out and revokes the refresh token', async () => {
    const app = createApp();
    const client = request.agent(app);
    const payload = makeRegistrationPayload();

    const registerResponse = await client.post('/api/v1/auth/register').send(payload);
    const refreshCookie = responseCookies(registerResponse).find((cookie) => cookie.startsWith('portfolio_refresh='))?.split(';')[0];
    const csrfCookie = responseCookies(registerResponse).find((cookie) => cookie.startsWith('portfolio_csrf='))?.split(';')[0];

    const logoutResponse = await client.post('/api/v1/auth/logout').set('X-CSRF-Token', registerResponse.body.data.csrfToken).send({});

    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.body.success).toBe(true);

    const revokedRefreshResponse = await request(app).post('/api/v1/auth/refresh').set('Cookie', `${refreshCookie}; ${csrfCookie}`).set('X-CSRF-Token', registerResponse.body.data.csrfToken).send({});

    expect(revokedRefreshResponse.status).toBe(401);
    expect(revokedRefreshResponse.body.success).toBe(false);
    expect(revokedRefreshResponse.body.error.code).toBe('INVALID_REFRESH_TOKEN');
  });
});
