import type { Project, ProjectCategory } from '../types';

export const projects: Project[] = [];

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
