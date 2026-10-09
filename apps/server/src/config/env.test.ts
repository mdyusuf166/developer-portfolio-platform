import { describe, expect, it } from 'vitest';
import { loadEnvironment } from './env.js';

const productionEnvironment = {
  NODE_ENV: 'production',
  PORT: '4000',
  DATABASE_URL: 'postgresql://portfolio:password@db.example.test:5432/portfolio',
  CLIENT_URL: 'https://portfolio.example.test',
  REDIS_URL: 'rediss://cache.example.test:6379',
  JWT_ACCESS_SECRET: 'a'.repeat(48),
  JWT_REFRESH_SECRET: 'b'.repeat(48),
  ADMIN_BOOTSTRAP_SECRET: 'c'.repeat(48)
};

describe('production environment validation', () => {
  it('rejects missing required production configuration without printing values', () => {
    expect(() => loadEnvironment({ NODE_ENV: 'production' })).toThrow(/DATABASE_URL.*CLIENT_URL/);
  });

  it('rejects known placeholders and short secrets', () => {
    expect(() => loadEnvironment({ ...productionEnvironment, JWT_ACCESS_SECRET: 'local-development-access-secret-change-me' })).toThrow(/JWT_ACCESS_SECRET/);
    expect(() => loadEnvironment({ ...productionEnvironment, ADMIN_BOOTSTRAP_SECRET: 'short' })).toThrow(/ADMIN_BOOTSTRAP_SECRET/);
  });

  it('accepts valid distinct production secrets and service URLs', () => {
    expect(loadEnvironment(productionEnvironment)).toMatchObject({ nodeEnv: 'production', clientUrl: 'https://portfolio.example.test' });
  });

  it('keeps safe local defaults outside production', () => {
    expect(loadEnvironment({ NODE_ENV: 'development' }).databaseUrl).toContain('localhost');
  });
});
