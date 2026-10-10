import { BarChart3, BookOpenText, Briefcase, ChevronRight, FolderKanban, GraduationCap, Image, LogOut, ShieldCheck, Sparkles, UserRound, UserRoundCog, Wrench } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { adminAuthApi } from '../../lib/admin-api';
import { getAdminSession } from '../../lib/admin-session';
import { PageMeta } from '../common/PageMeta';
import { Button } from '../ui/button';

const navigation = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
  { label: 'Profile', href: '/admin/profile', icon: UserRoundCog },
  { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { label: 'Skills', href: '/admin/skills', icon: Sparkles },
  { label: 'Experience', href: '/admin/experience', icon: Briefcase },
  { label: 'Education', href: '/admin/education', icon: GraduationCap },
  { label: 'Research', href: '/admin/research', icon: BookOpenText },
  { label: 'Achievements', href: '/admin/achievements', icon: ShieldCheck },
  { label: 'Services', href: '/admin/services', icon: Wrench },
  { label: 'Blog Posts', href: '/admin/blog-posts', icon: UserRound },
  { label: 'Media / Uploads', href: '/admin/uploads', icon: Image }
];

export function AdminLayout() {
  const navigate = useNavigate();
  const session = getAdminSession();

  const handleLogout = async () => {
    try {
      await adminAuthApi.logout();
    } finally {
      navigate('/admin/login', { replace: true });
    }
  };

  return (
    <>
      <PageMeta title="Admin" description="Portfolio admin dashboard" robots="noindex, nofollow" />
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <div className="mx-auto flex min-w-0 max-w-[1600px] gap-4 px-3 py-4 sm:gap-6 sm:px-4 sm:py-6 lg:px-8">
          <aside className="hidden w-72 shrink-0 rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl lg:block">
            <div className="mb-8 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sm font-semibold text-sky-300">
                {session?.admin.name?.charAt(0) ?? 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Admin</p>
                <p className="break-words font-medium text-slate-100">{session?.admin.name ?? 'Portfolio Admin'}</p>
              </div>
            </div>

            <nav className="space-y-2" aria-label="Admin navigation">
              {navigation.map(({ label, href, icon: Icon }) => (
                <NavLink
                  key={href}
                  to={href}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${
                      isActive ? 'bg-sky-500/15 text-sky-200 ring-1 ring-sky-500/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {label}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </NavLink>
              ))}
            </nav>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Session</p>
              <p className="mt-3 break-all text-sm text-slate-200">{session?.admin.email ?? 'admin@example.com'}</p>
              <Button variant="outline" className="mt-4 w-full justify-center border-slate-700 text-slate-100" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </aside>

          <div className="min-w-0 flex-1 rounded-3xl border border-slate-800 bg-slate-900/70 shadow-2xl">
            <header className="flex flex-col gap-3 border-b border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Portfolio control center</p>
                <h1 className="mt-1 text-2xl font-semibold text-white">Content operations</h1>
              </div>

              <Button variant="outline" className="border-slate-700 text-slate-100 lg:hidden" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </header>

            <nav className="grid grid-cols-1 gap-2 border-b border-slate-800 px-3 py-3 min-[380px]:grid-cols-2 sm:grid-cols-3 sm:px-4 sm:py-4 md:grid-cols-4 lg:hidden" aria-label="Admin navigation">
              {navigation.map(({ label, href, icon: Icon }) => (
                <NavLink
                  key={href}
                  to={href}
                  className={({ isActive }) => isActive
                    ? 'flex min-h-11 min-w-0 items-center gap-2 rounded-xl bg-sky-500/15 px-3 py-2 text-sm text-sky-200 ring-1 ring-sky-500/20'
                    : 'flex min-h-11 min-w-0 items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white'}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 break-words">{label}</span>
                </NavLink>
              ))}
            </nav>

            <main className="min-w-0 p-4 sm:p-5 md:p-7">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
