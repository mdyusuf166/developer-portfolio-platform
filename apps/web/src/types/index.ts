export type NavigationItem = {
  label: string;
  href: string;
  description?: string;
};

export type SocialLink = {
  label?: string;
  href?: string;
  name?: string;
  url?: string;
  icon?: 'github' | 'linkedin' | 'mail' | 'external' | 'default';
  ariaLabel?: string;
};

export type SkillCategory = 'AI / Machine Learning' | 'Generative AI / LLM' | 'Data / ML Infrastructure' | 'Software Engineering' | 'Cybersecurity' | 'Research / Tools';

export type Skill = {
  name: string;
  category: SkillCategory;
  icon?: string;
  description?: string;
  level?: string;
  featured?: boolean;
};

export type SkillGroup = {
  category: SkillCategory;
  items: string[];
};

export type ProjectImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type ProjectCategory = string;

export type Project = {
  slug: string;
  title: string;
  shortDescription: string;
  description?: string;
  problem?: string;
  approach?: string;
  technologies?: string[];
  architecture?: string[];
  implementation?: string;
  results?: string[];
  technicalChallenges?: string[];
  learnings?: string[];
  githubUrl?: string;
  demoUrl?: string;
  image?: ProjectImage;
  imageUrl?: string | null;
  category: ProjectCategory;
  status?: string;
  featured?: boolean;
};

export type Experience = {
  id: string;
  organization: string;
  role: string;
  company?: string;
  location: string;
  startDate?: string;
  endDate?: string;
  period?: string;
  current?: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
};

export type Education = {
  id: string;
  degree: string;
  university: string;
  school?: string;
  department?: string;
  location?: string;
  startDate?: string;
  expectedGraduation?: string;
  period?: string;
  relevantCoursework?: string[];
  coursework?: string[];
  description?: string;
};

export type ResearchItem = {
  id: string;
  title: string;
  topic?: string;
  methodology?: string;
  publicationDate?: string;
  imageUrl?: string;
  fileUrl?: string;
  abstract?: string;
  summary?: string;
  status: string;
  topics: string[];
  tags?: string[];
  technologies: string[];
  githubUrl?: string;
  publicationUrl?: string;
  pdfUrl?: string;
  link?: string;
};

export type Achievement = {
  id: string;
  title: string;
  type?: string;
  issuer?: string;
  date?: string;
  description: string;
  detail?: string;
  url?: string;
  imageUrl?: string;
  documentUrl?: string;
};

export type Service = {
  id: string;
  title: string;
  category?: string;
  description: string;
  details: string[];
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  readingTime?: string;
  readTime?: string;
  date?: string;
  published: boolean;
  publishedAt?: string;
};

export type Profile = {
  name: string;
  title: string;
  shortTitle: string;
  headline: string;
  bio: string;
  shortBio: string;
  location: string;
  email: string;
  availability: string;
  github: string;
  linkedin: string;
  resume: string;
  profileImageUrl?: string;
  hero: string;
  about: string;
  researchInterests: string[];
  stats: Array<{ label: string; value: string }>;
  socials: SocialLink[];
  navigation: NavigationItem[];
  skills: SkillGroup[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  research: ResearchItem[];
  achievements: Achievement[];
  services: Service[];
  blogPosts: BlogPost[];
  aboutHighlights: string[];
};
