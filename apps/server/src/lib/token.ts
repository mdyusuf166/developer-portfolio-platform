import crypto from 'node:crypto';
import jwt, { type JwtPayload } from 'jsonwebtoken';

import { env } from '../config/env.js';

export type AuthTokenClaims = JwtPayload & {
  sub: string;
  role: string;
};

export const generateAccessToken = ({ sub, role }: { sub: string; role: string }) =>
  jwt.sign({ sub, role }, env.jwtAccessSecret as jwt.Secret, {
    expiresIn: env.jwtAccessExpiresIn as jwt.SignOptions['expiresIn']
  });

export const verifyAccessToken = (token: string): AuthTokenClaims => {
  const payload = jwt.verify(token, env.jwtAccessSecret) as JwtPayload & { sub?: string; role?: string };

  if (!payload.sub || !payload.role) {
    throw new Error('Invalid access token payload');
  }

  return {
    sub: payload.sub,
    role: payload.role,
    iat: payload.iat,
    exp: payload.exp
  };
};

export const generateRefreshToken = () => crypto.randomBytes(32).toString('hex');

export const hashRefreshToken = (token: string) =>
  crypto.createHash('sha256').update(token).digest('hex');
