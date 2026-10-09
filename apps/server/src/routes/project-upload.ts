import express, { type Router } from 'express';

import { projectUploadController } from '../controllers/project-upload.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/authorization.js';
import { uploadMaxBytes } from '../lib/project-upload.js';

export const registerProjectUploadRoutes = (router: Router) => {
  const adminOnly = [authenticate, requireRole('ADMIN')];
  router.get('/api/v1/admin/uploads', ...adminOnly, projectUploadController.list);
  router.post(
    '/api/v1/admin/uploads',
    ...adminOnly,
    express.raw({ type: 'multipart/form-data', limit: uploadMaxBytes + 64 * 1024 }),
    projectUploadController.uploadImage
  );
  router.delete('/api/v1/admin/uploads/:id', ...adminOnly, projectUploadController.remove);
};