import { clearAdminSession, getAccessToken, getAdminSession, setAdminSession } from './admin-session';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';
const CSRF_KEY = 'portfolio-admin-csrf';

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  error?: { code?: string; message?: string; details?: Record<string, unknown> };
};

export class AdminApiError extends Error {
  status: number;
  code?: string;
  details?: Record<string, unknown>;
  constructor(message: string, status: number, code?: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'AdminApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const parseErrorResponse = (payload: ApiEnvelope<unknown> | null, response: Response) =>
  new AdminApiError(payload?.error?.message ?? 'The request failed.', response.status || 500, payload?.error?.code ?? 'UNKNOWN_ERROR', payload?.error?.details);

const readBody = async (response: Response) => {
  try { return await response.json() as ApiEnvelope<unknown> | null; } catch { return null; }
};

async function rawRequest<T>(path: string, init: RequestInit = {}, useAccessToken = true): Promise<T> {
  const headers = new Headers(init.headers ?? {});
  if (!headers.has('Content-Type') && !(init.body instanceof FormData) && !(typeof Blob !== 'undefined' && init.body instanceof Blob)) {
    headers.set('Content-Type', 'application/json');
  }
  if (useAccessToken && getAccessToken()) headers.set('Authorization', `Bearer ${getAccessToken()}`);
  if (path === '/api/v1/auth/refresh' || path === '/api/v1/auth/logout') {
    const csrfToken = window.sessionStorage.getItem(CSRF_KEY);
    if (csrfToken) headers.set('X-CSRF-Token', csrfToken);
  }
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers, credentials: 'include' });
  const payload = await readBody(response);
  if (!response.ok || payload?.success === false) throw parseErrorResponse(payload, response);
  return (payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload) as T;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  try {
    return await rawRequest<T>(path, init);
  } catch (error) {
    if (!(error instanceof AdminApiError) || error.status !== 401 || path.startsWith('/api/v1/auth/')) throw error;
    try {
      await adminAuthApi.refresh();
      return await rawRequest<T>(path, init);
    } catch (refreshError) {
      clearAdminSession();
      throw refreshError;
    }
  }
}

const createResourceApi = (resource: string) => ({
  list: () => request<unknown[]>(`/api/v1/admin/${resource}`, { method: 'GET' }).then((value) => Array.isArray(value) ? value : []),
  get: (id: string) => request<unknown>(`/api/v1/admin/${resource}/${encodeURIComponent(id)}`, { method: 'GET' }),
  create: (payload: Record<string, unknown>) => request<unknown>(`/api/v1/admin/${resource}`, { method: 'POST', body: JSON.stringify(payload) }),
  update: (id: string, payload: Record<string, unknown>) => request<unknown>(`/api/v1/admin/${resource}/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  remove: (id: string) => request<unknown>(`/api/v1/admin/${resource}/${encodeURIComponent(id)}`, { method: 'DELETE' })
});

async function acquireCsrfToken() {
  const result = await rawRequest<{ csrfToken: string }>('/api/v1/auth/csrf', { method: 'GET' }, false);
  window.sessionStorage.setItem(CSRF_KEY, result.csrfToken);
  return result.csrfToken;
}

export const adminAuthApi = {
  async login(email: string, password: string) {
    const payload = await rawRequest<{ accessToken: string; csrfToken: string; admin: AdminSession['admin'] }>('/api/v1/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password })
    }, false);
    window.sessionStorage.setItem(CSRF_KEY, payload.csrfToken);
    setAdminSession({ accessToken: payload.accessToken, admin: payload.admin });
    return payload;
  },
  async refresh() {
    if (!getAdminSession()) throw new AdminApiError('Session expired. Please sign in again.', 401, 'SESSION_EXPIRED');
    const csrfToken = await acquireCsrfToken();
    const payload = await rawRequest<{ accessToken: string; csrfToken: string; admin: AdminSession['admin'] }>('/api/v1/auth/refresh', {
      method: 'POST', headers: { 'X-CSRF-Token': csrfToken }, body: '{}'
    }, false);
    window.sessionStorage.setItem(CSRF_KEY, payload.csrfToken);
    setAdminSession({ accessToken: payload.accessToken, admin: payload.admin });
    return payload;
  },
  async restore() {
    const session = getAdminSession();
    if (!session) return null;
    if (getAccessToken()) return this.me();
    try {
      return (await this.refresh()).admin;
    } catch (error) {
      clearAdminSession();
      throw error;
    }
  },
  async logout() {
    try {
      if (getAdminSession()) {
        const csrfToken = await acquireCsrfToken();
        await rawRequest('/api/v1/auth/logout', { method: 'POST', headers: { 'X-CSRF-Token': csrfToken }, body: '{}' }, false);
      }
    } finally {
      clearAdminSession();
    }
  },
  me() { return request<AdminSession['admin']>('/api/v1/auth/me', { method: 'GET' }); }
};

export const adminCountsApi = {
  async getDashboardCounts() {
    const results = await Promise.all([projectsApi.list(), skillsApi.list(), experienceApi.list(), educationApi.list(), researchApi.list(), achievementsApi.list(), servicesApi.list(), blogApi.list()]);
    return { projects: results[0].length, skills: results[1].length, experience: results[2].length, education: results[3].length, research: results[4].length, achievements: results[5].length, services: results[6].length, blogPosts: results[7].length };
  }
};

export const projectsApi = { ...createResourceApi('projects'), uploadImage(file: File) { return uploadsApi.upload(file, 'project-image'); } };
export const skillsApi = createResourceApi('skills');
export const experienceApi = createResourceApi('experience');
export const educationApi = createResourceApi('education');
export const researchApi = createResourceApi('research');
export const achievementsApi = createResourceApi('achievements');
export const servicesApi = createResourceApi('services');
export const blogApi = createResourceApi('blog-posts');

export const profileApi = {
  list: () => request<Record<string, unknown>[]>('/api/v1/admin/profile', { method: 'GET' }),
  create: (payload: Record<string, unknown>) => request<unknown>('/api/v1/admin/profile', { method: 'POST', body: JSON.stringify(payload) }),
  update: (_id: string, payload: Record<string, unknown>) => request<unknown>('/api/v1/admin/profile', { method: 'PATCH', body: JSON.stringify(payload) })
};

export const uploadsApi = {
  list: () => request<Record<string, unknown>[]>('/api/v1/admin/uploads', { method: 'GET' }),
  upload(file: File, purpose: string) {
    const body = new FormData(); body.append('file', file); body.append('purpose', purpose);
    return request<Record<string, unknown>>('/api/v1/admin/uploads', { method: 'POST', body });
  },
  remove: (id: string) => request<unknown>(`/api/v1/admin/uploads/${encodeURIComponent(id)}`, { method: 'DELETE' })
};

export function getAdminResourceApi(resource: string) {
  switch (resource) {
    case 'projects': return projectsApi;
    case 'profile': return profileApi;
    case 'skills': return skillsApi;
    case 'experience': return experienceApi;
    case 'education': return educationApi;
    case 'research': return researchApi;
    case 'achievements': return achievementsApi;
    case 'services': return servicesApi;
    case 'blog-posts': return blogApi;
    default: throw new Error(`Unsupported admin resource: ${resource}`);
  }
}

type AdminSession = ReturnType<typeof getAdminSession> extends infer T ? Exclude<T, null> : never;
