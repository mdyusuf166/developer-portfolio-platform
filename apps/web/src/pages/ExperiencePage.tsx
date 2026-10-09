import { ArrowRight, BriefcaseBusiness } from 'lucide-react';

import { PageMeta } from '../components/common/PageMeta';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';

export function ExperiencePage() {
  const { profile, isLoading, error } = usePublicPortfolio();
  return (
    <>
      <PageMeta title="Experience" description="Verified professional experience for MD Mahtab Ahmed Mahin, AI / ML Engineer." />

      <section className="space-y-8 py-8 md:py-12">
        <div className="space-y-4">
          <p className="eyebrow">Experience</p>
          <h1 className="section-title">Experience</h1>
          <p className="section-copy">Verified roles and contributions will be listed here.</p>
        </div>

        {isLoading ? <p role="status" className="text-sm text-muted-foreground">Loading experience...</p> : profile.experience.length === 0 ? (
          <EmptyState title={error ? 'Experience unavailable' : 'No verified experience listed'} description={error || 'Professional roles and contributions will appear here when their details are available.'} />
        ) : (
          <div className="relative space-y-6 before:absolute before:left-4 before:top-0 before:h-full before:w-px before:bg-border md:space-y-8 md:before:left-1/2">
            {profile.experience.map((item) => (
              <div key={`${item.organization}-${item.role}`} className="relative md:grid md:grid-cols-2 md:gap-8">
              <div className="md:col-start-1 md:pr-8 md:text-right">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                  <BriefcaseBusiness className="h-3.5 w-3.5" />
                  {item.period}
                </div>
              </div>

              <div className="ml-10 md:ml-0 md:col-start-2 md:pl-8">
                <div className="absolute left-0 top-2 h-3 w-3 rounded-full border-4 border-background bg-primary md:left-1/2 md:-translate-x-1/2" />
                <Card className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-primary">{item.role}</p>
                        <CardTitle className="mt-1 text-xl">{item.company}</CardTitle>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <div>{item.location}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{item.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech) => (
                        <Badge key={tech}>{tech}</Badge>
                      ))}
                    </div>

                    {item.responsibilities.length || item.achievements.length ? <ul className="space-y-2 text-sm text-muted-foreground">
                      {[...item.responsibilities, ...item.achievements].map((entry) => <li key={entry} className="flex items-start gap-2"><ArrowRight className="mt-0.5 h-3.5 w-3.5 text-primary" /><span>{entry}</span></li>)}
                    </ul> : null}
                  </CardContent>
                </Card>
              </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
