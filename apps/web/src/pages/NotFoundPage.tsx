import { Link } from 'react-router-dom';

import { Button } from '../components/ui/button';
import { PageMeta } from '../components/common/PageMeta';

export function NotFoundPage() {
  return (
    <>
      <PageMeta title="404" description="Page not found" />
      <section className="flex min-h-[55vh] flex-col items-start justify-center" aria-live="polite">
        <p className="eyebrow">404 / Page not found</p>
        <h1 className="mt-4 break-words font-display text-4xl font-medium tracking-tight text-foreground sm:text-5xl">This page took a wrong turn.</h1>
        <p className="mt-4 max-w-lg leading-7 text-muted-foreground">
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
