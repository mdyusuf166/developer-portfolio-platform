import type { NextFunction, Request, Response } from 'express';

import { fail } from '../response/api-response.js';

export const notFoundHandler = (req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json(
    fail('NOT_FOUND', `Route not found: ${req.method} ${req.originalUrl}`)
  );
};
