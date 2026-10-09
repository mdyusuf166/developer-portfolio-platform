import { useContext, useEffect, useState } from 'react';

import { profile as localProfile } from '../data/profile';
import { isPrivateUploadUrl, publicApiBaseUrl, resolveProjectImageUrl } from '../lib/public-projects';
import type { Achievement, BlogPost, Education, Experience, Profile, ResearchItem, Service, SkillGroup } from '../types';
import { PreviewDataContext } from '../preview/preview-context';

type Snapshot = {
  name?: string;
  title?: string;
  headline?: string;
  bio?: string;
  location?: string;
  email?: string;
  github?: string;
  linkedin?: string;
  resume?: string;
  profileImageUrl?: string;
  socialLinks?: Array<{ label: string; href: string }>;
  skills?: Array<{ id: string; name: string; category: string; featured: boolean }>;
  projects?: Profile['projects'];
  blogPosts?: Array<Record<string, unknown>>;
  experience?: Array<Record<string, unknown>>;
  education?: Array<Record<string, unknown>>;
  research?: Array<Record<string, unknown>>;
  achievements?: Array<Record<string, unknown>>;
  services?: Array<Record<string, unknown>>;
};

const list = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
const text = (value: unknown, fallback = '') => typeof value === 'string' ? value : fallback;
const publicFileUrl = (value: unknown) => {
  const candidate = text(value).trim();
  if (!candidate) return undefined;
  if (isPrivateUploadUrl(candidate)) return undefined;
  try {
    const resolved = new URL(candidate, publicApiBaseUrl || window.location.origin);
    if (!['http:', 'https:'].includes(resolved.protocol) || resolved.username || resolved.password) return undefined;
    return resolveProjectImageUrl(resolved.toString());
  } catch {
    return undefined;
  }
};

export function mapPublicSnapshot(snapshot: Snapshot): Profile {
  const skills = snapshot.skills ?? [];
  const skillCategories = [...new Set(skills.map((skill) => skill.category))];
  const skillGroups: SkillGroup[] = skillCategories.map((category) => ({ category: category as SkillGroup['category'], items: skills.filter((skill) => skill.category === category).map((skill) => skill.name) }));
  const projects = snapshot.projects ?? [];
  const blogPosts: BlogPost[] = (snapshot.blogPosts ?? []).map((item) => ({
    id: text(item.id), slug: text(item.slug), title: text(item.title), excerpt: text(item.excerpt), content: text(item.content),
    category: text(item.category), tags: list(item.tags), coverImage: publicFileUrl(item.coverImageUrl),
    published: item.published === true, publishedAt: text(item.publishedAt) || undefined
  }));
  const experience: Experience[] = (snapshot.experience ?? []).map((item) => ({
    id: text(item.id), organization: text(item.company), company: text(item.company), role: text(item.role), location: text(item.location),
    startDate: text(item.startDate) || undefined, endDate: text(item.endDate) || undefined, period: [text(item.startDate), text(item.endDate)].filter(Boolean).join(' - '),
    current: item.current === true, description: text(item.description), responsibilities: list(item.responsibilities), achievements: [], technologies: list(item.technologies)
  }));
  const education: Education[] = (snapshot.education ?? []).map((item) => ({
    id: text(item.id), university: text(item.school), school: text(item.school), degree: text(item.degree), field: text(item.field) || undefined,
    description: text(item.description) || undefined, coursework: list(item.coursework), relevantCoursework: list(item.coursework),
    startDate: text(item.startDate) || undefined, period: [text(item.startDate), text(item.endDate)].filter(Boolean).join(' - ')
  }));
  const research: ResearchItem[] = (snapshot.research ?? []).map((item) => ({
    id: text(item.id), title: text(item.title), topic: text(item.area) || undefined, summary: text(item.summary), methodology: text(item.methodology) || undefined,
    publicationDate: text(item.publicationDate) || undefined,
    status: text(item.status), topics: [], tags: [], technologies: list(item.technologies), link: publicFileUrl(item.publicationUrl) ?? publicFileUrl(item.paperUrl),
    publicationUrl: publicFileUrl(item.publicationUrl),
    pdfUrl: publicFileUrl(item.paperUrl) ?? publicFileUrl(item.fileUrl),
    fileUrl: publicFileUrl(item.fileUrl),
    imageUrl: publicFileUrl(item.imageUrl),
    githubUrl: text(item.githubUrl) || undefined
  }));
  const achievements: Achievement[] = (snapshot.achievements ?? []).map((item) => ({
    id: text(item.id), title: text(item.title), issuer: text(item.issuer) || undefined, date: text(item.awardDate) || undefined,
    description: text(item.description), url: publicFileUrl(item.credentialUrl),
    imageUrl: publicFileUrl(item.imageUrl),
    documentUrl: publicFileUrl(item.documentUrl),
    detail: undefined
  }));
  const services: Service[] = (snapshot.services ?? []).map((item) => ({
    id: text(item.id), title: text(item.title), category: text(item.category) || undefined, description: text(item.description), details: []
  }));

  return {
    ...localProfile,
    name: localProfile.name,
    title: localProfile.title,
    shortTitle: localProfile.shortTitle,
    headline: localProfile.headline,
    hero: localProfile.hero,
    bio: localProfile.bio,
    shortBio: localProfile.shortBio,
    location: localProfile.location,
    email: localProfile.email,
    github: localProfile.github,
    linkedin: text(snapshot.linkedin).trim() || localProfile.linkedin,
    // Use only explicitly selected public assets; database upload URLs may be private.
    resume: localProfile.resume,
    profileImageUrl: localProfile.profileImageUrl,
    socials: [...new Map([...(snapshot.socialLinks ?? []), ...localProfile.socials].filter((item) => typeof item.href === 'string').map((item) => [item.href as string, item] as const)).values()],
    skills: skillGroups.length ? skillGroups : localProfile.skills,
    projects: projects.length ? projects : localProfile.projects,
    blogPosts: blogPosts.length ? blogPosts : localProfile.blogPosts,
    experience: experience.length ? experience : localProfile.experience,
    education: education.length ? education : localProfile.education,
    research,
    achievements,
    services
  };
}

export function usePublicPortfolio() {
  const preview = useContext(PreviewDataContext);
  const [portfolio, setPortfolio] = useState(localProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    if (preview) return;
    const controller = new AbortController();
    fetch(`${publicApiBaseUrl}/api/v1/profile`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json() as { success?: boolean; data?: Snapshot; error?: { message?: string } };
        if (!response.ok || !payload.success || !payload.data) throw new Error(payload.error?.message ?? 'Unable to load portfolio content.');
        setPortfolio(mapPublicSnapshot(payload.data));
      })
      .catch((caught: unknown) => {
        if (!controller.signal.aborted) setError(caught instanceof Error ? caught.message : 'Unable to load portfolio content.');
      })
      .finally(() => { if (!controller.signal.aborted) setIsLoading(false); });
    return () => controller.abort();
  }, [preview]);

  return { profile: preview ? preview.profile : portfolio, isLoading: preview ? false : isLoading, error: preview ? '' : error };
}
