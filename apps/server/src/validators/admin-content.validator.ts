import { z } from 'zod';

const nullableDate = z.union([z.string().datetime({ offset: true }).or(z.string().date()), z.null()]).optional();
const optionalDate = z.union([z.string().datetime({ offset: true }).or(z.string().date()), z.null()]).optional();
const textList = z.array(z.string().trim().min(1).max(500)).max(100).optional().default([]);
const optionalUrl = z.string().trim().url().max(500).optional().nullable();
const optionalAssetUrl = z.string().trim().max(500).optional().nullable();

export const projectCreateSchema = z.object({
  slug: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(200),
  summary: z.string().trim().min(1).max(500),
  description: z.string().trim().max(10000).optional().default(''),
  problem: z.string().trim().max(5000).optional().nullable(),
  approach: z.string().trim().max(10000).optional().nullable(),
  implementation: z.string().trim().max(10000).optional().nullable(),
  architecture: textList,
  technologies: textList,
  results: textList,
  technicalChallenges: textList,
  learnings: textList,
  githubUrl: optionalUrl,
  demoUrl: optionalUrl,
  imageUrl: z.string().trim().max(500).optional().nullable(),
  imageAssetId: z.string().trim().min(1).max(64).optional().nullable(),
  featured: z.boolean().optional().default(false),
  status: z.enum(['draft', 'published', 'archived']).optional().default('draft'),
  category: z.string().trim().max(120).optional().default('Other')
});

export const projectUpdateSchema = projectCreateSchema.partial();

export const skillCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(120),
  featured: z.boolean().optional().default(false)
});

export const skillUpdateSchema = skillCreateSchema.partial();

export const experienceCreateSchema = z.object({
  company: z.string().trim().min(1).max(200),
  role: z.string().trim().min(1).max(200),
  location: z.string().trim().min(1).max(200).optional().default('Remote'),
  startDate: optionalDate,
  endDate: optionalDate,
  current: z.boolean().optional().default(false),
  description: z.string().trim().min(1),
  responsibilities: textList,
  technologies: textList,
  status: z.enum(['draft', 'published', 'archived']).optional().default('draft')
});

export const experienceUpdateSchema = experienceCreateSchema.partial();

export const educationCreateSchema = z.object({
  school: z.string().trim().min(1).max(200),
  degree: z.string().trim().min(1).max(200),
  field: z.string().trim().max(200).optional().nullable(),
  location: z.string().trim().max(200).optional().nullable(),
  startDate: optionalDate,
  endDate: optionalDate,
  description: z.string().trim().max(2000).optional().nullable(),
  coursework: textList,
  status: z.enum(['draft', 'published', 'archived']).optional().default('draft')
});

export const educationUpdateSchema = educationCreateSchema.partial();

export const researchCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  summary: z.string().trim().min(1).max(1000),
  area: z.string().trim().max(200).optional().nullable(),
  methodology: z.string().trim().max(10000).optional().nullable(),
  technologies: textList,
  publicationDate: optionalDate,
  publicationUrl: optionalUrl,
  paperUrl: optionalUrl,
  githubUrl: optionalUrl,
  notes: z.string().trim().max(10000).optional().nullable(),
  imageUrl: optionalAssetUrl,
  imageAssetId: z.string().trim().min(1).max(64).optional().nullable(),
  fileUrl: optionalAssetUrl,
  fileAssetId: z.string().trim().min(1).max(64).optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']).optional().default('draft')
});

export const researchUpdateSchema = researchCreateSchema.partial();

export const achievementCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(2000),
  issuer: z.string().trim().max(200).optional().nullable(),
  awardDate: nullableDate,
  credentialUrl: optionalUrl,
  imageUrl: optionalAssetUrl,
  imageAssetId: z.string().trim().min(1).max(64).optional().nullable(),
  documentUrl: optionalAssetUrl,
  documentAssetId: z.string().trim().min(1).max(64).optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']).optional().default('draft')
});

export const achievementUpdateSchema = achievementCreateSchema.partial();

export const serviceCreateSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(2000),
  category: z.string().trim().max(120).optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']).optional().default('draft')
});

export const serviceUpdateSchema = serviceCreateSchema.partial();

export const blogPostCreateSchema = z.object({
  slug: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(200),
  excerpt: z.string().trim().min(1).max(500),
  content: z.string().trim().min(1),
  category: z.string().trim().min(1).max(120),
  tags: textList,
  coverImageUrl: optionalAssetUrl,
  coverImageAssetId: z.string().trim().min(1).max(64).optional().nullable(),
  published: z.boolean().optional().default(false),
  publishedAt: optionalDate
});

export const blogPostUpdateSchema = blogPostCreateSchema.partial();

export const portfolioProfileSchema = z.object({
  name: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(160),
  headline: z.string().trim().min(1).max(500),
  bio: z.string().trim().min(1).max(5000),
  location: z.string().trim().max(200).optional().nullable(),
  email: z.string().trim().email().max(254).optional().nullable(),
  github: optionalUrl,
  linkedin: optionalUrl,
  profileImageUrl: optionalAssetUrl,
  profileImageAssetId: z.string().trim().min(1).max(64).optional().nullable(),
  profileImagePublic: z.boolean().optional().default(false),
  resumeUrl: optionalAssetUrl,
  resumeAssetId: z.string().trim().min(1).max(64).optional().nullable(),
  socials: z.array(z.object({ label: z.string().trim().min(1).max(80), href: z.string().trim().min(1).max(500) })).max(20).optional().default([])
});
