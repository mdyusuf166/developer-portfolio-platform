import type { Project } from '../types';

export const publicApiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export type ProjectRecord = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  problem?: string | null;
  approach?: string | null;
  implementation?: string | null;
  architecture?: string[];
  technologies?: string[];
  results?: string[];
  technicalChallenges?: string[];
  learnings?: string[];
  githubUrl?: string | null;
  demoUrl?: string | null;
  imageUrl?: string | null;
  category: string;
  featured: boolean;
  status: string;
};

type ProjectResponse = {
  success: boolean;
  data?: ProjectRecord[];
  error?: { message?: string };
};

type ProjectDetailResponse = {
  success: boolean;
  data?: ProjectRecord;
  error?: { message?: string };
};

export function toProject(record: ProjectRecord): Project {
  const imageUrl = record.imageUrl ?? undefined;
  return {
    slug: record.slug,
    title: record.title,
    shortDescription: record.summary,
    description: record.description,
    problem: record.problem ?? undefined,
    approach: record.approach ?? undefined,
    implementation: record.implementation ?? undefined,
    architecture: record.architecture ?? [],
    technologies: record.technologies ?? [],
    results: record.results ?? [],
    technicalChallenges: record.technicalChallenges ?? [],
    learnings: record.learnings ?? [],
    githubUrl: record.githubUrl ?? undefined,
    demoUrl: record.demoUrl ?? undefined,
    imageUrl: record.imageUrl,
    category: record.category,
    featured: record.featured,
    status: record.status,
    image: imageUrl ? {
      src: new URL(imageUrl, publicApiBaseUrl).toString(),
      alt: `${record.title} project image`
    } : undefined
  };
}

export async function getPublishedProjects(signal?: AbortSignal): Promise<Project[]> {
  const response = await fetch(`${publicApiBaseUrl}/api/v1/projects`, { signal });
  const payload = await response.json() as ProjectResponse;
  if (!response.ok || !payload.success || !Array.isArray(payload.data)) {
    throw new Error(payload.error?.message ?? 'Unable to load published projects.');
  }

  return payload.data.map(toProject);
}

export function resolveProjectImageUrl(imageUrl: string): string {
  return new URL(imageUrl, publicApiBaseUrl).toString();
}

export async function getPublishedProjectBySlug(slug: string, signal?: AbortSignal): Promise<Project> {
  const response = await fetch(`${publicApiBaseUrl}/api/v1/projects/${encodeURIComponent(slug)}`, { signal });
  const payload = await response.json() as ProjectDetailResponse;
  if (!response.ok || !payload.success || !payload.data) {
    const error = new Error(payload.error?.message ?? 'Unable to load project.');
    Object.assign(error, { status: response.status });
    throw error;
  }
  return toProject(payload.data);
}