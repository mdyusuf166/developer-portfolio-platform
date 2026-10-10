import type { NextFunction, Request, Response } from 'express';

import { ok } from '../response/api-response.js';
import { adminContentService } from '../services/admin-content.service.js';
import type { ListQueryInput } from '../validators/query.validator.js';

const send = (res: Response, req: Request, status: number, payload: unknown, meta: Record<string, unknown> = {}) => {
  res.status(status).json(ok(payload, req.id, meta));
};

const getRouteId = (req: Request): string => (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

export const adminContentController = {
  projects: {
    list: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await adminContentService.projects.list(req.query as ListQueryInput);
        send(res, req, 200, result.data, result.meta);
      } catch (error) {
        next(error);
      }
    },
    getOne: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.projects.getById(getRouteId(req));
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    },
    create: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.projects.create(req.body);
        send(res, req, 201, item);
      } catch (error) {
        next(error);
      }
    },
    update: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.projects.update(getRouteId(req), req.body);
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.projects.delete(getRouteId(req));
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    }
  },
  skills: {
    list: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await adminContentService.skills.list(req.query as ListQueryInput);
        send(res, req, 200, result.data, result.meta);
      } catch (error) {
        next(error);
      }
    },
    getOne: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.skills.getById(getRouteId(req));
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    },
    create: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.skills.create(req.body);
        send(res, req, 201, item);
      } catch (error) {
        next(error);
      }
    },
    update: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.skills.update(getRouteId(req), req.body);
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.skills.delete(getRouteId(req));
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    }
  },
  experience: {
    list: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await adminContentService.experience.list(req.query as ListQueryInput);
        send(res, req, 200, result.data, result.meta);
      } catch (error) {
        next(error);
      }
    },
    getOne: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.experience.getById(getRouteId(req));
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    },
    create: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.experience.create(req.body);
        send(res, req, 201, item);
      } catch (error) {
        next(error);
      }
    },
    update: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.experience.update(getRouteId(req), req.body);
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.experience.delete(getRouteId(req));
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    }
  },
  education: {
    list: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await adminContentService.education.list(req.query as ListQueryInput);
        send(res, req, 200, result.data, result.meta);
      } catch (error) {
        next(error);
      }
    },
    getOne: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.education.getById(getRouteId(req));
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    },
    create: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.education.create(req.body);
        send(res, req, 201, item);
      } catch (error) {
        next(error);
      }
    },
    update: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.education.update(getRouteId(req), req.body);
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.education.delete(getRouteId(req));
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    }
  },
  research: {
    list: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await adminContentService.research.list(req.query as ListQueryInput);
        send(res, req, 200, result.data, result.meta);
      } catch (error) {
        next(error);
      }
    },
    getOne: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.research.getById(getRouteId(req));
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    },
    create: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.research.create(req.body);
        send(res, req, 201, item);
      } catch (error) {
        next(error);
      }
    },
    update: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.research.update(getRouteId(req), req.body);
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.research.delete(getRouteId(req));
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    }
  },
  achievements: {
    list: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await adminContentService.achievements.list(req.query as ListQueryInput);
        send(res, req, 200, result.data, result.meta);
      } catch (error) {
        next(error);
      }
    },
    getOne: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.achievements.getById(getRouteId(req));
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    },
    create: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.achievements.create(req.body);
        send(res, req, 201, item);
      } catch (error) {
        next(error);
      }
    },
    update: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.achievements.update(getRouteId(req), req.body);
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.achievements.delete(getRouteId(req));
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    }
  },
  services: {
    list: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await adminContentService.services.list(req.query as ListQueryInput);
        send(res, req, 200, result.data, result.meta);
      } catch (error) {
        next(error);
      }
    },
    getOne: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.services.getById(getRouteId(req));
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    },
    create: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.services.create(req.body);
        send(res, req, 201, item);
      } catch (error) {
        next(error);
      }
    },
    update: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.services.update(getRouteId(req), req.body);
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.services.delete(getRouteId(req));
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    }
  },
  blogPosts: {
    list: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await adminContentService.blogPosts.list(req.query as ListQueryInput);
        send(res, req, 200, result.data, result.meta);
      } catch (error) {
        next(error);
      }
    },
    getOne: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.blogPosts.getById(getRouteId(req));
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    },
    create: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.blogPosts.create(req.body);
        send(res, req, 201, item);
      } catch (error) {
        next(error);
      }
    },
    update: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.blogPosts.update(getRouteId(req), req.body);
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    },
    delete: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const item = await adminContentService.blogPosts.delete(getRouteId(req));
        send(res, req, 200, item);
      } catch (error) {
        next(error);
      }
    }
  }
};
