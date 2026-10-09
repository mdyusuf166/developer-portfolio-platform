import { Link } from 'react-router-dom';

import { Button } from '../components/ui/button';
import { PageMeta } from '../components/common/PageMeta';

export function PlaceholderPage({
  title,
  description
}: {
  title: string;
  description?: string;
}) {
  return (
    <>
      <PageMeta title={title} description={description ?? 'Section information is not available.'} />
      <section className="flex min-h-[60vh] flex-col items-center justify-center py-10 text-center">
        <p className="eyebrow">{title}</p>
        <h1 className="section-title mt-4">{title}</h1>
        <p className="section-copy mt-4 max-w-xl">
          {description ?? 'Section information is not available.'}
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
