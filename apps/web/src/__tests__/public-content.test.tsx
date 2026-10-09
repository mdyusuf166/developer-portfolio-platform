import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AchievementsPage } from '../pages/AchievementsPage';
import { BlogPage } from '../pages/BlogPage';
import { ContactPage } from '../pages/ContactPage';
import { EducationPage } from '../pages/EducationPage';
import { ExperiencePage } from '../pages/ExperiencePage';
import { ResumePage } from '../pages/ResumePage';
import { ServicesPage } from '../pages/ServicesPage';
import { navigationItems } from '../data/navigation';

describe('public portfolio content states', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          name: 'MD MAHTAB AHMED MAHIN',
          title: 'AI / ML ENGINEER',
          headline: 'Engineering focus',
          bio: 'Engineering summary',
          socialLinks: [],
          skills: [],
          projects: [],
          blogPosts: [],
          experience: [],
          education: [],
          research: [],
          achievements: [],
          services: []
        }
      })
    }));
  });

  it('uses consistent honest empty states for unavailable owner records', async () => {
    const pages = [
      <ExperiencePage key="experience" />,
      <EducationPage key="education" />,
      <AchievementsPage key="achievements" />,
      <BlogPage key="blog" />,
      <ContactPage key="contact" />,
      <ResumePage key="resume" />
    ];

    render(<>{pages}</>);

    expect(await screen.findByText('No verified experience listed')).toBeInTheDocument();
    expect(await screen.findByText('No verified education details listed')).toBeInTheDocument();
    expect(await screen.findByText('No verified achievements listed')).toBeInTheDocument();
    expect(await screen.findByText('No articles published')).toBeInTheDocument();
    expect(screen.getByText('Contact information unavailable')).toBeInTheDocument();
    expect(screen.getByText('Resume unavailable')).toBeInTheDocument();
    expect(screen.getAllByRole('status')).toHaveLength(6);
  });

  it('describes Services navigation content as interests rather than client services', async () => {
    render(<ServicesPage />);

    expect(screen.getByRole('heading', { name: 'Technical interests' })).toBeInTheDocument();
    expect(screen.getByText(/not a listing of professional client services/i)).toBeInTheDocument();
    expect(await screen.findByText('Machine Learning')).toBeInTheDocument();
  });

  it('keeps public navigation in the requested order', () => {
    expect(navigationItems.map((item) => item.label)).toEqual([
      'Home', 'About', 'Skills', 'Projects', 'Research', 'Experience',
      'Education', 'Achievements', 'Blog', 'Services', 'Contact', 'Resume'
    ]);
  });
});