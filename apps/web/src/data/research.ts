import type { ResearchItem } from '../types';

export const research: ResearchItem[] = [];

export function getPublishedResearch(): ResearchItem[] {
  return research.filter((item) => item.status.toLowerCase() !== 'draft');
}
