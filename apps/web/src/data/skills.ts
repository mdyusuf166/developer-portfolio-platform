import type { Skill, SkillGroup } from '../types';

export const skills: Skill[] = [
  { name: 'Machine Learning', category: 'AI / Machine Learning', featured: true },
  { name: 'Deep Learning', category: 'AI / Machine Learning' },
  { name: 'Natural Language Processing', category: 'AI / Machine Learning' },
  { name: 'Generative AI', category: 'Generative AI / LLM', featured: true },
  { name: 'Large Language Models', category: 'Generative AI / LLM' },
  { name: 'Retrieval-Augmented Generation (RAG)', category: 'Generative AI / LLM' },
  { name: 'LLM Integration', category: 'Generative AI / LLM' },
  { name: 'Python', category: 'Data / ML Infrastructure' },
  { name: 'SQL', category: 'Data / ML Infrastructure' },
  { name: 'PostgreSQL', category: 'Data / ML Infrastructure' },
  { name: 'Prisma', category: 'Data / ML Infrastructure' },
  { name: 'TypeScript', category: 'Software Engineering', featured: true },
  { name: 'JavaScript', category: 'Software Engineering' },
  { name: 'React', category: 'Software Engineering' },
  { name: 'Node.js', category: 'Software Engineering' },
  { name: 'Express', category: 'Software Engineering' },
  { name: 'REST APIs', category: 'Software Engineering' },
  { name: 'Cybersecurity', category: 'Cybersecurity' },
  { name: 'AI Security', category: 'Cybersecurity' },
  { name: 'Research', category: 'Research / Tools' },
  { name: 'GitHub', category: 'Research / Tools' }
];

export const skillGroups: SkillGroup[] = (
  ['AI / Machine Learning', 'Generative AI / LLM', 'Data / ML Infrastructure', 'Software Engineering', 'Cybersecurity', 'Research / Tools'] as const
).map((category) => ({
  category,
  items: skills.filter((skill) => skill.category === category).map((skill) => skill.name)
}));

export function getFeaturedSkills(): Skill[] {
  return skills.filter((skill) => skill.featured);
}
