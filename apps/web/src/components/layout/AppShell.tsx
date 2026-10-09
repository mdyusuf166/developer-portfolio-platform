import { Outlet } from 'react-router-dom';

import { CommandPalette } from '../common/CommandPalette';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

export function AppShell() {
  return (
    <div id="top" className="relative min-h-screen bg-background text-foreground">
      <a href="#main-content" className="sr-only z-50 bg-primary px-4 py-3 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="mx-auto w-full min-w-0 max-w-7xl scroll-mt-36 px-4 pb-24 pt-8 sm:px-8 md:pt-12">
        <Outlet />
      </main>
      <Footer />
      <CommandPalette />
    </div>
  );
}
