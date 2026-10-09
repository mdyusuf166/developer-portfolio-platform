import { Prisma, type Achievement, type BlogPost, type Education, type Experience, type Project, type ResearchItem, type Service, type Skill } from '@prisma/client';

import { prisma } from '../lib/prisma.js';
import { DEFAULT_LIMIT, DEFAULT_PAGE, type ListQueryInput, type ListResponse } from '../validators/query.validator.js';

type Pagination = { skip: number; take: number };

const makePagination = <T>(items: T[], total: number, page: number, limit: number): ListResponse<T> => ({
  data: items,
  meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)), hasNextPage: page * limit < total, hasPreviousPage: page > 1 }
});

const applyListQuery = async <T>(query: ListQueryInput | undefined, operations: { findMany: (pagination: Pagination) => Promise<T[]>; count: () => Promise<number> }): Promise<ListResponse<T>> => {
  const page = query?.page ?? DEFAULT_PAGE;
  const limit = query?.limit ?? DEFAULT_LIMIT;
  const [items, total] = await Promise.all([operations.findMany({ skip: (page - 1) * limit, take: limit }), operations.count()]);
  return makePagination(items, total, page, limit);
};

const stringFilter = (query: ListQueryInput | undefined, key: string) => {
  const value = query?.[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
};
const booleanFilter = (query: ListQueryInput | undefined, key: string) => typeof query?.[key] === 'boolean' ? query[key] : undefined;

const projectWhere = (query: ListQueryInput | undefined): Prisma.ProjectWhereInput => {
  const category = stringFilter(query, 'category'); const status = stringFilter(query, 'status'); const featured = booleanFilter(query, 'featured'); const search = query?.search?.trim();
  return { ...(category ? { category } : {}), ...(status ? { status } : {}), ...(featured !== undefined ? { featured } : {}), ...(search ? { OR: [{ title: { contains: search, mode: 'insensitive' } }, { summary: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }] } : {}) };
};
const projectOrderBy = (query: ListQueryInput | undefined): Prisma.ProjectOrderByWithRelationInput => {
  const sortOrder = query?.sortOrder ?? 'desc';
  switch (query?.sortBy) { case 'createdAt': return { createdAt: sortOrder }; case 'title': return { title: sortOrder }; case 'category': return { category: sortOrder }; case 'status': return { status: sortOrder }; default: return { updatedAt: sortOrder }; }
};

const skillWhere = (query: ListQueryInput | undefined): Prisma.SkillWhereInput => {
  const category = stringFilter(query, 'category'); const featured = booleanFilter(query, 'featured'); const search = query?.search?.trim();
  return { ...(category ? { category } : {}), ...(featured !== undefined ? { featured } : {}), ...(search ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { category: { contains: search, mode: 'insensitive' } }] } : {}) };
};

const experienceWhere = (query: ListQueryInput | undefined): Prisma.ExperienceWhereInput => {
  const company = stringFilter(query, 'company'); const role = stringFilter(query, 'role'); const current = booleanFilter(query, 'current'); const status = stringFilter(query, 'status'); const search = query?.search?.trim();
  return { ...(company ? { company } : {}), ...(role ? { role } : {}), ...(current !== undefined ? { current } : {}), ...(status ? { status } : {}), ...(search ? { OR: [{ company: { contains: search, mode: 'insensitive' } }, { role: { contains: search, mode: 'insensitive' } }, { location: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }] } : {}) };
};
const experienceOrderBy = (query: ListQueryInput | undefined): Prisma.ExperienceOrderByWithRelationInput => {
  const sortOrder = query?.sortOrder ?? 'desc';
  switch (query?.sortBy) { case 'endDate': return { endDate: sortOrder }; case 'company': return { company: sortOrder }; case 'role': return { role: sortOrder }; case 'updatedAt': return { updatedAt: sortOrder }; default: return { startDate: sortOrder }; }
};

const educationWhere = (query: ListQueryInput | undefined): Prisma.EducationWhereInput => {
  const school = stringFilter(query, 'school'); const degree = stringFilter(query, 'degree'); const status = stringFilter(query, 'status'); const search = query?.search?.trim();
  return { ...(school ? { school } : {}), ...(degree ? { degree } : {}), ...(status ? { status } : {}), ...(search ? { OR: [{ school: { contains: search, mode: 'insensitive' } }, { degree: { contains: search, mode: 'insensitive' } }, { field: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }] } : {}) };
};
const educationOrderBy = (query: ListQueryInput | undefined): Prisma.EducationOrderByWithRelationInput => {
  const sortOrder = query?.sortOrder ?? 'desc';
  switch (query?.sortBy) { case 'endDate': return { endDate: sortOrder }; case 'school': return { school: sortOrder }; case 'degree': return { degree: sortOrder }; case 'updatedAt': return { updatedAt: sortOrder }; default: return { startDate: sortOrder }; }
};

