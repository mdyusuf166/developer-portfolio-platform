import { z } from 'zod';

export const socialLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1)
});

export const skillSummarySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  featured: z.boolean().default(false)
});

export const projectSummarySchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  imageUrl: z.string().nullable().optional(),
  description: z.string().optional(),
  problem: z.string().nullable().optional(),
  approach: z.string().nullable().optional(),
  implementation: z.string().nullable().optional(),
  architecture: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  results: z.array(z.string()).default([]),
  technicalChallenges: z.array(z.string()).default([]),
  learnings: z.array(z.string()).default([]),
  githubUrl: z.string().nullable().optional(),
  demoUrl: z.string().nullable().optional(),
  status: z.string().default('draft'),
  featured: z.boolean().default(false),
  category: z.string().optional().default('Other')
});

export const blogSummarySchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().optional(),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  coverImageUrl: z.string().nullable().optional(),
  published: z.boolean().default(false),
  publishedAt: z.string().nullable().optional()
});

export const experienceSummarySchema = z.object({
  id: z.string().min(1),
  role: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional().default('Remote'),
  current: z.boolean().default(false),
  status: z.string().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  responsibilities: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  description: z.string().min(1)
});

export const educationSummarySchema = z.object({
  id: z.string().min(1),
  degree: z.string().min(1),
  school: z.string().min(1),
  field: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  coursework: z.array(z.string()).default([]),
  status: z.string().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional()
});

export const serviceSummarySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.string().optional().nullable(),
  description: z.string().min(1),
  status: z.string().optional()
});

export const researchSummarySchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  summary: z.string(),
  area: z.string().nullable().optional(),
  methodology: z.string().nullable().optional(),
  technologies: z.array(z.string()).default([]),
  publicationDate: z.string().nullable().optional(),
  publicationUrl: z.string().nullable().optional(),
  paperUrl: z.string().nullable().optional(),
  githubUrl: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  fileUrl: z.string().nullable().optional(),
  status: z.string()
});

export const achievementSummarySchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  issuer: z.string().nullable().optional(),
  awardDate: z.string().nullable().optional(),
  credentialUrl: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  documentUrl: z.string().nullable().optional(),
  status: z.string().optional()
});

export const profileReadSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  headline: z.string().min(1),
  bio: z.string().min(1),
  location: z.string().optional(),
  email: z.string().email().optional(),
  availability: z.string().min(1),
  github: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  resume: z.string().optional(),
  profileImageUrl: z.string().optional(),
  socialLinks: z.array(socialLinkSchema).default([]),
  stats: z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })).default([]),
  skills: z.array(skillSummarySchema).default([]),
  projects: z.array(projectSummarySchema).default([]),
  blogPosts: z.array(blogSummarySchema).default([]),
  experience: z.array(experienceSummarySchema).default([]),
  education: z.array(educationSummarySchema).default([]),
  services: z.array(serviceSummarySchema).default([]),
  research: z.array(researchSummarySchema).default([]),
  achievements: z.array(achievementSummarySchema).default([]),
  meta: z.object({ generatedAt: z.string().min(1) }).default({ generatedAt: new Date().toISOString() })
});

export type ProfileReadDto = z.infer<typeof profileReadSchema>;
