import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { AchievementsPage } from '../pages/AchievementsPage';
import { BlogPage } from '../pages/BlogPage';
import { HomePage } from '../pages/HomePage';
import { ResearchPage } from '../pages/ResearchPage';

const profileSnapshot = {
  name: 'MD MAHTAB AHMED MAHIN',
  title: 'AI / ML ENGINEER',
  headline: 'Portfolio headline',
  bio: 'Portfolio summary',
  socialLinks: [],
  stats: [],
  skills: [],
  projects: [],
  blogPosts: [{ id: 'post-1', slug: 'article', title: 'Stored article', excerpt: 'Summary', content: 'Article body', category: 'Engineering', tags: [], coverImageUrl: '/uploads/blog-cover.png', published: true }],
  experience: [],
  education: [],
  research: [{ id: 'research-1', title: 'Research entry', summary: 'Research summary', methodology: 'Method', area: 'AI', technologies: [], status: 'published', publicationDate: null, publicationUrl: null, paperUrl: null, fileUrl: '/uploads/paper.pdf', imageUrl: '/uploads/figure.png', githubUrl: null, notes: null }],
  achievements: [{ id: 'achievement-1', title: 'Verified achievement', description: 'Owner-provided description', issuer: null, awardDate: null, credentialUrl: null, imageUrl: '/uploads/award.png', documentUrl: '/uploads/certificate.pdf', status: 'published' }],
  services: []
};

describe('public CMS file rendering', () => {
  it('renders research figure and paper PDF only when stored paths exist', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, data: profileSnapshot }) }));
    render(<ResearchPage />);

    expect(await screen.findByRole('img', { name: 'Research entry research figure' })).toHaveAttribute('src', 'http://localhost:4000/uploads/figure.png');
    expect(screen.getByRole('link', { name: 'Open paper PDF' })).toHaveAttribute('href', 'http://localhost:4000/uploads/paper.pdf');
  });

  it('renders achievement image and certificate document only when stored paths exist', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, data: profileSnapshot }) }));
    render(<AchievementsPage />);

    expect(await screen.findByRole('img', { name: 'Verified achievement image' })).toHaveAttribute('src', 'http://localhost:4000/uploads/award.png');
    expect(screen.getByRole('link', { name: 'Open document' })).toHaveAttribute('href', 'http://localhost:4000/uploads/certificate.pdf');
  });

  it('renders a stored blog cover image only when one exists', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, data: profileSnapshot }) }));
    render(<MemoryRouter><BlogPage /></MemoryRouter>);

    expect(await screen.findByRole('heading', { name: 'Stored article' })).toBeInTheDocument();
    const cover = document.querySelector('img[src="http://localhost:4000/uploads/blog-cover.png"]');
    expect(cover).toBeInTheDocument();
  });

  it('loads homepage projects from the same published project API', async () => {
    vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith('/api/v1/projects')) {
        return Promise.resolve({ ok: true, json: async () => ({ success: true, data: [{ slug: 'published', title: 'Published from API', summary: 'Project summary', description: 'Project detail', category: 'AI / ML', featured: true, status: 'published' }] }) } as Response);
      }
      return Promise.resolve({ ok: true, json: async () => ({ success: true, data: profileSnapshot }) } as Response);
    }));
    render(<MemoryRouter><HomePage /></MemoryRouter>);

    expect(await screen.findByRole('heading', { name: 'Published from API' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Case study/ })).toHaveAttribute('href', '/projects/published');
  });
});