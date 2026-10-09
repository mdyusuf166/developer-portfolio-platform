import { describe, expect, it } from 'vitest';

import { getFeaturedProjects, getProjectBySlug, getProjectCategories, getProjectsByCategory, getPublishedPosts, projects, blogPosts, skills, profile } from '../index';

describe('portfolio data helpers', () => {
  it('indexes the available project records consistently', () => {
    expect(getProjectBySlug('missing-slug')).toBeUndefined();
    expect(getFeaturedProjects()).toEqual(projects.filter((project) => project.featured));
    expect(getProjectCategories()).toEqual([...new Set(projects.map((project) => project.category))].sort((a, b) => a.localeCompare(b)));

    for (const project of projects) {
      expect(getProjectBySlug(project.slug)).toEqual(project);
      expect(getProjectsByCategory(project.category)).toContain(project);
    }
  });

  it('returns only posts marked as published', () => {
    expect(getPublishedPosts()).toEqual(blogPosts.filter((post) => post.published));
  });

  it('keeps project and blog collections centralized', () => {
    expect(Array.isArray(projects)).toBe(true);
    expect(Array.isArray(blogPosts)).toBe(true);
  });

  it('publishes only evidenced skills and keeps research interests separate', () => {
    const names = skills.map((skill) => skill.name);
    expect(names).toEqual(expect.arrayContaining(['C', 'Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'TypeScript', 'PostgreSQL']));
    for (const unverified of ['C++', 'Next.js', 'PyTorch', 'Docker', 'Arduino', 'NumPy', 'Pandas', 'Matplotlib']) {
      expect(names).not.toContain(unverified);
    }
    expect(skills.find((skill) => skill.name === 'Python')?.evidence).toBe('cv');
    expect(skills.find((skill) => skill.name === 'TypeScript')?.evidence).toBe('portfolio');
    expect(skills.find((skill) => skill.name === 'Git')?.category).toBe('Software Engineering');
    expect(skills.find((skill) => skill.name === 'SQL')?.category).toBe('Databases and Data Management');
    expect(skills.some((skill) => skill.category === 'Research Interests')).toBe(false);
    expect(skills.some((skill) => skill.category === 'AI, ML, and Deep Learning')).toBe(false);
    expect(skills.some((skill) => skill.category === 'Computer Science Fundamentals')).toBe(false);
    expect(profile.resume).toBe('/resume.jpg');
    expect(profile.researchInterests.some((interest) => interest.area === 'AI, ML, and Deep Learning')).toBe(true);
    expect(profile.researchInterests.some((interest) => interest.area === 'Systems, Cybersecurity, and Embedded Computing')).toBe(true);
    expect(profile.researchInterests.some((interest) => interest.area === 'Academic and Scientific Computing')).toBe(true);
  });
});
