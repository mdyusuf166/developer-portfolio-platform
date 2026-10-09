import { ArrowRight, BookText, FolderKanban, Sparkles, Trophy, Wrench } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { adminCountsApi, AdminApiError } from '../../lib/admin-api';

const modules = [
  { title: 'Project portfolio', description: 'Curate featured work, categories, and launch-ready case studies.', href: '/admin/projects', icon: FolderKanban },
  { title: 'Skill matrix', description: 'Keep capabilities, stacks, and highlights aligned with your profile.', href: '/admin/skills', icon: Sparkles },
  { title: 'Career timeline', description: 'Manage positions, education, and milestones over time.', href: '/admin/experience', icon: Trophy },
  { title: 'Publishing workflow', description: 'Coordinate articles, resources, and service offerings.', href: '/admin/blog-posts', icon: BookText }
];

export function AdminDashboardPage() {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await adminCountsApi.getDashboardCounts();
        if (mounted) {
          setCounts(result);
        }
      } catch (caughtError) {
        if (mounted) {
          setError(caughtError instanceof AdminApiError ? caughtError.message : 'Unable to load dashboard data.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const quickStats = [
    { label: 'Projects', value: counts?.projects ?? 0, accent: 'bg-sky-500/15 text-sky-200', icon: FolderKanban },
    { label: 'Skills', value: counts?.skills ?? 0, accent: 'bg-violet-500/15 text-violet-200', icon: Sparkles },
    { label: 'Experience', value: counts?.experience ?? 0, accent: 'bg-emerald-500/15 text-emerald-200', icon: BookText },
    { label: 'Education', value: counts?.education ?? 0, accent: 'bg-cyan-500/15 text-cyan-200', icon: Trophy },
    { label: 'Research', value: counts?.research ?? 0, accent: 'bg-indigo-500/15 text-indigo-200', icon: BookText },
    { label: 'Achievements', value: counts?.achievements ?? 0, accent: 'bg-amber-500/15 text-amber-200', icon: Trophy },
    { label: 'Services', value: counts?.services ?? 0, accent: 'bg-rose-500/15 text-rose-200', icon: Wrench },
    { label: 'Blog Posts', value: counts?.blogPosts ?? 0, accent: 'bg-teal-500/15 text-teal-200', icon: BookText }
  ];

  return (
    <div className="space-y-8 text-slate-100">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4 sm:p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Overview</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Dashboard overview</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Monitor your portfolio, update content, and keep the public-facing experience consistent across every operational area.
        </p>
      </section>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/80" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>
      ) : null}

      {!loading && !error ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickStats.map(({ label, value, accent, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">{label}</span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-6 text-3xl font-semibold text-white">{value}</p>
            </div>
          ))}
        </section>
      ) : null}

      <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-white">Operational modules</h3>
          <Link to="/admin/projects" className="inline-flex items-center gap-2 text-sm text-sky-300 hover:text-sky-200">
            Open catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {modules.map(({ title, description, href, icon: Icon }) => (
            <Link key={title} to={href} className="rounded-2xl border border-slate-800 bg-slate-900 p-4 transition-colors hover:border-sky-500/30 hover:bg-slate-900/80">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-300">
                <Icon className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-medium text-white">{title}</h4>
              <p className="mt-2 text-sm text-slate-400">{description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
