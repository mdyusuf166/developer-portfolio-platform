import { Download } from 'lucide-react';

import { PageMeta } from '../components/common/PageMeta';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';

export function ResumePage() {
  const { profile } = usePublicPortfolio();
  return (
    <>
      <PageMeta title="Resume" description="Resume availability and AI / ML engineering profile for MD Mahtab Ahmed Mahin." />

      <section className="space-y-8 py-8 md:py-12">
        <div className="space-y-4">
          <p className="eyebrow">Resume</p>
          <h1 className="section-title">Resume</h1>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <p className="mt-1 text-muted-foreground">{profile.title}</p>
            </div>
            {profile.resume ? (
              <Button asChild variant="outline" size="sm">
                <a href={profile.resume} download>
                  <Download className="mr-2 h-4 w-4" /> Download resume
                </a>
              </Button>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-6 text-sm text-muted-foreground">
            <p>{profile.bio}</p>
            <div className="flex flex-wrap gap-2">
              {profile.aboutHighlights.map((highlight) => (
                <Badge key={highlight}>{highlight}</Badge>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {profile.stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border bg-muted p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-base font-medium text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {!profile.resume ? <EmptyState title="Resume unavailable" description="A downloadable resume has not been provided." /> : null}
      </section>
    </>
  );
}
