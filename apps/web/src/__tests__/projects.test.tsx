import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HomePage } from '../pages/HomePage';
import { ProjectsPage } from '../pages/ProjectsPage';

describe('AI/ML project showcase', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: [] })
    }));
  });

  it('shows the CV-listed static projects when the API has no published projects', async () => {
    render(
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'AI / ML Projects' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'ClimateGuard AI' })).toBeInTheDocument();
  });

  it('shows static selected projects and projects navigation when the API is empty', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'AI / ML project showcase' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'ClimateGuard AI' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View all projects' })).toHaveAttribute('href', '/projects');
  });

  it('renders a published project but keeps its uploaded image private', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: [{
          slug: 'image-project',
          title: 'Published project',
          summary: 'Verified project summary',
          description: 'Project details from the admin editor',
          imageUrl: '/uploads/project.png',
          category: 'AI / ML',
          featured: true,
          status: 'published'
        }]
      })
    }));

    render(
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'Published project' })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Published project project image' })).not.toBeInTheDocument();
  });
});
