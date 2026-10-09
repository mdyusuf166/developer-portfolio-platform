import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import App from '../App';
import { setAdminSession } from '../lib/admin-session';

describe('admin dashboard frontend', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/admin/login');
    localStorage.clear();
    sessionStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (input: RequestInfo | URL) => ({
      ok: true,
      json: async () => ({ success: true, data: String(input).endsWith('/api/v1/auth/me') ? { id: 'admin-1', name: 'Admin User', email: 'admin@example.com', role: 'ADMIN' } : [] })
    })));
  });

  it('renders the admin login route for unauthenticated users', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(await screen.findByRole('heading', { name: /admin access/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows the dashboard shell for authenticated admins', async () => {
    setAdminSession({ accessToken: 'demo-token', admin: { id: 'admin-1', name: 'Admin User', email: 'admin@example.com', role: 'ADMIN' } });

    window.history.pushState({}, '', '/admin');

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(await screen.findByRole('heading', { name: /dashboard overview/i })).toBeInTheDocument();
    expect(screen.getByText(/content operations/i)).toBeInTheDocument();
  });
});
