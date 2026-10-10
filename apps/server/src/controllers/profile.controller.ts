import type { NextFunction, Request, Response } from 'express';

import { ok } from '../response/api-response.js';
import { profileService } from '../services/profile.service.js';

export const profileController = {
  async getProject(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
      const project = await profileService.getPublishedProjectBySlug(slug);
      res.status(200).json(ok(project, req.id));
    } catch (error) {
      next(error);
    }
  },

  async getProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const projects = await profileService.getPublishedProjects();
      res.status(200).json(ok(projects, req.id));
    } catch (error) {
      next(error);
    }
  },

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await profileService.getProfile();
      res.status(200).json(ok(profile, req.id));
    } catch (error) {
      next(error);
    }
  }
};
