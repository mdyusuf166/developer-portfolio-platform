import dotenv from 'dotenv';

dotenv.config();

const placeholders = new Set([
  'replace-with-development-access-secret',
  'replace-with-development-refresh-secret',
  'replace-with-development-bootstrap-secret',
  'local-development-access-secret-change-me',
  'local-development-refresh-secret-change-me',
  'local-bootstrap-secret-change-me',
  'change-me',
  'changeme'
]);

const parseDuration = (value: string, name: string, maxSeconds: number) => {
  const match = /^(\d+)(s|m|h|d)$/.exec(value);
  if (!match) throw new Error(`${name} must use an integer duration such as 15m or 7d`);
  const multiplier = { s: 1, m: 60, h: 3600, d: 86400 }[match[2] as 's' | 'm' | 'h' | 'd'];
  const seconds = Number(match[1]) * multiplier;
  if (!Number.isSafeInteger(seconds) || seconds < 60 || seconds > maxSeconds) {
    throw new Error(`${name} must be between 60 seconds and ${maxSeconds} seconds`);
  }
  return seconds;
};

export type EnvironmentSource = Record<string, string | undefined>;

export function loadEnvironment(source: EnvironmentSource) {
  const nodeEnv = source.NODE_ENV ?? 'development';
  if (!['development', 'test', 'production'].includes(nodeEnv)) {
    throw new Error('NODE_ENV must be development, test, or production');
  }
  const production = nodeEnv === 'production';
  const portValue = Number(source.PORT ?? 4000);
  const jwtAccessSecret = source.JWT_ACCESS_SECRET ?? (!production ? 'local-development-access-secret-change-me' : '');
  const jwtRefreshSecret = source.JWT_REFRESH_SECRET ?? (!production ? 'local-development-refresh-secret-change-me' : '');
  const adminBootstrapSecret = source.ADMIN_BOOTSTRAP_SECRET ?? (!production ? 'local-bootstrap-secret-change-me' : '');
  const databaseUrl = source.DATABASE_URL ?? (!production ? 'postgresql://postgres:postgres@localhost:5432/devportfolio' : '');
  const clientUrl = source.CLIENT_URL ?? (!production ? 'http://localhost:5173' : '');
  const redisUrl = source.REDIS_URL;
  const trustProxy = Number(source.TRUST_PROXY ?? 0);
  const jwtAccessExpiresIn = source.JWT_ACCESS_EXPIRES_IN ?? '15m';
  const jwtRefreshExpiresIn = source.JWT_REFRESH_EXPIRES_IN ?? '7d';
  const jwtAccessExpiresInSeconds = parseDuration(jwtAccessExpiresIn, 'JWT_ACCESS_EXPIRES_IN', 900);
  const jwtRefreshExpiresInSeconds = parseDuration(jwtRefreshExpiresIn, 'JWT_REFRESH_EXPIRES_IN', 30 * 86400);

  if (production) {
    const required = {
      DATABASE_URL: databaseUrl,
      CLIENT_URL: clientUrl,
      JWT_ACCESS_SECRET: jwtAccessSecret,
      JWT_REFRESH_SECRET: jwtRefreshSecret,
      ADMIN_BOOTSTRAP_SECRET: adminBootstrapSecret,
      REDIS_URL: redisUrl
    };
    const missing = Object.entries(required).filter(([, value]) => !value?.trim()).map(([key]) => key);
    if (missing.length) throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);

    const secrets = { JWT_ACCESS_SECRET: jwtAccessSecret, JWT_REFRESH_SECRET: jwtRefreshSecret, ADMIN_BOOTSTRAP_SECRET: adminBootstrapSecret };
    for (const [key, value] of Object.entries(secrets)) {
      const normalized = value.toLowerCase();
      if (placeholders.has(normalized) || normalized.includes('replace-with-') || normalized.includes('change-me') || value.length < 32) {
        throw new Error(`${key} must be a unique, non-placeholder secret of at least 32 characters in production`);
      }
    }
    if (new Set(Object.values(secrets)).size !== Object.values(secrets).length) {
      throw new Error('JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, and ADMIN_BOOTSTRAP_SECRET must be different in production');
    }
    try {
      const parsedClientUrl = new URL(clientUrl);
      if (parsedClientUrl.protocol !== 'https:' || parsedClientUrl.origin !== clientUrl) throw new Error();
      if (new URL(redisUrl!).protocol !== 'redis:' && new URL(redisUrl!).protocol !== 'rediss:') throw new Error();
      if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) throw new Error();
    } catch {
      throw new Error('Production CLIENT_URL, REDIS_URL, or DATABASE_URL has an invalid format');
    }
  }

  if (source.TRUST_PROXY !== undefined && (!Number.isInteger(trustProxy) || trustProxy < 0)) {
    throw new Error('TRUST_PROXY must be a non-negative integer hop count');
  }

  return {
    nodeEnv,
    port: Number.isFinite(portValue) && portValue > 0 ? portValue : 4000,
    clientUrl,
    databaseUrl,
    redisUrl,
    trustProxy: Number.isInteger(trustProxy) && trustProxy >= 0 ? trustProxy : 0,
    appName: 'portfolio-api',
    version: '1.0.0',
    jwtAccessSecret,
    jwtAccessExpiresIn,
    jwtAccessExpiresInSeconds,
    jwtRefreshSecret,
    jwtRefreshExpiresIn,
    jwtRefreshExpiresInSeconds,
    adminBootstrapSecret
  };
}

export const env = loadEnvironment(process.env);
