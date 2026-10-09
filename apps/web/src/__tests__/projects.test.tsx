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

  it('shows an honest empty state and no category filters when there are no projects', async () => {
    render(
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'AI / ML Projects' })).toBeInTheDocument();
    expect(await screen.findByText('No published projects yet')).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Filter projects by category' })).not.toBeInTheDocument();
  });

  it('shows the homepage selected-projects empty state and projects navigation', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'AI / ML project showcase' })).toBeInTheDocument();
    expect(await screen.findByText('No projects have been published yet.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View all projects' })).toHaveAttribute('href', '/projects');
  });

  it('renders a published project with its uploaded image from the API', async () => {
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
    expect(screen.getByRole('img', { name: 'Published project project image' })).toHaveAttribute(
      'src',
      'http://localhost:4000/uploads/project.png'
    );
  });
});