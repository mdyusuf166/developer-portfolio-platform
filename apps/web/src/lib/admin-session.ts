export type AdminSession = {
  accessToken: string;
  admin: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

const ADMIN_SESSION_KEY = 'portfolio-admin-profile';
const LEGACY_SESSION_KEY = 'portfolio-admin-session';
let accessToken: string | undefined;

export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  // Remove credentials written by older builds. Refresh credentials are now HttpOnly cookies.
  window.localStorage.removeItem(LEGACY_SESSION_KEY);
  const raw = window.sessionStorage.getItem(ADMIN_SESSION_KEY);
  if (!raw) return null;
  try {
    const admin = JSON.parse(raw) as AdminSession['admin'];
    if (!admin?.id || !admin.role) throw new Error('Invalid cached admin profile');
    return { accessToken: accessToken ?? '', admin };
  } catch {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    return null;
  }
}

export function setAdminSession(session: AdminSession) {
  accessToken = session.accessToken;
  window.sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session.admin));
}

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token: string) {
  accessToken = token;
}

export function clearAdminSession() {
  accessToken = undefined;
  window.localStorage.removeItem(LEGACY_SESSION_KEY);
  window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
  window.sessionStorage.removeItem('portfolio-admin-csrf');
}
