import type { Experience } from '../types';

export const experience: Experience[] = [
  {
    id: 'technology-collaboration',
    organization: 'Science and technology startup / agency initiatives',
    role: 'Developer collaboration',
    location: '',
    description: 'I collaborate with developers on science and technology startup and agency initiatives, including software development, product exploration, and early research exploration. No formal employer, dates, or project-specific contribution claims are listed.',
    responsibilities: ['Collaborate with developers on software and product ideas.', 'Explore technical and research directions with project teams.'],
    achievements: [],
    technologies: []
  }
];

export function getCurrentExperience(): Experience[] {
  return experience.filter((item) => item.current);
}
