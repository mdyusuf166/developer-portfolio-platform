import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { Button } from '../ui/button';
import { ThemeToggle } from '../common/ThemeToggle';
import { usePublicPortfolio } from '../../hooks/usePublicPortfolio';

export function Navbar() {
  const { profile } = usePublicPortfolio();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" aria-label={profile.name} className="flex shrink-0 items-center gap-2 text-sm font-semibold text-foreground uppercase sm:gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-base shadow-sm">
            {profile.name.charAt(0)}
          </span>
          {profile.shortTitle}
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center gap-4 px-4 xl:flex xl:justify-center" aria-label="Main navigation">
          {profile.navigation.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `whitespace-nowrap text-sm transition-colors duration-200 ${
                  isActive
                    ? 'font-medium text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm" className="hidden xl:inline-flex">
            <Link to="/contact">Contact Me</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden border-t border-border bg-background/95 xl:hidden"
          >
            <nav aria-label="Mobile navigation" className="mx-auto flex max-w-7xl flex-col px-4 py-4">
              {profile.navigation.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `border-b border-border/80 px-1 py-3 text-sm transition-colors ${
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`
                  }
                >
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
