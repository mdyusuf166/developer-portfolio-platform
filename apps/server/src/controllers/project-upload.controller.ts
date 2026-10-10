import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { AppError } from '../errors/AppError.js';
import { uploadService } from '../services/upload.service.js';
import type { UploadStorage } from '../lib/upload-storage.js';
import { ok } from '../response/api-response.js';

const authorizationInput = z.object({
  originalName: z.string().min(1).max(500),
  contentType: z.string().min(1).max(100),
  size: z.number().int().min(1).max(10 * 1024 * 1024),
  purpose: z.string().max(80).optional()
}).strict();

export const createProjectUploadController = (storage: UploadStorage) => ({
  async authorize(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = authorizationInput.safeParse(req.body);
      if (!parsed.success) throw new AppError('Invalid upload authorization request', 400, 'VALIDATION_ERROR');
      const ownerAdminId = req.user?.sub;
      if (!ownerAdminId) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      res.status(201).json(ok(await uploadService.authorize({ ownerAdminId, ...parsed.data }, storage), req.id));
    } catch (error) { next(error); }
  },
  async finalize(req: Request, res: Response, next: NextFunction) {
    try {
      const token = (req.body as { uploadToken?: unknown })?.uploadToken;
      if (typeof token !== 'string' || token.length > 4096) throw new AppError('Invalid upload finalization request', 400, 'VALIDATION_ERROR');
      const ownerAdminId = req.user?.sub;
      if (!ownerAdminId) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      res.status(201).json(ok(await uploadService.finalize(token, ownerAdminId, storage), req.id));
    } catch (error) { next(error); }
  },
  async publicRead(req: Request, res: Response, next: NextFunction) {
    try {
      const filename = Array.isArray(req.params.filename) ? req.params.filename[0] : req.params.filename;
      const signedUrl = await uploadService.resolvePublic(filename, storage);
      res.setHeader('Cache-Control', 'private, no-store, max-age=0');
      res.redirect(302, signedUrl);
    } catch (error) { next(error); }
  },
  async readUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const ownerAdminId = req.user?.sub;
      if (!ownerAdminId) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      res.setHeader('Cache-Control', 'private, no-store, max-age=0');
      res.status(200).json(ok({ url: await uploadService.resolvePrivate(id, ownerAdminId, storage) }, req.id));
    } catch (error) { next(error); }
  },
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const ownerAdminId = req.user?.sub;
      if (!ownerAdminId) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      res.status(200).json(ok(await uploadService.list(ownerAdminId), req.id));
    } catch (error) { next(error); }
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const ownerAdminId = req.user?.sub;
      if (!ownerAdminId) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      res.status(200).json(ok(await uploadService.delete(id, ownerAdminId, storage), req.id));
    } catch (error) { next(error); }
  }
});
