import type { Router } from 'express';

import { createProjectUploadController } from '../controllers/project-upload.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/authorization.js';
import type { UploadStorage } from '../lib/upload-storage.js';

export const registerProjectUploadRoutes = (router: Router, storage: UploadStorage) => {
  const adminOnly = [authenticate, requireRole('ADMIN')];
  const controller = createProjectUploadController(storage);
  router.get('/uploads/:filename', controller.publicRead);
  router.get('/api/v1/admin/uploads', ...adminOnly, controller.list);
  router.post('/api/v1/admin/uploads/authorize', ...adminOnly, controller.authorize);
  router.post('/api/v1/admin/uploads/finalize', ...adminOnly, controller.finalize);
  router.get('/api/v1/admin/uploads/:id/read-url', ...adminOnly, controller.readUrl);
  router.delete('/api/v1/admin/uploads/:id', ...adminOnly, controller.remove);
};
