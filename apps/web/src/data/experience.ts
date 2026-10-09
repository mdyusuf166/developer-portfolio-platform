import type { Experience } from '../types';

export const experience: Experience[] = [];

export function getCurrentExperience(): Experience[] {
  return experience.filter((item) => item.current);
}
