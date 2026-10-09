import { Download } from 'lucide-react';

import { PageMeta } from '../components/common/PageMeta';
import { EmptyState } from '../components/common/EmptyState';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';

export function ResumePage() {
  const { profile } = usePublicPortfolio();
  return (
    <>
      <PageMeta title="Resume" description="Resume availability and AI / ML engineering profile for MD Mahtab Ahmed Mahin." />

      <section className="py-8 md:py-12">
        <header className="max-w-4xl border-b border-border pb-9 md:pb-12"><p className="eyebrow">Resume / 11</p><h1 className="section-title mt-4">A concise record of the work.</h1><p className="section-copy mt-5">A downloadable copy is available when the owner has published one.</p></header>
        <div className="grid gap-10 py-9 md:grid-cols-[minmax(0,1fr)_minmax(15rem,0.55fr)] md:py-12">
          <div><p className="eyebrow">{profile.title}</p><h2 className="mt-3 font-display text-3xl font-medium">{profile.name}</h2><p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">{profile.bio}</p>{profile.resume ? <a href={profile.resume} download className="mt-7 inline-flex min-h-12 items-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"><Download className="h-4 w-4" /> Download resume</a> : <div className="mt-7"><EmptyState title="Resume unavailable" description="A downloadable resume has not been provided." /></div>}</div>
          <aside className="h-fit border-t border-primary pt-5"><h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Focus</h2><ul className="mt-4 divide-y divide-border border-y border-border">{profile.aboutHighlights.map((highlight) => <li key={highlight} className="py-3 text-sm text-foreground">{highlight}</li>)}</ul></aside>
        </div>
        <div className="grid gap-5 border-t border-border pt-7 sm:grid-cols-3">{profile.stats.map((stat) => <div key={stat.label} className="border-l border-border pl-4"><p className="eyebrow">{stat.label}</p><p className="mt-2 text-sm leading-6">{stat.value}</p></div>)}</div>
      </section>
    </>
  );
}
