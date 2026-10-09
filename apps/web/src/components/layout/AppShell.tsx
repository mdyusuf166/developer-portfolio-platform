import { Outlet } from 'react-router-dom';

import { CommandPalette } from '../common/CommandPalette';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

export function AppShell() {
  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.08),_transparent_30%)]" />
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
      <CommandPalette />
    </div>
  );
}
