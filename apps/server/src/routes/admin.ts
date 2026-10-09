import type { Router } from 'express';
import { z } from 'zod';

import { adminContentController } from '../controllers/admin-content.controller.js';
import { AppError } from '../errors/AppError.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/authorization.js';
import {
  achievementCreateSchema,
  achievementUpdateSchema,
  blogPostCreateSchema,
  blogPostUpdateSchema,
  educationCreateSchema,
  educationUpdateSchema,
  experienceCreateSchema,
  experienceUpdateSchema,
  projectCreateSchema,
  projectUpdateSchema,
  researchCreateSchema,
  researchUpdateSchema,
  serviceCreateSchema,
  serviceUpdateSchema,
  skillCreateSchema,
  skillUpdateSchema
} from '../validators/admin-content.validator.js';
import {
  achievementListQuerySchema,
  blogListQuerySchema,
  educationListQuerySchema,
  experienceListQuerySchema,
  projectListQuerySchema,
  researchListQuerySchema,
  serviceListQuerySchema,
  skillListQuerySchema,
  validateListQuery
} from '../validators/query.validator.js';

const validateBody = <T extends z.ZodTypeAny>(schema: T) => (
  req: { body: unknown },
  _res: unknown,
  next: () => void
) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    throw new AppError('Invalid request data', 400, 'VALIDATION_ERROR', result.error.flatten());
  }

  req.body = result.data;
  next();
};

const validateListRequest = <T extends z.ZodTypeAny>(schema: T) => (
  req: { query: Record<string, unknown> },
  _res: unknown,
  next: () => void
) => {
  req.query = validateListQuery(schema, req.query);
  next();
};

export const registerAdminContentRoutes = (router: Router) => {
  const adminOnly = [authenticate, requireRole('ADMIN')];

  router.get('/api/v1/admin/projects', ...adminOnly, validateListRequest(projectListQuerySchema), adminContentController.projects.list);
  router.get('/api/v1/admin/projects/:id', ...adminOnly, adminContentController.projects.getOne);
  router.post('/api/v1/admin/projects', ...adminOnly, validateBody(projectCreateSchema), adminContentController.projects.create);
  router.patch('/api/v1/admin/projects/:id', ...adminOnly, validateBody(projectUpdateSchema), adminContentController.projects.update);
  router.delete('/api/v1/admin/projects/:id', ...adminOnly, adminContentController.projects.delete);

  router.get('/api/v1/admin/skills', ...adminOnly, validateListRequest(skillListQuerySchema), adminContentController.skills.list);
  router.get('/api/v1/admin/skills/:id', ...adminOnly, adminContentController.skills.getOne);
  router.post('/api/v1/admin/skills', ...adminOnly, validateBody(skillCreateSchema), adminContentController.skills.create);
  router.patch('/api/v1/admin/skills/:id', ...adminOnly, validateBody(skillUpdateSchema), adminContentController.skills.update);
  router.delete('/api/v1/admin/skills/:id', ...adminOnly, adminContentController.skills.delete);

  router.get('/api/v1/admin/experience', ...adminOnly, validateListRequest(experienceListQuerySchema), adminContentController.experience.list);
  router.get('/api/v1/admin/experience/:id', ...adminOnly, adminContentController.experience.getOne);
  router.post('/api/v1/admin/experience', ...adminOnly, validateBody(experienceCreateSchema), adminContentController.experience.create);
  router.patch('/api/v1/admin/experience/:id', ...adminOnly, validateBody(experienceUpdateSchema), adminContentController.experience.update);
  router.delete('/api/v1/admin/experience/:id', ...adminOnly, adminContentController.experience.delete);

  router.get('/api/v1/admin/education', ...adminOnly, validateListRequest(educationListQuerySchema), adminContentController.education.list);
  router.get('/api/v1/admin/education/:id', ...adminOnly, adminContentController.education.getOne);
  router.post('/api/v1/admin/education', ...adminOnly, validateBody(educationCreateSchema), adminContentController.education.create);
  router.patch('/api/v1/admin/education/:id', ...adminOnly, validateBody(educationUpdateSchema), adminContentController.education.update);
  router.delete('/api/v1/admin/education/:id', ...adminOnly, adminContentController.education.delete);

  router.get('/api/v1/admin/research', ...adminOnly, validateListRequest(researchListQuerySchema), adminContentController.research.list);
  router.get('/api/v1/admin/research/:id', ...adminOnly, adminContentController.research.getOne);
  router.post('/api/v1/admin/research', ...adminOnly, validateBody(researchCreateSchema), adminContentController.research.create);
  router.patch('/api/v1/admin/research/:id', ...adminOnly, validateBody(researchUpdateSchema), adminContentController.research.update);
  router.delete('/api/v1/admin/research/:id', ...adminOnly, adminContentController.research.delete);

  router.get('/api/v1/admin/achievements', ...adminOnly, validateListRequest(achievementListQuerySchema), adminContentController.achievements.list);
  router.get('/api/v1/admin/achievements/:id', ...adminOnly, adminContentController.achievements.getOne);
  router.post('/api/v1/admin/achievements', ...adminOnly, validateBody(achievementCreateSchema), adminContentController.achievements.create);
  router.patch('/api/v1/admin/achievements/:id', ...adminOnly, validateBody(achievementUpdateSchema), adminContentController.achievements.update);
  router.delete('/api/v1/admin/achievements/:id', ...adminOnly, adminContentController.achievements.delete);

  router.get('/api/v1/admin/services', ...adminOnly, validateListRequest(serviceListQuerySchema), adminContentController.services.list);
  router.get('/api/v1/admin/services/:id', ...adminOnly, adminContentController.services.getOne);
  router.post('/api/v1/admin/services', ...adminOnly, validateBody(serviceCreateSchema), adminContentController.services.create);
  router.patch('/api/v1/admin/services/:id', ...adminOnly, validateBody(serviceUpdateSchema), adminContentController.services.update);
  router.delete('/api/v1/admin/services/:id', ...adminOnly, adminContentController.services.delete);

  router.get('/api/v1/admin/blog-posts', ...adminOnly, validateListRequest(blogListQuerySchema), adminContentController.blogPosts.list);
  router.get('/api/v1/admin/blog-posts/:id', ...adminOnly, adminContentController.blogPosts.getOne);
  router.post('/api/v1/admin/blog-posts', ...adminOnly, validateBody(blogPostCreateSchema), adminContentController.blogPosts.create);
  router.patch('/api/v1/admin/blog-posts/:id', ...adminOnly, validateBody(blogPostUpdateSchema), adminContentController.blogPosts.update);
  router.delete('/api/v1/admin/blog-posts/:id', ...adminOnly, adminContentController.blogPosts.delete);
};
