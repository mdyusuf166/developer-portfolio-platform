import { z } from 'zod';

import { AppError } from '../errors/AppError.js';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

const firstValue = (value: unknown) => (Array.isArray(value) ? value[0] : value);

const parseBooleanFilter = (value: unknown) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }

  return value;
};

export const normalizeQueryObject = (query: Record<string, unknown>) => {
  const normalized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(query)) {
    const nextValue = firstValue(value);
    normalized[key] = key === 'page' || key === 'limit' ? nextValue : key === 'featured' || key === 'published' || key === 'current' ? parseBooleanFilter(nextValue) : typeof nextValue === 'string' ? nextValue.trim() : nextValue;
  }

  return normalized;
};

export type ListQueryInput = {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder: 'asc' | 'desc';
  [key: string]: unknown;
};

export type ListResponseMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ListResponse<T> = {
  data: T[];
  meta: ListResponseMeta;
};

export const createListQuerySchema = <TFilters extends z.ZodRawShape>(options: {
  allowedSortBy: readonly string[];
  filters?: TFilters;
  defaultSortBy?: string;
  defaultSortOrder?: 'asc' | 'desc';
}) => {
  const filterShape = options.filters ?? {};

  return z.object({
    page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
    limit: z.coerce.number().int().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
    search: z
      .string()
      .trim()
      .max(200)
      .optional()
      .transform((value) => (value && value.length > 0 ? value : undefined)),
    sortBy: z.enum(options.allowedSortBy as [string, ...string[]]).optional().default(options.defaultSortBy ?? options.allowedSortBy[0]),
    sortOrder: z.enum(['asc', 'desc']).default(options.defaultSortOrder ?? 'desc'),
    ...filterShape
  });
};

export const validateListQuery = <T extends z.ZodTypeAny>(schema: T, rawQuery: Record<string, unknown>) => {
  const result = schema.safeParse(normalizeQueryObject(rawQuery));

  if (!result.success) {
    throw new AppError('Invalid query parameters', 400, 'VALIDATION_ERROR', result.error.flatten());
  }

  return result.data as z.infer<T>;
};

export const projectListQuerySchema = createListQuerySchema({
  allowedSortBy: ['updatedAt', 'createdAt', 'title', 'category', 'status'],
  defaultSortBy: 'updatedAt',
  defaultSortOrder: 'desc',
  filters: {
    category: z.string().trim().min(1).max(120).optional(),
    featured: z.boolean().optional(),
    status: z.enum(['draft', 'published', 'archived']).optional()
  }
});

export const skillListQuerySchema = createListQuerySchema({
  allowedSortBy: ['featured', 'name', 'category', 'createdAt'],
  defaultSortBy: 'featured',
  defaultSortOrder: 'desc',
  filters: {
    category: z.string().trim().min(1).max(120).optional(),
    featured: z.boolean().optional()
  }
});

export const experienceListQuerySchema = createListQuerySchema({
  allowedSortBy: ['startDate', 'endDate', 'company', 'role', 'updatedAt'],
  defaultSortBy: 'startDate',
  defaultSortOrder: 'desc',
  filters: {
    company: z.string().trim().min(1).max(200).optional(),
    role: z.string().trim().min(1).max(200).optional(),
    current: z.boolean().optional(),
    status: z.enum(['draft', 'published', 'archived']).optional()
  }
});

export const educationListQuerySchema = createListQuerySchema({
  allowedSortBy: ['startDate', 'endDate', 'school', 'degree', 'updatedAt'],
  defaultSortBy: 'startDate',
  defaultSortOrder: 'desc',
  filters: {
    school: z.string().trim().min(1).max(200).optional(),
    degree: z.string().trim().min(1).max(200).optional(),
    status: z.enum(['draft', 'published', 'archived']).optional()
  }
});

export const researchListQuerySchema = createListQuerySchema({
  allowedSortBy: ['createdAt', 'updatedAt', 'title', 'status'],
  defaultSortBy: 'createdAt',
  defaultSortOrder: 'desc',
  filters: {
    status: z.enum(['draft', 'published', 'archived']).optional()
  }
});

export const achievementListQuerySchema = createListQuerySchema({
  allowedSortBy: ['awardDate', 'title', 'issuer', 'createdAt'],
  defaultSortBy: 'awardDate',
  defaultSortOrder: 'desc',
  filters: {
    issuer: z.string().trim().min(1).max(200).optional(),
    status: z.enum(['draft', 'published', 'archived']).optional()
  }
});

export const serviceListQuerySchema = createListQuerySchema({
  allowedSortBy: ['title', 'category', 'createdAt', 'updatedAt'],
  defaultSortBy: 'title',
  defaultSortOrder: 'asc',
  filters: {
    category: z.string().trim().min(1).max(120).optional(),
    status: z.enum(['draft', 'published', 'archived']).optional()
  }
});

export const blogListQuerySchema = createListQuerySchema({
  allowedSortBy: ['publishedAt', 'updatedAt', 'createdAt', 'title', 'category'],
  defaultSortBy: 'updatedAt',
  defaultSortOrder: 'desc',
  filters: {
    category: z.string().trim().min(1).max(120).optional(),
    published: z.boolean().optional()
  }
});
