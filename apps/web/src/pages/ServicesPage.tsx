import { PageMeta } from '../components/common/PageMeta';
import { EmptyState } from '../components/common/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';

export function ServicesPage() {
  const { profile, isLoading, error } = usePublicPortfolio();
  return (
    <>
      <PageMeta title="Areas of Focus" description="Technical interests across AI, machine learning, generative AI, and software engineering." />

      <section className="space-y-8 py-8 md:py-12">
        <div className="space-y-4">
          <p className="eyebrow">Areas of Focus</p>
          <h1 className="section-title">Technical interests</h1>
          <p className="section-copy">These are areas of interest, not a listing of professional client services.</p>
        </div>

        {isLoading ? <p role="status" className="text-sm text-muted-foreground">Loading focus areas...</p> : profile.services.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {profile.services.map((service) => <Card key={service.id}><CardHeader><CardTitle>{service.title}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{service.description}</CardContent></Card>)}
          </div>
        ) : profile.researchInterests.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {profile.researchInterests.map((interest) => (
              <Card key={interest}>
                <CardHeader><CardTitle>{interest}</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground">Area of technical interest.</CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState title={error ? 'Focus areas unavailable' : 'No focus areas listed'} description={error || 'Technical interests will be listed here when confirmed.'} />
        )}
      </section>
    </>
  );
}
