import { type FormEvent, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { adminAuthApi } from '../../lib/admin-api';
import { clearAdminSession, getAccessToken, getAdminSession } from '../../lib/admin-session';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const session = getAdminSession();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const shouldRestore = Boolean(session && !getAccessToken());

  useEffect(() => {
    if (!shouldRestore) return;
    setRestoring(true);
    void adminAuthApi.restore()
      .then((admin) => { if (admin) navigate('/admin/dashboard', { replace: true }); })
      .catch(() => clearAdminSession())
      .finally(() => setRestoring(false));
  }, [navigate, shouldRestore]);

  if (session && getAccessToken()) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleChange = (field: 'email' | 'password', value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const result = await adminAuthApi.login(form.email, form.password);
      if (result.admin?.role !== 'ADMIN') {
        throw new Error('Access denied. Admin role required.');
      }
      navigate('/admin/dashboard', { replace: true });
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_32%),linear-gradient(135deg,#020617,#0f172a_40%,#111827)] px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl backdrop-blur-sm sm:p-8">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-sky-300">Portfolio admin</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Admin access</h1>
        </div>

        {restoring ? <p role="status" className="mb-5 text-center text-sm text-slate-300">Restoring secure admin session...</p> : null}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-200">
              Email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => handleChange('email', event.target.value)}
              placeholder="admin@example.com"
              className="border-slate-700 bg-slate-950 text-white placeholder:text-slate-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-200">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => handleChange('password', event.target.value)}
              placeholder="Enter your password"
              className="border-slate-700 bg-slate-950 text-white placeholder:text-slate-500"
              required
            />
          </div>

          {error ? (
            <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p>
          ) : null}

          <Button type="submit" className="w-full" disabled={submitting || restoring}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}
