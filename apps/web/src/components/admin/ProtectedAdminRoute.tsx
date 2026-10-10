import { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';

import { AdminLayout } from './AdminLayout';
import { AdminUploadsPage } from '../../pages/admin/AdminUploadsPage';
import { AdminDashboardPage } from '../../pages/admin/AdminDashboardPage';
import { AdminResourcePage } from '../../pages/admin/AdminResourcePage';
import { adminAuthApi } from '../../lib/admin-api';
import { clearAdminSession, getAdminSession } from '../../lib/admin-session';
import { LoadingState } from '../common/LoadingState';

function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      <div className="max-w-md rounded-3xl border border-rose-500/30 bg-slate-900 p-8 text-center shadow-2xl">
        <p className="text-xs uppercase tracking-[0.22em] text-rose-300">Access denied</p>
        <h1 className="mt-4 text-3xl font-semibold">Admin access required</h1>
        <p className="mt-3 text-sm text-slate-400">Your account does not have permission to use the admin dashboard.</p>
      </div>
    </div>
  );
}

function RequireAdminAuth() {
  const navigate = useNavigate();
  const [state, setState] = useState<'checking' | 'allowed' | 'denied'>('checking');

  useEffect(() => {
    const session = getAdminSession();

    if (!session) {
      navigate('/admin/login', { replace: true });
      return;
    }

    const run = async () => {
      try {
        const admin = await adminAuthApi.restore();
        if (!admin) {
          navigate('/admin/login', { replace: true });
          return;
        }
        if (admin.role !== 'ADMIN') {
          setState('denied');
          return;
        }
        setState('allowed');
      } catch {
        clearAdminSession();
        navigate('/admin/login', { replace: true });
      }
    };

    void run();
  }, [navigate]);

  if (state === 'checking') {
    return <LoadingState message="Verifying admin access..." />;
  }

  if (state === 'denied') {
    return <AccessDeniedPage />;
  }

  return <Outlet />;
}

export function ProtectedAdminRoute() {
  return (
    <Routes>
      <Route element={<RequireAdminAuth />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="profile" element={<AdminResourcePage resource="profile" />} />
          <Route path="uploads" element={<AdminUploadsPage />} />
          <Route path="projects" element={<AdminResourcePage resource="projects" />} />
          <Route path="skills" element={<AdminResourcePage resource="skills" />} />
          <Route path="experience" element={<AdminResourcePage resource="experience" />} />
          <Route path="education" element={<AdminResourcePage resource="education" />} />
          <Route path="research" element={<AdminResourcePage resource="research" />} />
          <Route path="achievements" element={<AdminResourcePage resource="achievements" />} />
          <Route path="services" element={<AdminResourcePage resource="services" />} />
          <Route path="blog-posts" element={<AdminResourcePage resource="blog-posts" />} />
        </Route>
      </Route>
    </Routes>
  );
}
