import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { closeRateLimitStore, connectRateLimitStore } from './middleware/rate-limit.js';
import { prisma } from './lib/prisma.js';

const app = createApp();
const serverPromise = connectRateLimitStore().then(() => new Promise<ReturnType<typeof app.listen>>((resolve) => {
  const server = app.listen(env.port, () => {
    logger.info('Server started', {
      port: env.port,
      environment: env.nodeEnv,
      clientUrl: env.clientUrl
    });
  });
  resolve(server);
}));
void serverPromise.catch((error: unknown) => {
  logger.error('Server startup failed', { errorName: error instanceof Error ? error.name : 'UnknownError' });
  process.exit(1);
});

const gracefulShutdown = (signal: string) => {
  logger.info('Shutdown signal received', { signal });

  void serverPromise.then((server) => server.close(async () => {
    await prisma.$disconnect();
    await closeRateLimitStore();
    logger.info('Server shut down successfully');
    process.exit(0);
  })).catch((error: unknown) => {
    logger.error('Server startup or shutdown failed', { errorName: error instanceof Error ? error.name : 'UnknownError' });
    process.exit(1);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

export default app;
