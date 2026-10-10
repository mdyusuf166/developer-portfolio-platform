import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AchievementsPage } from '../pages/AchievementsPage';
import { BlogPage } from '../pages/BlogPage';
import { ContactPage } from '../pages/ContactPage';
import { EducationPage } from '../pages/EducationPage';
import { ExperiencePage } from '../pages/ExperiencePage';
import { ResumePage } from '../pages/ResumePage';
import { ServicesPage } from '../pages/ServicesPage';
import { SkillsPage } from '../pages/SkillsPage';
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

  it('renders the supplied public profile and honest empty states for unavailable records', async () => {
    const pages = [
      <ExperiencePage key="experience" />,
      <EducationPage key="education" />,
      <AchievementsPage key="achievements" />,
      <BlogPage key="blog" />,
      <ContactPage key="contact" />,
      <ResumePage key="resume" />
    ];

    render(<>{pages}</>);

    expect(await screen.findByText('Collaboration')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'BSc in Computer Science and Engineering' })).toBeInTheDocument();
    expect(await screen.findByText('No verified achievements listed')).toBeInTheDocument();
    expect(await screen.findByText('No articles published')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'mahtabmahim2004@gmail.com' })).toHaveAttribute('href', 'mailto:mahtabmahim2004@gmail.com');
    expect(screen.getByRole('link', { name: 'Download CV' })).toHaveAttribute('href', '/resume.jpg');
    expect(screen.getByRole('img', { name: /jpeg screenshot/i })).toHaveAttribute('src', '/resume.jpg');
  });

  it('describes Services navigation content as interests rather than client services', async () => {
    render(<ServicesPage />);

    expect(screen.getByRole('heading', { name: 'Technical interests' })).toBeInTheDocument();
    expect(screen.getByText(/not a listing of professional client services/i)).toBeInTheDocument();
    expect(await screen.findByText('Artificial intelligence and machine learning')).toBeInTheDocument();
  });

  it('separates evidenced skills from learning topics', async () => {
    render(<SkillsPage />);

    expect(await screen.findByRole('heading', { name: 'Programming Languages' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Computer Science Fundamentals' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Academic and Scientific Computing' })).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText(/does not name coursework/i)).toBeInTheDocument();
    expect(screen.queryByText('PyTorch')).not.toBeInTheDocument();
    expect(screen.queryByText(/proficiency/i)).toBeInTheDocument();
  });

  it('keeps public navigation in the requested order', () => {
    expect(navigationItems.map((item) => item.label)).toEqual([
      'Home', 'About', 'Skills', 'Projects', 'Research', 'Experience',
      'Education', 'Achievements', 'Blog', 'Services', 'Contact', 'Resume'
    ]);
  });
});
