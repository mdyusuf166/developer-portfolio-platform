import { PageMeta } from '../components/common/PageMeta';
import { EmptyState } from '../components/common/EmptyState';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';

export function ServicesPage() {
  const { profile, isLoading, error } = usePublicPortfolio();
  return (
    <>
      <PageMeta title="Areas of Focus" description="Technical interests across AI, machine learning, generative AI, and software engineering." />

      <section className="py-8 md:py-12">
        <header className="max-w-4xl border-b border-border pb-9 md:pb-12"><p className="eyebrow">Practice / 09</p><h1 className="section-title mt-4">Technical interests</h1><p className="section-copy mt-5">These are areas of interest, not a listing of professional client services.</p></header>

        {isLoading ? <p role="status" className="text-sm text-muted-foreground">Loading focus areas...</p> : profile.services.length ? (
          <div className="divide-y divide-border border-b border-border">
            {profile.services.map((service, index) => <article key={service.id} className="grid gap-4 py-7 sm:grid-cols-[3rem_minmax(12rem,0.7fr)_1.3fr] sm:gap-8"><span className="font-mono text-sm text-accent-foreground">{String(index + 1).padStart(2, '0')}</span><div><p className="eyebrow">{service.category ?? 'Area of interest'}</p><h2 className="mt-2 font-display text-2xl font-medium">{service.title}</h2></div><p className="text-sm leading-7 text-muted-foreground">{service.description}</p></article>)}
          </div>
        ) : profile.researchInterests.length ? (
          <div className="divide-y divide-border border-b border-border">
            {profile.researchInterests.map((interest, index) => <article key={interest} className="grid gap-4 py-6 sm:grid-cols-[3rem_minmax(12rem,0.7fr)_1.3fr] sm:gap-8"><span className="font-mono text-sm text-accent-foreground">{String(index + 1).padStart(2, '0')}</span><h2 className="font-display text-2xl font-medium">{interest}</h2><p className="text-sm leading-7 text-muted-foreground">A current area of technical curiosity.</p></article>)}
          </div>
        ) : (
          <EmptyState title={error ? 'Focus areas unavailable' : 'No focus areas listed'} description={error || 'Technical interests will be listed here when confirmed.'} />
        )}
      </section>
    </>
  );
}
