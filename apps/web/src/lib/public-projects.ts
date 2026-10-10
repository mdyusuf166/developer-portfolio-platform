import type { Project } from '../types';

const configuredApiBaseUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '');
const isLoopbackApiUrl = (value: string) => {
  try {
    const hostname = new URL(value).hostname.replace(/^\[|\]$/g, '').toLowerCase();
    return hostname === 'localhost' || hostname.endsWith('.localhost') || hostname === '::1' || hostname === '0.0.0.0' || /^127\./.test(hostname);
  } catch {
    return false;
  }
};

// Production builds must never send a visitor's browser to a localhost API.
export const publicApiBaseUrl = configuredApiBaseUrl && !(import.meta.env.PROD && isLoopbackApiUrl(configuredApiBaseUrl))
  ? configuredApiBaseUrl
  : '';

const getUrlBase = () => publicApiBaseUrl || window.location.origin;

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

export function isPrivateUploadUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  try {
    let pathname = new URL(value, getUrlBase()).pathname;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      if (/^\/uploads(?:\/|$)/i.test(pathname)) return true;
      const decoded = decodeURIComponent(pathname);
      if (decoded === pathname) return false;
      pathname = decoded;
    }
    return /^\/uploads(?:\/|$)/i.test(pathname);
  } catch {
    return true;
  }
}

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
  const imageUrl = isPrivateUploadUrl(record.imageUrl) ? undefined : record.imageUrl ?? undefined;
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
    imageUrl,
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
  return new URL(imageUrl, getUrlBase()).toString();
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
