export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center" aria-live="polite" aria-busy="true">
      <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500" aria-hidden="true" />
        <span>{message}</span>
      </div>
    </div>
  );
}
