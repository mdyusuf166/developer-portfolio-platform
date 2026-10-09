import { PageMeta } from '../components/common/PageMeta';
import { EmptyState } from '../components/common/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';

export function AchievementsPage() {
  const { profile, isLoading, error } = usePublicPortfolio();
  return (
    <>
      <PageMeta title="Achievements" description="Verified achievements and credentials for MD Mahtab Ahmed Mahin." />

      <section className="space-y-8 py-8 md:py-12">
        <div className="space-y-4">
          <p className="eyebrow">Achievements</p>
          <h1 className="section-title">Achievements</h1>
        </div>

        {isLoading ? <p role="status" className="text-sm text-muted-foreground">Loading achievements...</p> : profile.achievements.length === 0 ? (
          <EmptyState title={error ? 'Achievements unavailable' : 'No verified achievements listed'} description={error || 'Awards, certifications, and other achievements will appear here when confirmed information is available.'} />
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {profile.achievements.map((achievement) => (
              <Card key={achievement.title} className="h-full">
              <CardHeader>
                <CardTitle>{achievement.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {achievement.imageUrl ? <img className="max-h-48 rounded-lg object-contain" src={achievement.imageUrl} alt={`${achievement.title} image`} /> : null}
                <p>{achievement.description}</p>
                {achievement.detail ? <p className="font-medium text-foreground">{achievement.detail}</p> : null}
                {achievement.url ? <a className="inline-block text-primary underline-offset-4 hover:underline" href={achievement.url} target="_blank" rel="noreferrer">View credential</a> : null}
                {achievement.documentUrl ? <a className="inline-block text-primary underline-offset-4 hover:underline" href={achievement.documentUrl} target="_blank" rel="noreferrer">Open document</a> : null}
              </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