const researchWhere = (query: ListQueryInput | undefined): Prisma.ResearchItemWhereInput => {
  const status = stringFilter(query, 'status'); const search = query?.search?.trim();
  return { ...(status ? { status } : {}), ...(search ? { OR: [{ title: { contains: search, mode: 'insensitive' } }, { summary: { contains: search, mode: 'insensitive' } }] } : {}) };
};
const researchOrderBy = (query: ListQueryInput | undefined): Prisma.ResearchItemOrderByWithRelationInput => {
  const sortOrder = query?.sortOrder ?? 'desc';
  switch (query?.sortBy) { case 'updatedAt': return { updatedAt: sortOrder }; case 'title': return { title: sortOrder }; case 'status': return { status: sortOrder }; default: return { createdAt: sortOrder }; }
};

const achievementWhere = (query: ListQueryInput | undefined): Prisma.AchievementWhereInput => {
  const issuer = stringFilter(query, 'issuer'); const status = stringFilter(query, 'status'); const search = query?.search?.trim();
  return { ...(issuer ? { issuer } : {}), ...(status ? { status } : {}), ...(search ? { OR: [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }, { issuer: { contains: search, mode: 'insensitive' } }] } : {}) };
};
const achievementOrderBy = (query: ListQueryInput | undefined): Prisma.AchievementOrderByWithRelationInput => {
  const sortOrder = query?.sortOrder ?? 'desc';
  switch (query?.sortBy) { case 'title': return { title: sortOrder }; case 'issuer': return { issuer: sortOrder }; case 'createdAt': return { createdAt: sortOrder }; default: return { awardDate: sortOrder }; }
};

const serviceWhere = (query: ListQueryInput | undefined): Prisma.ServiceWhereInput => {
  const category = stringFilter(query, 'category'); const status = stringFilter(query, 'status'); const search = query?.search?.trim();
  return { ...(category ? { category } : {}), ...(status ? { status } : {}), ...(search ? { OR: [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }, { category: { contains: search, mode: 'insensitive' } }] } : {}) };
};
const serviceOrderBy = (query: ListQueryInput | undefined): Prisma.ServiceOrderByWithRelationInput => {
  const sortOrder = query?.sortOrder ?? 'asc';
  switch (query?.sortBy) { case 'category': return { category: sortOrder }; case 'createdAt': return { createdAt: sortOrder }; case 'updatedAt': return { updatedAt: sortOrder }; default: return { title: sortOrder }; }
};

const blogPostWhere = (query: ListQueryInput | undefined): Prisma.BlogPostWhereInput => {
  const category = stringFilter(query, 'category'); const published = booleanFilter(query, 'published'); const search = query?.search?.trim();
  return { ...(category ? { category } : {}), ...(published !== undefined ? { published } : {}), ...(search ? { OR: [{ title: { contains: search, mode: 'insensitive' } }, { excerpt: { contains: search, mode: 'insensitive' } }, { content: { contains: search, mode: 'insensitive' } }, { category: { contains: search, mode: 'insensitive' } }] } : {}) };
};
const blogPostOrderBy = (query: ListQueryInput | undefined): Prisma.BlogPostOrderByWithRelationInput => {
  const sortOrder = query?.sortOrder ?? 'desc';
  switch (query?.sortBy) { case 'publishedAt': return { publishedAt: sortOrder }; case 'createdAt': return { createdAt: sortOrder }; case 'title': return { title: sortOrder }; case 'category': return { category: sortOrder }; default: return { updatedAt: sortOrder }; }
};

