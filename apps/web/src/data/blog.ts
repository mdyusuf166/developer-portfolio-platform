import type { BlogPost } from '../types';

export const blogPosts: BlogPost[] = [];

export function getPublishedPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.published);
}
