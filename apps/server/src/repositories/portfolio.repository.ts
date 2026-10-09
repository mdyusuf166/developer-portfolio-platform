import { prisma } from '../lib/prisma.js';

export const portfolioRepository = {
  getStoredProfile() {
    return prisma.portfolioProfile.findUnique({ where: { id: 'primary' } });
  },

  saveProfile(data: Parameters<typeof prisma.portfolioProfile.upsert>[0]['create']) {
    return prisma.portfolioProfile.upsert({
      where: { id: 'primary' },
      create: { ...data, id: 'primary' },
      update: data
    });
  },

  async getPublishedProjects() {
    return prisma.project.findMany({
      where: { status: 'published' },
      orderBy: [{ featured: 'desc' }, { updatedAt: 'desc' }]
    });
  },

  async getPublishedProjectBySlug(slug: string) {
    return prisma.project.findFirst({ where: { slug, status: 'published' } });
  },

  async getProfileSnapshot() {
    const [user, storedProfile, projects, blogPosts, skills, experience, education, services, research, achievements] = await Promise.all([
      prisma.user.findFirst({
        orderBy: { createdAt: 'asc' }
      }),
      prisma.portfolioProfile.findUnique({ where: { id: 'primary' } }),
      prisma.project.findMany({
        where: { status: 'published' },
        orderBy: { updatedAt: 'desc' },
        take: 12
      }),
      prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { publishedAt: 'desc' }
      }),
      prisma.skill.findMany({
        orderBy: [{ featured: 'desc' }, { name: 'asc' }]
      }),
      prisma.experience.findMany({
        where: { status: 'published' },
        orderBy: { startDate: 'desc' }
      }),
      prisma.education.findMany({
        where: { status: 'published' },
        orderBy: { startDate: 'desc' }
      }),
      prisma.service.findMany({
        where: { status: 'published' },
        orderBy: { title: 'asc' }
      }),
      prisma.researchItem.findMany({
        where: { status: 'published' },
        orderBy: { publicationDate: 'desc' }
      }),
      prisma.achievement.findMany({
        where: { status: 'published' },
        orderBy: { awardDate: 'desc' }
      })
    ]);

    return {
      profile: {
        name: storedProfile?.name ?? user?.name ?? 'MD MAHTAB AHMED MAHIN',
        title: storedProfile?.title ?? 'AI / ML ENGINEER',
        headline: storedProfile?.headline ?? 'Building intelligent systems, machine learning applications, and generative AI experiences.',
        bio: storedProfile?.bio ?? 'AI/ML Engineer focused on building intelligent systems, machine learning applications, generative AI systems, and production-quality software.',
        location: storedProfile?.location ?? undefined,
        email: storedProfile?.email ?? user?.email ?? undefined,
        github: storedProfile?.github ?? undefined,
        linkedin: storedProfile?.linkedin ?? undefined,
        profileImageUrl: storedProfile?.profileImageUrl ?? undefined,
        resume: storedProfile?.resumeUrl ?? undefined,
        availability: 'Portfolio in progress'
      },
      socialLinks: Array.isArray(storedProfile?.socials) ? storedProfile.socials : [],
      stats: [
        { label: 'Focus', value: 'Machine Learning and Deep Learning' },
        { label: 'Interests', value: 'Generative AI, LLMs, and RAG' },
        { label: 'Foundation', value: 'Software Engineering' }
      ],
      projects: projects.map((project) => ({
        id: project.id,
        slug: project.slug,
        title: project.title,
        summary: project.summary,
        description: project.description,
        imageUrl: project.imageUrl,
        problem: project.problem,
        approach: project.approach,
        implementation: project.implementation,
        architecture: project.architecture,
        technologies: project.technologies,
        results: project.results,
        technicalChallenges: project.technicalChallenges,
        learnings: project.learnings,
        githubUrl: project.githubUrl,
        demoUrl: project.demoUrl,
        status: project.status,
        featured: project.featured,
        category: project.category ?? 'Other'
      })),
      blogPosts: blogPosts.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        tags: post.tags,
        coverImageUrl: post.coverImageUrl,
        published: post.published,
        publishedAt: post.publishedAt?.toISOString() ?? null
      })),
      skills: skills.map((skill) => ({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        featured: skill.featured
      })),
      experience: experience.map((item) => ({
        id: item.id,
        role: item.role,
        company: item.company,
        location: item.location ?? 'Remote',
        current: item.current,
        status: item.status,
        startDate: item.startDate?.toISOString() ?? null,
        endDate: item.endDate?.toISOString() ?? null,
        description: item.description,
        responsibilities: item.responsibilities,
        technologies: item.technologies
      })),
      education: education.map((item) => ({
        id: item.id,
        degree: item.degree,
        school: item.school,
        field: item.field,
        description: item.description,
        coursework: item.coursework,
        status: item.status,
        startDate: item.startDate?.toISOString() ?? null,
        endDate: item.endDate?.toISOString() ?? null
      })),
      research: research.map((item) => ({ ...item, publicationDate: item.publicationDate?.toISOString() ?? null })),
      achievements: achievements.map((item) => ({ ...item, awardDate: item.awardDate?.toISOString() ?? null })),
      services: services.map((service) => ({
        id: service.id,
        title: service.title,
        category: service.category,
        description: service.description,
        status: service.status
      }))
    };
  }
};
