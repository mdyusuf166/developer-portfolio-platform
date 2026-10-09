import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { projectUploadsDirectory } from './lib/project-upload.js';

import { env } from './config/env.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFoundHandler } from './middleware/not-found.js';
import { requestIdMiddleware } from './middleware/request-id.js';
import { rateLimit } from './middleware/rate-limit.js';
import { registerAdminContentRoutes } from './routes/admin.js';
import { registerAuthRoutes } from './routes/auth.js';
import { registerHealthRoutes } from './routes/health.js';
import { registerProfileRoutes } from './routes/profile.js';
import { registerProjectUploadRoutes } from './routes/project-upload.js';
import { ok } from './response/api-response.js';

export const createApp = (): Express => {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', env.trustProxy);
  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use('/uploads', express.static(projectUploadsDirectory, {
    fallthrough: true,
    maxAge: '1d',
    setHeaders: (res, path) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      if (path.toLowerCase().endsWith('.svg')) {
        res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; img-src data:");
      }
      if (path.toLowerCase().endsWith('.pdf')) {
        res.setHeader('Content-Disposition', 'attachment');
      }
    }
  }));
  app.use(requestIdMiddleware);
  app.use('/api', rateLimit({ bucket: 'api', windowSeconds: 60, points: 300 }));

  registerHealthRoutes(app);
  registerProfileRoutes(app);
  registerProjectUploadRoutes(app);
  registerAuthRoutes(app);
  registerAdminContentRoutes(app);

  app.get('/api/v1/runtime', (req, res) => {
    res.status(200).json(
      ok(
        {
          app: env.appName,
          environment: env.nodeEnv,
          version: env.version
        },
        req.id
      )
    );
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
