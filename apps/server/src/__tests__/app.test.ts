import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import { AppError } from '../errors/AppError.js';
import { errorHandler } from '../middleware/error-handler.js';
import { createApp } from '../app.js';

describe('backend foundation', () => {
  it('returns a healthy API response', async () => {
    const app = createApp();

    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('ok');
    expect(response.body.data.app).toBe('portfolio-api');
  });

  it('preserves a request id from the client', async () => {
    const app = createApp();

    const response = await request(app).get('/api/v1/health').set('x-request-id', 'request-123');

    expect(response.status).toBe(200);
    expect(response.headers['x-request-id']).toBe('request-123');
  });

  it('exposes a profile read endpoint that returns the portfolio data when the database is available', async () => {
    const app = createApp();

    const response = await request(app).get('/api/v1/profile');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      name: 'MD MAHTAB AHMED MAHIN',
      title: 'AI / ML ENGINEER',
      skills: expect.any(Array),
      projects: expect.any(Array)
    });
    expect(response.body.data.socialLinks).toEqual([]);
    expect(response.body.data.github).toBeUndefined();
    expect(response.body.data.linkedin).toBeUndefined();
  });

  it('returns a structured 404 payload for unknown routes', async () => {
    const app = createApp();

    const response = await request(app).get('/api/v1/missing-route');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });

  it('returns a structured error payload for unexpected failures', async () => {
    const testApp = express();

    testApp.get('/api/v1/boom', () => {
      throw new Error('boom');
    });
    testApp.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      errorHandler(err, _req, res, _next);
    });

    const response = await request(testApp).get('/api/v1/boom');

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('INTERNAL_SERVER_ERROR');
    expect(response.body.error.message).toBe('An internal error occurred');
    expect(response.body.error.message).not.toContain('boom');
  });

  it('formats app errors with the correct status and code', () => {
    const json = vi.fn();
    const status = vi.fn().mockReturnThis();
    const res = { status, json } as never;
    errorHandler(new AppError('User not found', 404, 'NOT_FOUND'), { id: 'request-404' } as never, res, (() => undefined) as never);
    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' }, meta: { requestId: 'request-404' } });
  });
});
