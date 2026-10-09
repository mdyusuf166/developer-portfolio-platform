import { z } from 'zod';

import type { Profile } from '../types';

import { achievements } from './achievements';
import { blogPosts } from './blog';
import { education } from './education';
import { experience } from './experience';
import { navigationItems } from './navigation';
import { projects } from './projects';
import { research } from './research';
import { services } from './services';
import { skillGroups, skills } from './skills';
import { socialLinks } from './socials';

// Edit this file to update personal portfolio information.
// Keep personal content centralized here so the UI remains separate from the data layer.
export const profile: Profile = {
  name: 'MD MAHTAB AHMED MAHIN',
  title: 'AI / ML ENGINEER',
  shortTitle: 'AI / ML Engineer',
  headline: 'Building intelligent systems, machine learning applications, and generative AI experiences.',
  bio: 'AI/ML Engineer focused on building intelligent systems, machine learning applications, generative AI systems, and production-quality software.',
  shortBio: 'Focused on machine learning, generative AI, and software engineering.',
  location: '',
  email: '',
  availability: 'Portfolio in progress',
  github: '',
  linkedin: '',
  resume: '',
  hero: 'Building intelligent systems with machine learning and generative AI.',
  about: 'My interests include machine learning, deep learning, generative AI, LLMs, RAG, NLP, AI engineering, software engineering, cybersecurity, and research.',
  researchInterests: ['Machine Learning', 'Generative AI and LLMs', 'RAG and NLP', 'AI Security'],
  stats: [
    { label: 'Focus', value: 'Machine Learning and Deep Learning' },
    { label: 'Interests', value: 'Generative AI, LLMs, and RAG' },
    { label: 'Foundation', value: 'Software Engineering' }
  ],
  socials: socialLinks.map((item) => ({
    label: item.label ?? item.name ?? 'Link',
    href: item.href ?? item.url ?? '#'
  })),
  navigation: navigationItems,
  skills: skillGroups,
  projects,
  experience,
  education,
  research,
  achievements,
  services,
  blogPosts,
  aboutHighlights: ['Machine Learning', 'Generative AI and LLMs', 'NLP and RAG', 'AI Security', 'Software Engineering', 'Research']
};

const profileSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  shortTitle: z.string().min(1),
  headline: z.string().min(1),
  bio: z.string().min(1),
  shortBio: z.string().min(1),
  location: z.string(),
  email: z.string(),
  availability: z.string().min(1),
  github: z.string(),
  linkedin: z.string(),
  resume: z.string(),
  hero: z.string().min(1),
  about: z.string().min(1),
  researchInterests: z.array(z.string()),
  stats: z.array(z.object({ label: z.string(), value: z.string() })),
  socials: z.array(z.object({ label: z.string(), href: z.string() })),
  navigation: z.array(z.object({ label: z.string(), href: z.string() })),
  skills: z.array(z.object({ category: z.string(), items: z.array(z.string()) })),
  projects: z.array(z.any()),
  experience: z.array(z.any()),
  education: z.array(z.any()),
  research: z.array(z.any()),
  achievements: z.array(z.any()),
  services: z.array(z.any()),
  blogPosts: z.array(z.any()),
  aboutHighlights: z.array(z.string())
});

const parsedProfile = profileSchema.safeParse(profile);
if (!parsedProfile.success) {
  throw new Error(`Portfolio profile data is invalid: ${parsedProfile.error.message}`);
}

export { achievements, blogPosts, education, experience, navigationItems, projects, research, services, skillGroups, skills, socialLinks };

export function getPublishedPosts() {
  return profile.blogPosts.filter((post) => post.published);
}

export function getFeaturedSkills() {
  return profile.skills.flatMap((group) => group.items.map((item) => item));
}

export function getCurrentExperience() {
  return profile.experience.filter((item) => item.current);
}
