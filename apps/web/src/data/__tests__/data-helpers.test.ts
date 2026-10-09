import { describe, expect, it } from 'vitest';

import { getFeaturedProjects, getProjectBySlug, getProjectCategories, getProjectsByCategory, getPublishedPosts, projects, blogPosts } from '../index';

describe('portfolio data helpers', () => {
  it('returns no project until a real case study is published', () => {
    expect(getProjectBySlug('missing-slug')).toBeUndefined();
    expect(getFeaturedProjects()).toEqual([]);
    expect(getProjectsByCategory('AI / ML')).toEqual([]);
    expect(getProjectCategories()).toEqual([]);
  });

  it('does not publish placeholder writing', () => {
    const published = getPublishedPosts();

    expect(published).toEqual([]);
  });

  it('keeps empty project and blog datasets centralized and typed', () => {
    expect(projects).toEqual([]);
    expect(blogPosts).toEqual([]);
  });
});
