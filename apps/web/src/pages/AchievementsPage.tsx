import { PageMeta } from '../components/common/PageMeta';
import { EmptyState } from '../components/common/EmptyState';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';

export function AchievementsPage() {
  const { profile, isLoading, error } = usePublicPortfolio();
  return (
    <>
      <PageMeta title="Achievements" description="Verified achievements and credentials for MD Mahtab Ahmed Mahin." />

      <section className="py-8 md:py-12">
        <header className="max-w-4xl border-b border-border pb-9 md:pb-12"><p className="eyebrow">Achievements / 07</p><h1 className="section-title mt-4">Verified achievements</h1><p className="section-copy mt-5">Credentials and recognition appear here with their issuer and source where available.</p></header>

        {isLoading ? <p role="status" className="text-sm text-muted-foreground">Loading achievements...</p> : profile.achievements.length === 0 ? (
          <EmptyState title={error ? 'Achievements unavailable' : 'No verified achievements listed'} description={error || 'Awards, certifications, and other achievements will appear here when confirmed information is available.'} />
        ) : (
          <div className="divide-y divide-border border-b border-border">
            {profile.achievements.map((achievement, index) => (
              <article key={achievement.title} className="grid min-w-0 gap-5 py-7 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,0.55fr)] md:gap-8 md:py-9">
                <span className="font-mono text-sm text-accent-foreground">{String(index + 1).padStart(2, '0')}</span>
                <div><p className="eyebrow">{achievement.issuer ?? 'Achievement'}{achievement.date ? ` · ${achievement.date}` : ''}</p><h2 className="mt-2 font-display text-2xl font-medium">{achievement.title}</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{achievement.description}</p>{achievement.detail ? <p className="mt-2 text-sm text-foreground">{achievement.detail}</p> : null}<div className="mt-4 flex flex-wrap gap-4">{achievement.url ? <a className="text-link text-sm" href={achievement.url} target="_blank" rel="noreferrer">View credential</a> : null}{achievement.documentUrl ? <a className="text-link text-sm" href={achievement.documentUrl} target="_blank" rel="noreferrer">Open document</a> : null}</div></div>
                {achievement.imageUrl ? <img className="max-h-52 w-full border border-border object-contain" src={achievement.imageUrl} alt={`${achievement.title} image`} loading="lazy" /> : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
