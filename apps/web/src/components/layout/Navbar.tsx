import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { ThemeToggle } from '../common/ThemeToggle';
import { usePublicPortfolio } from '../../hooks/usePublicPortfolio';

export function Navbar() {
  const { profile } = usePublicPortfolio();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link to="/" aria-label={`${profile.name}, home`} className="group flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center border border-primary text-sm font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground" aria-hidden="true">M.</span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold tracking-tight text-foreground">{profile.name}</span>
            <span className="block text-xs text-muted-foreground">{profile.shortTitle}</span>
          </span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-end gap-5 lg:flex xl:gap-6" aria-label="Main navigation">
          {profile.navigation.map((item) => (
            <NavLink key={item.href} to={item.href} end={item.href === '/'} className={({ isActive }) => `whitespace-nowrap text-[0.82rem] transition-colors hover:text-primary ${isActive ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <ThemeToggle />
          <Link to="/contact" className="hidden items-center gap-1.5 border-b border-primary px-1 py-2 text-sm font-semibold text-primary transition-colors hover:border-accent hover:text-accent xl:inline-flex">
            Let&apos;s talk <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button type="button" className="grid h-11 w-11 place-items-center text-foreground lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((current) => !current)}>
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div id="mobile-menu" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden border-t border-border bg-background lg:hidden">
            <nav aria-label="Mobile navigation" className="mx-auto grid max-w-7xl grid-cols-2 px-5 py-4 sm:px-8">
              {profile.navigation.map((item) => (
                <NavLink key={item.href} to={item.href} end={item.href === '/'} onClick={() => setOpen(false)} className={({ isActive }) => `border-b border-border px-2 py-3 text-sm ${isActive ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
