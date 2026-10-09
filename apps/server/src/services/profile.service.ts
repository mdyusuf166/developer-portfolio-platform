import { AppError } from '../errors/AppError.js';
import { portfolioRepository } from '../repositories/portfolio.repository.js';
import { profileReadSchema, type ProfileReadDto } from '../validators/profile.validator.js';
import { logger } from '../lib/logger.js';

const databaseUnavailable = (error: unknown) => {
  logger.error('Portfolio database operation failed', { errorName: error instanceof Error ? error.name : 'UnknownError' });
  return new AppError('Database unavailable', 503, 'DATABASE_UNAVAILABLE');
};

export const profileService = {
  async getPublishedProjectBySlug(slug: string) {
    try {
      const project = await portfolioRepository.getPublishedProjectBySlug(slug);
      if (!project) throw new AppError('Project not found', 404, 'NOT_FOUND');
      return project;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw databaseUnavailable(error);
    }
  },

  async getAdminProfile() {
    const profile = await portfolioRepository.getStoredProfile();
    return profile ? [profile] : [];
  },

  async saveAdminProfile(input: Record<string, unknown>) {
    return portfolioRepository.saveProfile(input as Parameters<typeof portfolioRepository.saveProfile>[0]);
  },

  async getPublishedProjects() {
    try {
      return await portfolioRepository.getPublishedProjects();
    } catch (error) {
      throw databaseUnavailable(error);
    }
  },

  async getProfile(): Promise<ProfileReadDto> {
    try {
      const portfolio = await portfolioRepository.getProfileSnapshot();

      return profileReadSchema.parse({
        ...portfolio.profile,
        socialLinks: portfolio.socialLinks,
        stats: portfolio.stats,
        skills: portfolio.skills,
        projects: portfolio.projects,
        blogPosts: portfolio.blogPosts,
        experience: portfolio.experience,
        education: portfolio.education,
        services: portfolio.services,
        research: portfolio.research,
        achievements: portfolio.achievements,
        meta: {
          generatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw databaseUnavailable(error);
    }
  }
};
