import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/AppError.js';
import { prisma } from '../lib/prisma.js';

export const requireOwnedAssetReferences = (req: Request, _res: Response, next: NextFunction) => {
  const body = req.body as Record<string, unknown>;
  const assetIds = [...new Set(Object.entries(body ?? {})
    .filter(([key, value]) => key.endsWith('AssetId') && typeof value === 'string')
    .map(([, value]) => value as string))];
  if (assetIds.length === 0) return next();
  const ownerAdminId = req.user?.sub;
  if (!ownerAdminId) return next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'));
  void prisma.uploadAsset.findMany({
    where: { id: { in: assetIds }, ownerAdminId },
    select: { id: true }
  }).then((owned) => {
    if (owned.length !== assetIds.length) throw new AppError('One or more uploads are not available', 404, 'UPLOAD_NOT_FOUND');
    next();
  }).catch(next);
};
