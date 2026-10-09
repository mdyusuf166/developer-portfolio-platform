import { afterEach, describe, expect, it } from 'vitest';
import { clearAdminSession, getAccessToken, getAdminSession, setAdminSession } from '../lib/admin-session';

describe('admin session storage', () => {
  afterEach(() => {
    clearAdminSession();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('keeps only admin display data in persistent storage and the access token in memory', () => {
    setAdminSession({
      accessToken: 'short-lived-access-token',
      admin: { id: 'admin-1', name: 'Admin', email: 'admin@example.test', role: 'ADMIN' }
    });

    expect(getAccessToken()).toBe('short-lived-access-token');
    expect(getAdminSession()?.admin.role).toBe('ADMIN');
    expect(localStorage.getItem('portfolio-admin-profile')).not.toContain('accessToken');
    expect(localStorage.getItem('portfolio-admin-profile')).not.toContain('refreshToken');
  });

  it('removes legacy browser-stored credentials', () => {
    localStorage.setItem('portfolio-admin-session', JSON.stringify({ accessToken: 'old', refreshToken: 'old' }));
    expect(getAdminSession()).toBeNull();
    expect(localStorage.getItem('portfolio-admin-session')).toBeNull();
  });
});
