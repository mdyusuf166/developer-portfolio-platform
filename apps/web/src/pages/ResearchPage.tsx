import { ArrowUpRight } from 'lucide-react';

import { PageMeta } from '../components/common/PageMeta';
import { EmptyState } from '../components/common/EmptyState';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';

export function ResearchPage() {
  const { profile, isLoading, error } = usePublicPortfolio();
  return (
    <>
      <PageMeta title="Research" description="Research interests of MD Mahtab Ahmed Mahin across machine learning, generative AI, RAG, and AI security." />

      <section className="py-8 md:py-12">
        <header className="grid gap-6 border-b border-border pb-9 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.65fr)] md:items-end md:pb-12">
          <div><p className="eyebrow">Research / 03</p><h1 className="section-title mt-4">Questions worth sitting with.</h1></div>
          <p className="section-copy">Current interests span machine learning, generative AI, language systems, and security. Published work is distinguished from ongoing exploration below.</p>
        </header>

        {isLoading ? <p role="status" className="text-sm text-muted-foreground">Loading research...</p> : profile.research.length === 0 ? (
          <div className="grid gap-8 py-9 md:grid-cols-[0.7fr_1.3fr] md:py-12"><div><p className="eyebrow">Working interests</p></div><div><ul className="divide-y divide-border border-y border-border">{profile.researchInterests.map((item, index) => <li key={item} className="flex gap-5 py-4"><span className="font-mono text-xs text-accent">0{index + 1}</span><span className="text-base text-foreground">{item}</span></li>)}</ul><div className="mt-8"><EmptyState title={error ? 'Research unavailable' : 'No research publications listed'} description={error || 'Research outputs will appear here when published or otherwise verified. These interests are not presented as completed research.'} /></div></div></div>
        ) : (
          <div className="divide-y divide-border border-b border-border">
            {profile.research.map((item, index) => (
              <article key={item.title} className="grid gap-5 py-8 md:grid-cols-[3rem_minmax(0,1fr)_minmax(12rem,0.5fr)] md:gap-8">
                <span className="font-mono text-sm text-accent">{String(index + 1).padStart(2, '0')}</span>
                <div><div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-primary"><span>{item.topic ?? 'Research'}</span><span className="text-muted-foreground">{item.status}</span></div><h2 className="mt-3 font-display text-2xl font-medium">{item.title}</h2>{item.publicationDate ? <p className="mt-2 text-xs text-muted-foreground">{item.publicationDate}</p> : null}{item.summary ? <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">{item.summary}</p> : null}{item.methodology ? <div className="mt-4"><h3 className="text-sm font-semibold">Methodology</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{item.methodology}</p></div> : null}<div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">{[...new Set([...(item.tags ?? item.topics ?? []), ...item.technologies])].map((tag) => <span key={tag} className="text-xs text-muted-foreground">{tag}</span>)}</div><div className="mt-4 flex flex-wrap gap-4">{item.link ? <a className="text-link text-sm" href={item.link} target="_blank" rel="noreferrer">View details <ArrowUpRight className="ml-1 inline h-4 w-4" /></a> : null}{item.pdfUrl ? <a className="text-link text-sm" href={item.pdfUrl} target="_blank" rel="noreferrer">Open paper PDF</a> : null}{item.githubUrl ? <a className="text-link text-sm" href={item.githubUrl} target="_blank" rel="noreferrer">GitHub</a> : null}</div></div>
                {item.imageUrl ? <img className="aspect-[4/3] w-full border border-border object-contain" src={item.imageUrl} alt={`${item.title} research figure`} loading="lazy" /> : <p className="border-l border-border pl-4 text-xs leading-6 text-muted-foreground">Published and verified material is shown with its source where available.</p>}
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
