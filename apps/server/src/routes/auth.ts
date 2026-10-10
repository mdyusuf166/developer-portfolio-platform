import type { Router } from 'express';

import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/authorization.js';
import { rateLimit } from '../middleware/rate-limit.js';
import { requireAllowedAuthOrigin, requireCsrf } from '../middleware/csrf.js';

export const registerAuthRoutes = (router: Router) => {
  router.get('/api/v1/auth/csrf', requireAllowedAuthOrigin, authController.csrf);
  router.post('/api/v1/auth/register', rateLimit({ bucket: 'auth-register', windowSeconds: 3600, points: 3 }), requireAllowedAuthOrigin, authController.register);
  router.post('/api/v1/auth/login', rateLimit({ bucket: 'auth-login', windowSeconds: 900, points: 5 }), requireAllowedAuthOrigin, authController.login);
  router.post('/api/v1/auth/refresh', rateLimit({ bucket: 'auth-refresh', windowSeconds: 900, points: 30 }), requireCsrf, authController.refresh);
  router.post('/api/v1/auth/logout', requireCsrf, authController.logout);
  router.get('/api/v1/auth/me', authenticate, requireRole('ADMIN'), authController.me);
};
