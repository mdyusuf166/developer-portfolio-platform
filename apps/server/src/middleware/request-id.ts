import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const incomingRequestId = req.get('x-request-id');
  const requestId = incomingRequestId ?? randomUUID();

  req.headers['x-request-id'] = requestId;
  res.setHeader('x-request-id', requestId);

  req.id = requestId;
  next();
};
