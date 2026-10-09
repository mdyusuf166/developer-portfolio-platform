import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { logger } from '../lib/logger.js';

export const getDatabaseHealth = async () => {
  if (env.nodeEnv === 'test' || !env.databaseUrl) {
    return {
      status: 'configured',
      provider: 'postgresql',
      connected: false,
      message: 'Database connection is configured for local development and will be checked when Postgres is available.'
    };
  }

  try {
    await prisma.$queryRaw`SELECT 1`;

    return {
      status: 'ok',
      provider: 'postgresql',
      connected: true
    };
  } catch (error) {
    logger.error('Database health check failed', { errorName: error instanceof Error ? error.name : 'UnknownError' });
    return {
      status: 'unavailable',
      provider: 'postgresql',
      connected: false
    };
  }
};
