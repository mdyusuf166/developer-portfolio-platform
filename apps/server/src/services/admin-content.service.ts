import { Prisma } from '@prisma/client';

import { AppError } from '../errors/AppError.js';
import { adminContentRepository } from '../repositories/admin-content.repository.js';
import type { ListQueryInput } from '../validators/query.validator.js';

const asError = (message: string, code: string, details?: unknown) => new AppError(message, code === 'NOT_FOUND' ? 404 : code === 'CONFLICT' ? 409 : 400, code, details);

const handleUniqueConflict = (resource: string, error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    throw asError(`${resource} already exists`, 'CONFLICT');
  }

  throw error;
};

const assertExisting = async <T>(resource: string, finder: () => Promise<T | null>) => {
  const item = await finder();

  if (!item) {
    throw asError(`${resource} not found`, 'NOT_FOUND');
  }

  return item;
};

export const adminContentService = {
  projects: {
    list: (query?: ListQueryInput) => adminContentRepository.projects.list(query),
    getById: async (id: string) => assertExisting('Project', () => adminContentRepository.projects.getById(id)),
    create: async (input: Parameters<typeof adminContentRepository.projects.create>[0]) => {
      try {
        return await adminContentRepository.projects.create(input);
      } catch (error) {
        handleUniqueConflict('Project', error);
      }
    },
    update: async (id: string, input: Parameters<typeof adminContentRepository.projects.update>[1]) => {
      await assertExisting('Project', () => adminContentRepository.projects.getById(id));
      try {
        return await adminContentRepository.projects.update(id, input);
      } catch (error) {
        handleUniqueConflict('Project', error);
      }
    },
    delete: async (id: string) => {
      await assertExisting('Project', () => adminContentRepository.projects.getById(id));
      return adminContentRepository.projects.delete(id);
    }
  },
  skills: {
    list: (query?: ListQueryInput) => adminContentRepository.skills.list(query),
    getById: async (id: string) => assertExisting('Skill', () => adminContentRepository.skills.getById(id)),
    create: async (input: Parameters<typeof adminContentRepository.skills.create>[0]) => {
      try {
        return await adminContentRepository.skills.create(input);
      } catch (error) {
        handleUniqueConflict('Skill', error);
      }
    },
    update: async (id: string, input: Parameters<typeof adminContentRepository.skills.update>[1]) => {
      await assertExisting('Skill', () => adminContentRepository.skills.getById(id));
      try {
        return await adminContentRepository.skills.update(id, input);
      } catch (error) {
        handleUniqueConflict('Skill', error);
      }
    },
    delete: async (id: string) => {
      await assertExisting('Skill', () => adminContentRepository.skills.getById(id));
      return adminContentRepository.skills.delete(id);
    }
  },
  experience: {
    list: (query?: ListQueryInput) => adminContentRepository.experience.list(query),
    getById: async (id: string) => assertExisting('Experience', () => adminContentRepository.experience.getById(id)),
    create: async (input: Parameters<typeof adminContentRepository.experience.create>[0]) =>
      adminContentRepository.experience.create(input),
    update: async (id: string, input: Parameters<typeof adminContentRepository.experience.update>[1]) => {
      await assertExisting('Experience', () => adminContentRepository.experience.getById(id));
      return adminContentRepository.experience.update(id, input);
    },
    delete: async (id: string) => {
      await assertExisting('Experience', () => adminContentRepository.experience.getById(id));
      return adminContentRepository.experience.delete(id);
    }
  },
  education: {
    list: (query?: ListQueryInput) => adminContentRepository.education.list(query),
    getById: async (id: string) => assertExisting('Education', () => adminContentRepository.education.getById(id)),
    create: async (input: Parameters<typeof adminContentRepository.education.create>[0]) =>
      adminContentRepository.education.create(input),
    update: async (id: string, input: Parameters<typeof adminContentRepository.education.update>[1]) => {
      await assertExisting('Education', () => adminContentRepository.education.getById(id));
      return adminContentRepository.education.update(id, input);
    },
    delete: async (id: string) => {
      await assertExisting('Education', () => adminContentRepository.education.getById(id));
      return adminContentRepository.education.delete(id);
    }
  },
  research: {
    list: (query?: ListQueryInput) => adminContentRepository.research.list(query),
    getById: async (id: string) => assertExisting('Research item', () => adminContentRepository.research.getById(id)),
    create: async (input: Parameters<typeof adminContentRepository.research.create>[0]) =>
      adminContentRepository.research.create(input),
    update: async (id: string, input: Parameters<typeof adminContentRepository.research.update>[1]) => {
      await assertExisting('Research item', () => adminContentRepository.research.getById(id));
      return adminContentRepository.research.update(id, input);
    },
    delete: async (id: string) => {
      await assertExisting('Research item', () => adminContentRepository.research.getById(id));
      return adminContentRepository.research.delete(id);
    }
  },
  achievements: {
    list: (query?: ListQueryInput) => adminContentRepository.achievements.list(query),
    getById: async (id: string) => assertExisting('Achievement', () => adminContentRepository.achievements.getById(id)),
    create: async (input: Parameters<typeof adminContentRepository.achievements.create>[0]) =>
      adminContentRepository.achievements.create(input),
    update: async (id: string, input: Parameters<typeof adminContentRepository.achievements.update>[1]) => {
      await assertExisting('Achievement', () => adminContentRepository.achievements.getById(id));
      return adminContentRepository.achievements.update(id, input);
    },
    delete: async (id: string) => {
      await assertExisting('Achievement', () => adminContentRepository.achievements.getById(id));
      return adminContentRepository.achievements.delete(id);
    }
  },
  services: {
    list: (query?: ListQueryInput) => adminContentRepository.services.list(query),
    getById: async (id: string) => assertExisting('Service', () => adminContentRepository.services.getById(id)),
    create: async (input: Parameters<typeof adminContentRepository.services.create>[0]) =>
      adminContentRepository.services.create(input),
    update: async (id: string, input: Parameters<typeof adminContentRepository.services.update>[1]) => {
      await assertExisting('Service', () => adminContentRepository.services.getById(id));
      return adminContentRepository.services.update(id, input);
    },
    delete: async (id: string) => {
      await assertExisting('Service', () => adminContentRepository.services.getById(id));
      return adminContentRepository.services.delete(id);
    }
  },
  blogPosts: {
    list: (query?: ListQueryInput) => adminContentRepository.blogPosts.list(query),
    getById: async (id: string) => assertExisting('Blog post', () => adminContentRepository.blogPosts.getById(id)),
    create: async (input: Parameters<typeof adminContentRepository.blogPosts.create>[0]) => {
      try {
        return await adminContentRepository.blogPosts.create(input);
      } catch (error) {
        handleUniqueConflict('Blog post', error);
      }
    },
    update: async (id: string, input: Parameters<typeof adminContentRepository.blogPosts.update>[1]) => {
      await assertExisting('Blog post', () => adminContentRepository.blogPosts.getById(id));
      try {
        return await adminContentRepository.blogPosts.update(id, input);
      } catch (error) {
        handleUniqueConflict('Blog post', error);
      }
    },
    delete: async (id: string) => {
      await assertExisting('Blog post', () => adminContentRepository.blogPosts.getById(id));
      return adminContentRepository.blogPosts.delete(id);
    }
  }
};
