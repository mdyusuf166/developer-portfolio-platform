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
  research: [{ id: 'research-1', title: 'Research entry', summary: 'Research summary', methodology: 'Method', area: 'AI', technologies: [], status: 'published', publicationDate: null, publicationUrl: null, paperUrl: null, fileUrl: '/uploads/%70aper.pdf', imageUrl: '/uploads/%66igure.png', githubUrl: null, notes: null }],
  achievements: [{ id: 'achievement-1', title: 'Verified achievement', description: 'Owner-provided description', issuer: null, awardDate: null, credentialUrl: null, imageUrl: '/uploads/%61ward.png', documentUrl: '/uploads/certificate.pdf', status: 'published' }],
  services: []
};

describe('public CMS file rendering', () => {
  it('keeps uploaded research figures and paper documents private', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, data: profileSnapshot }) }));
    render(<ResearchPage />);

    await screen.findByRole('heading', { name: 'Research entry' });
    expect(screen.queryByRole('img', { name: 'Research entry research figure' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Open paper PDF' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'View details' })).not.toBeInTheDocument();
  });

  it('keeps uploaded achievement images and certificate documents private', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, data: profileSnapshot }) }));
    render(<AchievementsPage />);

    await screen.findByRole('heading', { name: 'Verified achievement' });
    expect(screen.queryByRole('img', { name: 'Verified achievement image' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Open document' })).not.toBeInTheDocument();
  });

  it('keeps uploaded blog cover images private', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, data: profileSnapshot }) }));
    render(<MemoryRouter><BlogPage /></MemoryRouter>);

    expect(await screen.findByRole('heading', { name: 'Stored article' })).toBeInTheDocument();
    const cover = document.querySelector('img[src$="/uploads/blog-cover.png"]');
    expect(cover).not.toBeInTheDocument();
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
