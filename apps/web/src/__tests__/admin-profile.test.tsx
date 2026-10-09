import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminResourcePage } from '../pages/admin/AdminResourcePage';
import { setAdminSession } from '../lib/admin-session';

const savedProfile = {
  id: 'primary',
  name: 'Owner-provided name',
  title: 'AI / ML ENGINEER',
  headline: 'Owner-provided headline',
  bio: 'Owner-provided bio',
  socials: []
};

describe('admin profile first-run', () => {
  beforeEach(() => {
    setAdminSession({
      accessToken: 'admin-test-token',
      admin: { id: 'admin-1', name: 'Admin', email: 'admin@local.test', role: 'ADMIN' }
    });
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, data: [] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, data: savedProfile }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true, data: [savedProfile] }) }));
  });

  it('offers profile setup and saves the initial profile record', async () => {
    render(<AdminResourcePage resource="profile" />);

    fireEvent.click(await screen.findByRole('button', { name: 'Set up profile' }));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: savedProfile.name } });
    fireEvent.change(screen.getByLabelText('Role / title'), { target: { value: savedProfile.title } });
    fireEvent.change(screen.getByLabelText('Headline'), { target: { value: savedProfile.headline } });
    fireEvent.change(screen.getByLabelText('Summary / bio'), { target: { value: savedProfile.bio } });
    fireEvent.click(screen.getByRole('button', { name: 'Create item' }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));
    expect(fetch).toHaveBeenNthCalledWith(2, '/api/v1/admin/profile', expect.objectContaining({ method: 'POST' }));
    expect(await screen.findByText('AI / ML ENGINEER')).toBeInTheDocument();
  });
});
