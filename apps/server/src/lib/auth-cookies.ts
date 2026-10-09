import { randomBytes, timingSafeEqual } from 'node:crypto';
import type { Request, Response } from 'express';
import { env } from '../config/env.js';

export const REFRESH_COOKIE = 'portfolio_refresh';
export const CSRF_COOKIE = 'portfolio_csrf';
const cookiePath = '/api/v1/auth';

const cookieValue = (header: string | undefined, name: string) => {
  const entry = header?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : undefined;
};

const cookieOptions = (httpOnly: boolean) => ({
  httpOnly,
  secure: env.nodeEnv === 'production',
  sameSite: env.nodeEnv === 'production' ? 'none' as const : 'lax' as const,
  path: cookiePath,
  maxAge: 7 * 24 * 60 * 60 * 1000
});

export const readRefreshCookie = (req: Request) => cookieValue(req.headers.cookie, REFRESH_COOKIE);

export const issueAuthCookies = (res: Response, refreshToken: string) => {
  const csrfToken = randomBytes(32).toString('base64url');
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions(true));
  issueCsrfCookie(res, csrfToken);
  return csrfToken;
};

export const issueCsrfCookie = (res: Response, csrfToken = randomBytes(32).toString('base64url')) => {
  res.cookie(CSRF_COOKIE, csrfToken, cookieOptions(false));
  return csrfToken;
};

export const clearAuthCookies = (res: Response) => {
  const { maxAge: _maxAge, ...options } = cookieOptions(true);
  void _maxAge;
  res.clearCookie(REFRESH_COOKIE, options);
  res.clearCookie(CSRF_COOKIE, { ...options, httpOnly: false });
};

export const csrfCookieToken = (req: Request) => cookieValue(req.headers.cookie, CSRF_COOKIE);

export const csrfHeaderMatchesCookie = (req: Request) => {
  const cookie = csrfCookieToken(req);
  const header = req.get('x-csrf-token');
  if (!cookie || !header) return false;
  const left = Buffer.from(cookie);
  const right = Buffer.from(header);
  return left.length === right.length && timingSafeEqual(left, right);
};
