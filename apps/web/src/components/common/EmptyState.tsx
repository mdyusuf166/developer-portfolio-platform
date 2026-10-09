import { Inbox } from 'lucide-react';

export function EmptyState({ title, description, className }: { title: string; description: string; className?: string }) {
  return (
    <div className="flex min-h-[180px] flex-col items-start justify-center border-y border-border bg-card/60 px-6 py-8 text-left sm:px-8" role="status">
      <Inbox className="mb-4 h-6 w-6 text-primary" aria-hidden="true" />
      <h2 className={`font-display text-2xl font-medium text-foreground ${className ?? ''}`}>{title}</h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}
