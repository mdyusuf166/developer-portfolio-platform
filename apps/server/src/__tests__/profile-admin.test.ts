import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../app.js';
import { generateAccessToken } from '../lib/token.js';
import { portfolioRepository } from '../repositories/portfolio.repository.js';

const profileInput = {
  name: 'Profile Test Owner',
  title: 'AI / ML ENGINEER',
  headline: 'Owner-provided headline',
  bio: 'Owner-provided summary',
  location: null,
  email: null,
  github: null,
  linkedin: null,
  profileImageUrl: null,
  resumeUrl: null,
  socials: []
};

afterEach(() => vi.restoreAllMocks());

describe('admin profile first run', () => {
  it('creates the initial profile and exposes it to admin and public reads', async () => {
    const storedProfile = { id: 'primary', ...profileInput };
    vi.spyOn(portfolioRepository, 'getStoredProfile')
      .mockResolvedValueOnce(null as never)
      .mockResolvedValue(storedProfile as never);
    vi.spyOn(portfolioRepository, 'saveProfile').mockResolvedValue(storedProfile as never);
    vi.spyOn(portfolioRepository, 'getProfileSnapshot').mockImplementation(async () => ({
      profile: {
        name: String(storedProfile.name),
        title: String(storedProfile.title),
        headline: String(storedProfile.headline),
        bio: String(storedProfile.bio),
        location: undefined,
        email: undefined,
        github: undefined,
        linkedin: undefined,
        resume: undefined,
        availability: 'Portfolio in progress'
      },
      socialLinks: [],
      stats: [],
      skills: [],
      projects: [],
      blogPosts: [],
      experience: [],
      education: [],
      research: [],
      achievements: [],
      services: []
    }) as never);

    const app = createApp();
    const token = generateAccessToken({ sub: 'profile-admin', role: 'ADMIN' });
    const auth = { Authorization: `Bearer ${token}` };

    expect((await request(app).get('/api/v1/admin/profile').set(auth)).body.data).toEqual([]);

    const createResponse = await request(app).post('/api/v1/admin/profile').set(auth).send(profileInput);
    expect(createResponse.status).toBe(200);
    expect(createResponse.body.data).toMatchObject({ id: 'primary', name: profileInput.name, title: profileInput.title });

    const adminRead = await request(app).get('/api/v1/admin/profile').set(auth);
    expect(adminRead.status).toBe(200);
    expect(adminRead.body.data[0]).toMatchObject({ name: profileInput.name, headline: profileInput.headline });

    const publicRead = await request(app).get('/api/v1/profile');
    expect(publicRead.status).toBe(200);
    expect(publicRead.body.data).toMatchObject({ name: profileInput.name, title: profileInput.title, bio: profileInput.bio });
  });

  it('rejects profile creation without admin authorization', async () => {
    const response = await request(createApp()).post('/api/v1/admin/profile').send(profileInput);
    expect(response.status).toBe(401);
  });
});