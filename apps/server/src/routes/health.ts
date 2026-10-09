import type { Request, Response, Router } from 'express';

import { ok } from '../response/api-response.js';
import { getDatabaseHealth } from '../services/database-health.js';
import { env } from '../config/env.js';

export const registerHealthRoutes = (router: Router) => {
  router.get('/api/v1/health', async (req: Request, res: Response) => {
    const databaseHealth = await getDatabaseHealth();

    res.status(200).json(
      ok(
        {
          status: 'ok',
          database: databaseHealth,
          app: env.appName
        },
        req.id
      )
    );
  });
};
