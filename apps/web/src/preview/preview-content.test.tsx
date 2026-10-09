import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PreviewDataContext } from './preview-context';
import { previewProfile, previewProjects } from './mock-data';
import { ProjectsPage } from '../pages/ProjectsPage';
import { ProjectDetailPage } from '../pages/ProjectDetailPage';
import { BlogPage } from '../pages/BlogPage';
import { BlogPostPage } from '../pages/BlogPostPage';
import { ResearchPage } from '../pages/ResearchPage';
import { ProjectsPage as NormalProjectsPage } from '../pages/ProjectsPage';

const previewValue = { profile: previewProfile, projects: previewProjects };

function renderPreview(initialPath: string) {
  return render(<PreviewDataContext.Provider value={previewValue}><MemoryRouter initialEntries={[initialPath]}><Routes>
    <Route path="/projects" element={<ProjectsPage />} />
    <Route path="/projects/:slug" element={<ProjectDetailPage />} />
    <Route path="/blog" element={<BlogPage />} />
    <Route path="/blog/:slug" element={<BlogPostPage />} />
    <Route path="/research" element={<ResearchPage />} />
  </Routes></MemoryRouter></PreviewDataContext.Provider>);
}

describe('synthetic populated preview content', () => {
  beforeEach(() => vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true, data: [] }) })));

  it('renders project fixtures, filters by category, and opens a case study without API requests', async () => {
    renderPreview('/projects');
    expect(screen.getByRole('heading', { name: 'Sample Document Explorer' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /synthetic interface illustration/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'AI / ML layout sample' }));
    expect(screen.queryByRole('heading', { name: 'Sample Document Explorer' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Sample Model Review Board' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('link', { name: /case study/i }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Sample Model Review Board' })).toBeInTheDocument());
    expect(screen.getByText(/no model evaluation or benchmark was performed/i)).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('navigates from the sample blog list into long-form content without API requests', () => {
    renderPreview('/blog');
    fireEvent.click(screen.getByRole('link', { name: /\[Sample\] Reading a System Diagram Carefully/i }));
    expect(screen.getByText(/not a published post/i)).toBeInTheDocument();
    expect(screen.getByText(/A useful system diagram is a map of decisions/i)).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('shows the research layout fixture with an explicit unpublished label', () => {
    renderPreview('/research');
    expect(screen.getByRole('heading', { name: /not a publication/i })).toBeInTheDocument();
    expect(screen.getByText(/not research output, a paper, or a claim of completed work/i)).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('keeps the normal no-provider API path active', async () => {
    render(<MemoryRouter><NormalProjectsPage /></MemoryRouter>);
    await screen.findByRole('heading', { name: 'ClimateGuard AI' });
    expect(fetch).toHaveBeenCalledWith('/api/v1/projects', expect.any(Object));
  });
});