export const adminContentRepository = {
  projects: {
    list: (query?: ListQueryInput) => { const where = projectWhere(query); const orderBy = projectOrderBy(query); return applyListQuery<Project>(query, { findMany: ({ skip, take }) => { const args: Prisma.ProjectFindManyArgs = { where, orderBy, skip, take }; return prisma.project.findMany(args); }, count: () => { const args: Prisma.ProjectCountArgs = { where }; return prisma.project.count(args); } }); },
    getById: (id: string) => prisma.project.findUnique({ where: { id } }), create: (data: Parameters<typeof prisma.project.create>[0]['data']) => prisma.project.create({ data }), update: (id: string, data: Parameters<typeof prisma.project.update>[0]['data']) => prisma.project.update({ where: { id }, data }), delete: (id: string) => prisma.project.delete({ where: { id } })
  },
  skills: {
    list: (query?: ListQueryInput) => { const where = skillWhere(query); const orderBy: Prisma.SkillOrderByWithRelationInput[] = [{ featured: 'desc' }, { name: 'asc' }]; return applyListQuery<Skill>(query, { findMany: ({ skip, take }) => { const args: Prisma.SkillFindManyArgs = { where, orderBy, skip, take }; return prisma.skill.findMany(args); }, count: () => { const args: Prisma.SkillCountArgs = { where }; return prisma.skill.count(args); } }); },
    getById: (id: string) => prisma.skill.findUnique({ where: { id } }), create: (data: Parameters<typeof prisma.skill.create>[0]['data']) => prisma.skill.create({ data }), update: (id: string, data: Parameters<typeof prisma.skill.update>[0]['data']) => prisma.skill.update({ where: { id }, data }), delete: (id: string) => prisma.skill.delete({ where: { id } })
  },
  experience: {
    list: (query?: ListQueryInput) => { const where = experienceWhere(query); const orderBy = experienceOrderBy(query); return applyListQuery<Experience>(query, { findMany: ({ skip, take }) => { const args: Prisma.ExperienceFindManyArgs = { where, orderBy, skip, take }; return prisma.experience.findMany(args); }, count: () => { const args: Prisma.ExperienceCountArgs = { where }; return prisma.experience.count(args); } }); },
    getById: (id: string) => prisma.experience.findUnique({ where: { id } }), create: (data: Parameters<typeof prisma.experience.create>[0]['data']) => prisma.experience.create({ data }), update: (id: string, data: Parameters<typeof prisma.experience.update>[0]['data']) => prisma.experience.update({ where: { id }, data }), delete: (id: string) => prisma.experience.delete({ where: { id } })
  },
  education: {
    list: (query?: ListQueryInput) => { const where = educationWhere(query); const orderBy = educationOrderBy(query); return applyListQuery<Education>(query, { findMany: ({ skip, take }) => { const args: Prisma.EducationFindManyArgs = { where, orderBy, skip, take }; return prisma.education.findMany(args); }, count: () => { const args: Prisma.EducationCountArgs = { where }; return prisma.education.count(args); } }); },
    getById: (id: string) => prisma.education.findUnique({ where: { id } }), create: (data: Parameters<typeof prisma.education.create>[0]['data']) => prisma.education.create({ data }), update: (id: string, data: Parameters<typeof prisma.education.update>[0]['data']) => prisma.education.update({ where: { id }, data }), delete: (id: string) => prisma.education.delete({ where: { id } })
  },
  research: {
    list: (query?: ListQueryInput) => { const where = researchWhere(query); const orderBy = researchOrderBy(query); return applyListQuery<ResearchItem>(query, { findMany: ({ skip, take }) => { const args: Prisma.ResearchItemFindManyArgs = { where, orderBy, skip, take }; return prisma.researchItem.findMany(args); }, count: () => { const args: Prisma.ResearchItemCountArgs = { where }; return prisma.researchItem.count(args); } }); },
    getById: (id: string) => prisma.researchItem.findUnique({ where: { id } }), create: (data: Parameters<typeof prisma.researchItem.create>[0]['data']) => prisma.researchItem.create({ data }), update: (id: string, data: Parameters<typeof prisma.researchItem.update>[0]['data']) => prisma.researchItem.update({ where: { id }, data }), delete: (id: string) => prisma.researchItem.delete({ where: { id } })
  },
  achievements: {
    list: (query?: ListQueryInput) => { const where = achievementWhere(query); const orderBy = achievementOrderBy(query); return applyListQuery<Achievement>(query, { findMany: ({ skip, take }) => { const args: Prisma.AchievementFindManyArgs = { where, orderBy, skip, take }; return prisma.achievement.findMany(args); }, count: () => { const args: Prisma.AchievementCountArgs = { where }; return prisma.achievement.count(args); } }); },
    getById: (id: string) => prisma.achievement.findUnique({ where: { id } }), create: (data: Parameters<typeof prisma.achievement.create>[0]['data']) => prisma.achievement.create({ data }), update: (id: string, data: Parameters<typeof prisma.achievement.update>[0]['data']) => prisma.achievement.update({ where: { id }, data }), delete: (id: string) => prisma.achievement.delete({ where: { id } })
  },
  services: {
    list: (query?: ListQueryInput) => { const where = serviceWhere(query); const orderBy = serviceOrderBy(query); return applyListQuery<Service>(query, { findMany: ({ skip, take }) => { const args: Prisma.ServiceFindManyArgs = { where, orderBy, skip, take }; return prisma.service.findMany(args); }, count: () => { const args: Prisma.ServiceCountArgs = { where }; return prisma.service.count(args); } }); },
    getById: (id: string) => prisma.service.findUnique({ where: { id } }), create: (data: Parameters<typeof prisma.service.create>[0]['data']) => prisma.service.create({ data }), update: (id: string, data: Parameters<typeof prisma.service.update>[0]['data']) => prisma.service.update({ where: { id }, data }), delete: (id: string) => prisma.service.delete({ where: { id } })
  },
  blogPosts: {
    list: (query?: ListQueryInput) => { const where = blogPostWhere(query); const orderBy = blogPostOrderBy(query); return applyListQuery<BlogPost>(query, { findMany: ({ skip, take }) => { const args: Prisma.BlogPostFindManyArgs = { where, orderBy, skip, take }; return prisma.blogPost.findMany(args); }, count: () => { const args: Prisma.BlogPostCountArgs = { where }; return prisma.blogPost.count(args); } }); },
    getById: (id: string) => prisma.blogPost.findUnique({ where: { id } }), create: (data: Parameters<typeof prisma.blogPost.create>[0]['data']) => prisma.blogPost.create({ data }), update: (id: string, data: Parameters<typeof prisma.blogPost.update>[0]['data']) => prisma.blogPost.update({ where: { id }, data }), delete: (id: string) => prisma.blogPost.delete({ where: { id } })
  }
};
