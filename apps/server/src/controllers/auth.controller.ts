import type { NextFunction, Request, Response } from 'express';

import { authService } from '../services/auth.service.js';
import { ok } from '../response/api-response.js';
import { clearAuthCookies, issueAuthCookies, issueCsrfCookie, readRefreshCookie } from '../lib/auth-cookies.js';
import { AppError } from '../errors/AppError.js';
import { csrfCookieToken } from '../lib/auth-cookies.js';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      const csrfToken = issueAuthCookies(res, result.refreshToken);
      const { refreshToken: _refreshToken, ...publicResult } = result;
      void _refreshToken;
      res.status(201).json(ok({ ...publicResult, csrfToken }, req.id));
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      const csrfToken = issueAuthCookies(res, result.refreshToken);
      const { refreshToken: _refreshToken, ...publicResult } = result;
      void _refreshToken;
      res.status(200).json(ok({ ...publicResult, csrfToken }, req.id));
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = readRefreshCookie(req);
      if (!refreshToken) throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
      const result = await authService.refresh(refreshToken);
      const csrfToken = issueAuthCookies(res, result.refreshToken);
      const { refreshToken: _nextRefreshToken, ...publicResult } = result;
      void _nextRefreshToken;
      res.status(200).json(ok({ ...publicResult, csrfToken }, req.id));
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = readRefreshCookie(req);
      if (refreshToken) await authService.logout(refreshToken);
      clearAuthCookies(res);
      const result = { success: true };
      res.status(200).json(ok(result, req.id));
    } catch (error) {
      next(error);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = await authService.getCurrentAdmin(req.user?.sub ?? '');
      res.status(200).json(ok(admin, req.id));
    } catch (error) {
      next(error);
    }
  },
  async csrf(req: Request, res: Response, next: NextFunction) {
    try {
      const existing = csrfCookieToken(req);
      const csrfToken = existing ?? issueCsrfCookie(res);
      res.status(200).json(ok({ csrfToken }, req.id));
    } catch (error) { next(error); }
  }
};
