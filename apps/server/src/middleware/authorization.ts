import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/AppError.js';

export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError('Forbidden', 403, 'FORBIDDEN');
    }

    next();
  };
};
