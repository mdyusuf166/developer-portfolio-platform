export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center" aria-live="polite" aria-busy="true">
      <div className="flex items-center gap-3 text-muted-foreground">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" aria-hidden="true" />
        <span>{message}</span>
      </div>
    </div>
  );
}
