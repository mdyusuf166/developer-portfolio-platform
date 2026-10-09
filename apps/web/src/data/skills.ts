import type { Skill, SkillCategory, SkillGroup } from '../types';

// Only skills with a traceable source are listed.
// cv: named in the supplied CV. portfolio: used in this site's codebase.
// Learning topics and research interests stay on the profile.
export type SkillBand = 'skill' | 'academic' | 'learning';

export type SkillArea = {
  title: SkillCategory;
  band: SkillBand;
  summary: string;
};

export const skillAreas: SkillArea[] = [
  {
    title: 'Programming Languages',
    band: 'skill',
    summary: 'C, Python, and JavaScript are named on the CV. TypeScript is the language used to build this portfolio.'
  },
  {
    title: 'Web Development',
    band: 'skill',
    summary: 'React and Node.js are named on the CV. HTML, CSS, Express, and Tailwind CSS are used in this portfolio.'
  },
  {
    title: 'Software Engineering',
    band: 'skill',
    summary: 'Git and GitHub are named on the CV. This portfolio exposes and consumes REST APIs.'
  },
  {
    title: 'Computer Science Fundamentals',
    band: 'academic',
    summary: 'The CV lists a BSc in Computer Science and Engineering at Metropolitan University, currently in progress. It does not name coursework, so no fundamental topic is published as a skill.'
  },
  {
    title: 'Databases and Data Management',
    band: 'skill',
    summary: 'SQL is named on the CV. PostgreSQL is the database used by this portfolio.'
  },
  {
    title: 'AI, ML, and Deep Learning',
    band: 'learning',
    summary: 'Machine learning is a CV area of interest. ClimateGuard AI and the Phishing URL Detector are named projects. Their libraries, datasets, and results are not stated, so no machine-learning framework is listed as a skill.'
  },
  {
    title: 'Research Interests',
    band: 'learning',
    summary: 'These are study directions. They are not publications, completed research, or specialist skills.'
  },
  {
    title: 'Systems, Cybersecurity, and Embedded Computing',
    band: 'learning',
    summary: 'The CV names a phishing-detection project and an interest in secure software. It does not name a security tool, operating system, or embedded platform, so none is listed as a skill.'
  },
  {
    title: 'Academic and Scientific Computing',
    band: 'learning',
    summary: 'This is an academic interest in computation across science and technology. No scientific computing library is named on the CV or in this repository.'
  }
];

export const skills: Skill[] = [
  { name: 'C', category: 'Programming Languages', evidence: 'cv' },
  { name: 'Python', category: 'Programming Languages', evidence: 'cv' },
  { name: 'JavaScript', category: 'Programming Languages', evidence: 'cv' },
  { name: 'TypeScript', category: 'Programming Languages', evidence: 'portfolio' },
  { name: 'HTML', category: 'Web Development', evidence: 'portfolio' },
  { name: 'CSS', category: 'Web Development', evidence: 'portfolio' },
  { name: 'React', category: 'Web Development', evidence: 'cv' },
  { name: 'Node.js', category: 'Web Development', evidence: 'cv' },
  { name: 'Express', category: 'Web Development', evidence: 'portfolio' },
  { name: 'Tailwind CSS', category: 'Web Development', evidence: 'portfolio' },
  { name: 'Git', category: 'Software Engineering', evidence: 'cv' },
  { name: 'GitHub', category: 'Software Engineering', evidence: 'cv' },
  { name: 'REST APIs', category: 'Software Engineering', evidence: 'portfolio' },
  { name: 'SQL', category: 'Databases and Data Management', evidence: 'cv' },
  { name: 'PostgreSQL', category: 'Databases and Data Management', evidence: 'portfolio' }
];

export const skillGroups: SkillGroup[] = [...new Set(skills.map((skill) => skill.category))].map((category) => ({
  category,
  items: skills.filter((skill) => skill.category === category).map((skill) => skill.name)
}));

export function getFeaturedSkills(): Skill[] {
  return skills.filter((skill) => skill.featured);
}
