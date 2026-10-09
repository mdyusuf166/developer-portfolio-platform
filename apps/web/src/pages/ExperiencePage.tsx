import { ArrowRight, BriefcaseBusiness } from 'lucide-react';

import { PageMeta } from '../components/common/PageMeta';
import { EmptyState } from '../components/common/EmptyState';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';

export function ExperiencePage() {
  const { profile, isLoading, error } = usePublicPortfolio();
  return (
    <>
      <PageMeta title="Experience" description="Verified professional experience for MD Mahtab Ahmed Mahin, AI / ML Engineer." />

      <section className="py-8 md:py-12">
        <header className="max-w-4xl border-b border-border pb-9 md:pb-12"><p className="eyebrow">Experience / 05</p><h1 className="section-title mt-4">Experience</h1><p className="section-copy mt-5">Roles and contributions are shown when verified details are available.</p></header>

        {isLoading ? <p role="status" className="text-sm text-muted-foreground">Loading experience...</p> : profile.experience.length === 0 ? (
          <EmptyState title={error ? 'Experience unavailable' : 'No verified experience listed'} description={error || 'Professional roles and contributions will appear here when their details are available.'} />
        ) : (
          <div className="divide-y divide-border border-b border-border">
            {profile.experience.map((item, index) => (
              <article key={`${item.organization}-${item.role}`} className="grid gap-4 py-8 md:grid-cols-[3rem_minmax(0,0.65fr)_minmax(0,1.35fr)] md:gap-8 md:py-10">
                <span className="font-mono text-sm text-accent-foreground">{String(index + 1).padStart(2, '0')}</span>
                <div className="text-sm text-muted-foreground"><p className="flex items-center gap-2"><BriefcaseBusiness className="h-4 w-4 text-primary" aria-hidden="true" />{item.period || 'Dates not listed'}</p>{item.location ? <p className="mt-2">{item.location}</p> : null}</div>
                <div><p className="eyebrow">{item.role}</p><h2 className="mt-2 font-display text-2xl font-medium">{item.company}</h2>{item.description ? <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{item.description}</p> : null}{item.technologies.length ? <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">{item.technologies.map((tech) => <li key={tech} className="text-xs text-muted-foreground">{tech}</li>)}</ul> : null}{item.responsibilities.length || item.achievements.length ? <ul className="mt-4 space-y-2 text-sm text-muted-foreground">{[...item.responsibilities, ...item.achievements].map((entry) => <li key={entry} className="flex gap-3"><ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><span>{entry}</span></li>)}</ul> : null}</div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
