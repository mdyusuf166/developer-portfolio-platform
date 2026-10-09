import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/AppError.js';
import { uploadService } from '../services/upload.service.js';
import { ok } from '../response/api-response.js';

export const projectUploadController = {
  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!Buffer.isBuffer(req.body)) {
        throw new AppError('Send a multipart/form-data request with one file field', 415, 'UNSUPPORTED_MEDIA_TYPE');
      }

      const contentType = req.get('content-type') ?? '';
      const uploaded = await uploadService.create(req.body, contentType);
      res.status(201).json(ok(uploaded, req.id));
    } catch (error) {
      next(error);
    }
  },
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const assets = await uploadService.list();
      res.status(200).json(ok(assets, req.id));
    } catch (error) {
      next(error);
    }
  },
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const asset = await uploadService.delete(id);
      res.status(200).json(ok(asset, req.id));
    } catch (error) {
      next(error);
    }
  }
};