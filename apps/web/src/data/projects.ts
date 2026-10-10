import type { Project, ProjectCategory } from '../types';

const cvAttribution = 'Listed in the supplied CV. The public repository and individual contribution details could not be independently verified.';

export const projects: Project[] = [
  {
    slug: 'climateguard-ai',
    title: 'ClimateGuard AI',
    shortDescription: 'A climate and disaster prediction project.',
    description: `${cvAttribution} The CV describes this as a climate and disaster prediction project; implementation details, datasets, and results are not stated.`,
    category: 'Applied AI / ML'
  },
  {
    slug: 'phishing-url-detector',
    title: 'Phishing URL Detector',
    shortDescription: 'A machine-learning-based phishing detection project.',
    description: `${cvAttribution} The CV describes this as a learning-based phishing detection project; model, data, and evaluation details are not stated.`,
    category: 'Cybersecurity'
  },
  {
    slug: 'gym-management-system',
    title: 'Gym Management System',
    shortDescription: 'A full-stack web application.',
    description: `${cvAttribution} The CV identifies this as a full-stack web application but does not provide repository, feature, or technology details.`,
    category: 'Full-stack development'
  },
  {
    slug: 'ai-ml-engineer-portfolio',
    title: 'AI/ML Engineer Portfolio',
    shortDescription: 'A personal portfolio project.',
    description: `${cvAttribution} The CV describes this as a personal portfolio project; no source repository or live demo was verified.`,
    category: 'Web development'
  }
];

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectCategories(): ProjectCategory[] {
  return [...new Set(projects.map((project) => project.category))].sort((left, right) => left.localeCompare(right));
}

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return projects.filter((project) => project.category === category);
}
