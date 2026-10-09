import type { NextFunction, Request, Response } from 'express';
import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible';
import { createClient } from 'redis';
import { env } from '../config/env.js';

const redisClient = env.redisUrl ? createClient({ url: env.redisUrl }) : undefined;
redisClient?.on('error', (error) => {
  console.error(JSON.stringify({ level: 'error', message: 'Rate-limit Redis connection error', errorName: error.name }));
});

export async function connectRateLimitStore() {
  if (env.nodeEnv === 'production' && redisClient && !redisClient.isOpen) await redisClient.connect();
}

export async function closeRateLimitStore() {
  if (redisClient?.isOpen) await redisClient.quit();
}

type RateLimitOptions = { bucket: string; windowSeconds: number; points: number };
const limiters = new Map<string, RateLimiterMemory | RateLimiterRedis>();

const getLimiter = ({ bucket, windowSeconds, points }: RateLimitOptions) => {
  const existing = limiters.get(bucket);
  if (existing) return existing;
  const config = { points, duration: windowSeconds, blockDuration: windowSeconds, keyPrefix: `portfolio:${bucket}` };
  const limiter = env.nodeEnv === 'production' && redisClient
    ? new RateLimiterRedis({ ...config, storeClient: redisClient })
    : new RateLimiterMemory(config);
  limiters.set(bucket, limiter);
  return limiter;
};

export const rateLimit = (options: RateLimitOptions) => {
  const limiter = getLimiter(options);
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip ?? req.socket.remoteAddress ?? 'unknown';
    void limiter.consume(key).then(() => next()).catch((error: unknown) => {
      if (error && typeof error === 'object' && 'msBeforeNext' in error) {
        const delay = Number((error as { msBeforeNext: unknown }).msBeforeNext);
        res.setHeader('Retry-After', String(Math.max(1, Math.ceil(delay / 1000))));
        res.status(429).json({ success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests' } });
        return;
      }
      next(error);
    });
  };
};
