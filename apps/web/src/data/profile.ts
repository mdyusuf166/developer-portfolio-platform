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
  title: 'CSE Undergraduate · Software & AI/ML',
  shortTitle: 'CSE Undergraduate',
  headline: 'Building useful software while exploring applied AI and machine learning.',
  bio: 'I am a Computer Science and Engineering undergraduate at Metropolitan University in Sylhet. I work on software and full-stack projects while exploring applied AI and machine learning.',
  shortBio: 'Software engineering and full-stack development, with a growing focus on AI/ML.',
  location: 'Sylhet',
  email: 'mahtabmahim2004@gmail.com',
  availability: 'Open to internship opportunities',
  github: 'https://github.com/mahtabmahim2004',
  linkedin: '',
  resume: '/resume.jpg',
  profileImageUrl: '/profile-photo.jpg',
  hero: 'Building useful software while exploring applied AI and machine learning.',
  about: 'I am a CSE undergraduate interested in software engineering, full-stack development, and interdisciplinary computing. I collaborate with developers on science and technology startup and agency initiatives, exploring product ideas and software together. The topics below are interests and learning directions, not claims of completed research.',
  researchInterests: [
    { title: 'Artificial intelligence and machine learning', description: 'Explore practical learning methods and how they can support useful software. Machine learning is listed on the CV as an area of interest.', area: 'AI, ML, and Deep Learning' },
    { title: 'Deep learning, computer vision, and neural networks', description: 'Build understanding of neural models for visual recognition and representation learning.', area: 'AI, ML, and Deep Learning' },
    { title: 'AGI-inspired intelligent systems', description: 'Study reasoning, planning, and adaptive systems as exploratory topics; no production AGI work is claimed.', area: 'Research Interests' },
    { title: 'Biomedical AI and computational biology', description: 'Explore computational approaches to biological and health-related questions.', area: 'Research Interests' },
    { title: 'Quantum computing', description: 'Learn quantum computing concepts and algorithms from a computational perspective.', area: 'Research Interests' },
    { title: 'Cybersecurity and secure software', description: 'Understand how to design, build, and assess software with security in mind.', area: 'Systems, Cybersecurity, and Embedded Computing' },
    { title: 'Robotics and embedded intelligence', description: 'Explore software that connects intelligent behavior with physical and embedded systems.', area: 'Systems, Cybersecurity, and Embedded Computing' },
    { title: 'Scientific and interdisciplinary computing', description: 'Use computation to investigate questions across science and technology. No scientific computing library is named on the CV or in this repository.', area: 'Academic and Scientific Computing' }
  ],
  stats: [
    { label: 'Study', value: 'Computer Science and Engineering' },
    { label: 'Build', value: 'Software and full-stack projects' },
    { label: 'Explore', value: 'AI/ML and interdisciplinary computing' }
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
  aboutHighlights: ['Computer Science and Engineering', 'Software engineering', 'Full-stack development', 'AI and machine learning', 'Secure software', 'Developer collaboration']
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
  profileImageUrl: z.string().optional(),
  hero: z.string().min(1),
  about: z.string().min(1),
  researchInterests: z.array(z.object({ title: z.string().min(1), description: z.string().min(1), area: z.string().min(1).optional() })),
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
