import { ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '../ui/button';
import { usePublicPortfolio } from '../../hooks/usePublicPortfolio';

export function Footer() {
  const { profile } = usePublicPortfolio();
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="min-w-0 space-y-2">
            <p className="break-words font-display text-2xl font-medium text-foreground">{profile.name}</p>
            <p className="break-words text-sm text-muted-foreground">{profile.title} · {profile.shortBio}</p>
          </div>
          <nav aria-label="Footer navigation" className="flex min-w-0 max-w-xl flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
            {profile.navigation.map((item) => <Link key={item.href} to={item.href} className="inline-flex min-h-11 items-center transition-colors hover:text-primary">{item.label}</Link>)}
          </nav>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <Button asChild variant="ghost" size="sm" className="h-10 px-2">
            <a href="#top" onClick={(event) => {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
            }}>
              <span className="inline-flex items-center gap-1">Back to top <ArrowUp className="h-3.5 w-3.5" /></span>
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
