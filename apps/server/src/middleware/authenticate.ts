import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/AppError.js';
import { verifyAccessToken } from '../lib/token.js';

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }

  const token = authorization.slice('Bearer '.length).trim();

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      sub: payload.sub,
      role: payload.role
    };

    next();
  } catch {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
  }
};
