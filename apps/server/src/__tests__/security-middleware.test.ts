import express, { type Request, type Response } from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApp } from '../app.js';
import { errorHandler } from '../middleware/error-handler.js';
import { rateLimit } from '../middleware/rate-limit.js';

const responseCookies = (response: { headers: { 'set-cookie'?: string | string[] } }) => {
  const cookies = response.headers['set-cookie'];
  return Array.isArray(cookies) ? cookies : cookies ? [cookies] : [];
};

describe('security middleware', () => {
  it('sets a readable CSRF cookie without issuing a refresh credential', async () => {
    const response = await request(createApp()).get('/api/v1/auth/csrf');
    expect(response.status).toBe(200);
    expect(response.body.data.csrfToken).toEqual(expect.any(String));
    expect(responseCookies(response).some((cookie) => cookie.startsWith('portfolio_csrf='))).toBe(true);
    expect(responseCookies(response).some((cookie) => cookie.startsWith('portfolio_refresh='))).toBe(false);
  });

  it('rejects refresh requests without CSRF proof before reading the database', async () => {
    const response = await request(createApp()).post('/api/v1/auth/refresh').send({});
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('CSRF_INVALID');
  });

  it('rejects auth mutations from a foreign origin', async () => {
    const response = await request(createApp()).post('/api/v1/auth/login').set('Origin', 'https://untrusted.example').send({ email: 'x@example.test', password: 'password123' });
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('INVALID_ORIGIN');
  });

  it('limits by a stable bucket and IP rather than query-string variants', async () => {
    const app = express();
    app.get('/check', rateLimit({ bucket: `test-${Math.random()}`, windowSeconds: 60, points: 1 }), (_req, res) => res.sendStatus(200));
    expect((await request(app).get('/check?variant=one')).status).toBe(200);
    const limited = await request(app).get('/check?variant=two');
    expect(limited.status).toBe(429);
    expect(limited.headers['retry-after']).toBeDefined();
  });

  it('returns a generic error with request ID and omits internal exception text', () => {
    const json = vi.fn();
    const response = { status: vi.fn().mockReturnThis(), json } as unknown as Response;
    errorHandler(new Error('private database endpoint'), { id: 'request-123' } as Request, response, vi.fn());
    expect(response.status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'An internal error occurred' },
      meta: { requestId: 'request-123' }
    }));
    expect(JSON.stringify(json.mock.calls[0][0])).not.toContain('private database endpoint');
  });
});
