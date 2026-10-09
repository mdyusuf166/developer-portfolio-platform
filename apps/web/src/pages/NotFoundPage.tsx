import { Link } from 'react-router-dom';

import { Button } from '../components/ui/button';
import { PageMeta } from '../components/common/PageMeta';

export function NotFoundPage() {
  return (
    <>
      <PageMeta title="404" description="Page not found" />
      <section className="flex min-h-[60vh] flex-col items-center justify-center text-center" aria-live="polite">
        <p className="text-sm uppercase tracking-[0.2em] text-sky-600">404</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Page not found</h1>
        <p className="mt-4 max-w-lg text-slate-600 dark:text-slate-300">
          The page you were looking for does not exist or has moved.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
