import type { Router } from 'express';

import { profileController } from '../controllers/profile.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/authorization.js';
import { AppError } from '../errors/AppError.js';
import { profileService } from '../services/profile.service.js';
import { ok } from '../response/api-response.js';
import type { Request, Response, NextFunction } from 'express';
import { portfolioProfileSchema } from '../validators/admin-content.validator.js';

const validateProfile = (req: Request, _res: Response, next: NextFunction) => {
  const result = portfolioProfileSchema.safeParse(req.body);
  if (!result.success) throw new AppError('Invalid profile data', 400, 'VALIDATION_ERROR', result.error.flatten());
  req.body = result.data;
  next();
};

export const registerProfileRoutes = (router: Router) => {
  router.get('/api/v1/projects', profileController.getProjects);
  router.get('/api/v1/projects/:slug', profileController.getProject);
  router.get('/api/v1/profile', profileController.getProfile);
  const adminOnly = [authenticate, requireRole('ADMIN')];
  router.get('/api/v1/admin/profile', ...adminOnly, async (req, res, next) => {
    try {
      res.status(200).json(ok(await profileService.getAdminProfile(), req.id));
    } catch (error) { next(error); }
  });
  const saveProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(ok(await profileService.saveAdminProfile(req.body), req.id));
    } catch (error) { next(error); }
  };
  router.post('/api/v1/admin/profile', ...adminOnly, validateProfile, saveProfile);
  router.patch('/api/v1/admin/profile', ...adminOnly, validateProfile, saveProfile);
};
