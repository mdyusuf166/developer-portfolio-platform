import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/AppError.js';
import { fail } from '../response/api-response.js';
import { logger } from '../lib/logger.js';

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const requestId = req.id;
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error('Request failed', { requestId, code: err.code, errorName: err.name });
      return res.status(err.statusCode).json({ ...fail(err.code, 'An internal error occurred'), meta: { requestId } });
    }
    return res.status(err.statusCode).json({ ...fail(err.code, err.message, err.details), meta: { requestId } });
  }

  if (err instanceof Error && 'status' in err && err.status === 413) {
    return res.status(413).json({ ...fail('UPLOAD_TOO_LARGE', 'Request payload is too large'), meta: { requestId } });
  }

  logger.error('Unhandled request error', { requestId, errorName: err instanceof Error ? err.name : 'UnknownError' });
  return res.status(500).json({ ...fail('INTERNAL_SERVER_ERROR', 'An internal error occurred'), meta: { requestId } });
};
