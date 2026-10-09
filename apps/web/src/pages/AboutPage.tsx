import { PageMeta } from '../components/common/PageMeta';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';

export function AboutPage() {
  const { profile } = usePublicPortfolio();
  return (
    <>
      <PageMeta title="About" description="Meet MD Mahtab Ahmed Mahin, a CSE undergraduate focused on software engineering and exploring AI/ML." />

      <section className="py-8 md:py-12">
        <header className="max-w-4xl border-b border-border pb-9 md:pb-12">
          <p className="eyebrow">About / 02</p>
          <h1 className="section-title mt-4">An engineering focus on intelligent systems.</h1>
          <p className="section-copy mt-6">{profile.bio}</p>
        </header>
        <div className="grid gap-12 py-9 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.55fr)] md:gap-20 md:py-12">
          <div className="space-y-6">
            <h2 className="font-display text-3xl font-medium">The way I think about the work</h2>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground">{profile.about}</p>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground">This site documents project and research work when verified material is ready to share. It does not imply employment or production deployment experience that has not been supplied.</p>
          </div>
          <aside className="h-fit border-t border-primary pt-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Current areas of curiosity</h2>
            <ul className="mt-4 divide-y divide-border border-y border-border">{profile.aboutHighlights.map((item, index) => <li key={item} className="flex min-w-0 gap-4 py-3"><span className="font-mono text-xs text-accent-foreground">{String(index + 1).padStart(2, '0')}</span><span className="min-w-0 break-words text-sm text-foreground">{item}</span></li>)}</ul>
          </aside>
        </div>
        <div className="grid gap-6 border-t border-border pt-8 sm:grid-cols-3">
          {profile.stats.map((stat) => <div key={stat.label} className="border-l border-border pl-4"><p className="eyebrow">{stat.label}</p><p className="mt-2 text-sm leading-6 text-foreground">{stat.value}</p></div>)}
        </div>
      </section>
    </>
  );
}
