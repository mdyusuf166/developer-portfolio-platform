import { ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '../ui/button';
import { usePublicPortfolio } from '../../hooks/usePublicPortfolio';

export function Footer() {
  const { profile } = usePublicPortfolio();
  return (
    <footer className="border-t border-border bg-card/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-2">
            <p className="text-lg font-semibold tracking-tight text-foreground">{profile.name}</p>
            <p className="text-sm text-muted-foreground">{profile.title}</p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {profile.navigation.slice(0, 6).map((item) => (
              <Link key={item.href} to={item.href} className="transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t border-border pt-5 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} {profile.name}.</div>
        </div>
      </div>

      <div className="border-t border-border/80 bg-background/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <span>All rights reserved.</span>
          <Button asChild variant="ghost" size="sm" className="h-8 px-2">
            <a href="#top" onClick={(event) => {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}>
              <span className="inline-flex items-center gap-1">
                Back to top <ArrowUp className="h-3.5 w-3.5" />
              </span>
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
