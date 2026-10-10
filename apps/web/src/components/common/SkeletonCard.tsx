export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mb-2 h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mb-2 h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}
