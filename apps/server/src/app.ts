import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { unavailableUploadStorage, type UploadStorage } from './lib/upload-storage.js';

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

export const createApp = (options: { uploadStorage?: UploadStorage } = {}): Express => {
  const app = express();
  const uploadStorage = options.uploadStorage ?? unavailableUploadStorage;

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
  app.use(requestIdMiddleware);
  app.use('/api', rateLimit({ bucket: 'api', windowSeconds: 60, points: 300 }));

  registerHealthRoutes(app);
  registerProfileRoutes(app);
  registerProjectUploadRoutes(app, uploadStorage);
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
