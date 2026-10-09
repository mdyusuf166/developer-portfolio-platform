import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

import { ThemeToggle } from '../common/ThemeToggle';
import { usePublicPortfolio } from '../../hooks/usePublicPortfolio';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-11 items-center text-sm transition-colors hover:text-primary ${isActive ? 'font-semibold text-primary' : 'text-muted-foreground'}`;

export function Navbar() {
  const { profile } = usePublicPortfolio();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const closeOnDesktop = () => { if (media.matches) setOpen(false); };
    media.addEventListener('change', closeOnDesktop);
    return () => media.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    menuRef.current?.querySelector<HTMLElement>('a')?.focus();
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      menuButtonRef.current?.focus();
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <Link to="/" aria-label={`${profile.name}, home`} className="group flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center border border-primary text-sm font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground" aria-hidden="true">M.</span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold tracking-tight text-foreground">{profile.name}</span>
            <span className="block truncate text-xs text-muted-foreground">{profile.shortTitle}</span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-1">
          <ThemeToggle />
          <Link to="/contact" className="hidden min-h-11 items-center gap-1.5 border-b border-primary px-1 text-sm font-semibold text-primary transition-colors hover:border-accent hover:text-accent-foreground sm:inline-flex md:hidden">
            Let&apos;s talk <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            className="grid h-11 w-11 place-items-center text-foreground md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <nav className="mx-auto hidden w-full min-w-0 max-w-7xl border-t border-border px-4 py-2 sm:px-8 md:block" aria-label="Main navigation">
        <div className="flex w-full min-w-0 flex-wrap gap-x-4 gap-y-1">
          {profile.navigation.map((item) => (
            <NavLink key={item.href} to={item.href} end={item.href === '/'} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {open ? (
        <div
          id="mobile-menu"
          ref={menuRef}
          className="border-t border-border bg-background md:hidden"
        >
          <nav aria-label="Mobile navigation" className="mx-auto max-h-[calc(100vh-5.5rem)] max-w-7xl overflow-y-auto px-4 py-2 sm:px-8">
            {profile.navigation.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `flex min-h-12 items-center border-b border-border text-base ${isActive ? 'font-semibold text-primary' : 'text-foreground'}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
