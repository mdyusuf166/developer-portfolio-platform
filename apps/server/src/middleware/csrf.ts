import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError.js';
import { env } from '../config/env.js';
import { csrfHeaderMatchesCookie } from '../lib/auth-cookies.js';

export const requireAllowedAuthOrigin = (req: Request, _res: Response, next: NextFunction) => {
  const origin = req.get('origin');
  if (env.nodeEnv === 'production' && origin !== env.clientUrl) {
    throw new AppError('Request origin is not allowed', 403, 'INVALID_ORIGIN');
  }
  if (origin && origin !== env.clientUrl) throw new AppError('Request origin is not allowed', 403, 'INVALID_ORIGIN');
  next();
};

export const requireCsrf = (req: Request, _res: Response, next: NextFunction) => {
  requireAllowedAuthOrigin(req, _res, () => {
    if (!csrfHeaderMatchesCookie(req)) throw new AppError('CSRF validation failed', 403, 'CSRF_INVALID');
    next();
  });
};
