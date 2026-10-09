import { AnimatePresence, motion } from 'framer-motion';
import { Command, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { profile } from '../../data/profile';

const commands = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Skills', href: '/skills' },
  { label: 'Experience', href: '/experience' },
  { label: 'Education', href: '/education' },
  { label: 'Projects', href: '/projects' },
  { label: 'Research', href: '/research' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
  { label: 'Resume', href: '/resume' }
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }

      if (event.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card/90 px-3 py-2 text-sm text-muted-foreground shadow-soft backdrop-blur-sm transition-colors hover:text-foreground sm:bottom-6 sm:right-6"
        aria-label="Open command palette"
      >
        <Command className="h-4 w-4" />
        <span className="hidden sm:inline">Ctrl K</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/40 p-3 pt-16 backdrop-blur-sm sm:p-4 sm:pt-20"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              exit={{ y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="my-auto w-full min-w-0 max-w-2xl rounded-2xl border border-border bg-card shadow-glow"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center gap-3 border-b border-border px-4 py-3 text-sm text-muted-foreground">
                <Search className="h-4 w-4" />
                <input
                  autoFocus
                  className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="Search sections..."
                  aria-label="Search sections"
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') setOpen(false);
                  }}
                />
              </div>

              <div className="max-h-[min(60vh,28rem)] overflow-y-auto p-2">
                {commands.map((command) => (
                  <Link
                    key={command.href}
                    to={command.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    <span>{command.label}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{command.href}</span>
                  </Link>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate('/resume');
                  }}
                  className="mt-2 flex min-h-11 w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
                >
                  <span>CV image</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{profile.resume}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
