import { ArrowUpRight } from 'lucide-react';

import { PageMeta } from '../components/common/PageMeta';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';

export function ResearchPage() {
  const { profile, isLoading, error } = usePublicPortfolio();
  return (
    <>
      <PageMeta title="Research" description="Research interests of MD Mahtab Ahmed Mahin across machine learning, generative AI, RAG, and AI security." />

      <section className="space-y-8 py-8 md:py-12">
        <div className="space-y-4">
          <p className="eyebrow">Research</p>
          <h1 className="section-title">Research interests</h1>
          <p className="section-copy">Areas of interest include machine learning, generative AI, LLMs, RAG, AI security, and applied AI.</p>
        </div>

        {isLoading ? <p role="status" className="text-sm text-muted-foreground">Loading research...</p> : profile.research.length === 0 ? (
          <EmptyState title={error ? 'Research unavailable' : 'No research publications listed'} description={error || 'Research interests are shown above. Papers or other research outputs will be listed only when verified work is available.'} />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {profile.research.map((item) => (
              <Card key={item.title} className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-[0.66rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {item.topic ?? 'Research'}
                  </span>
                  <Badge>{item.status}</Badge>
                </div>
                <CardTitle className="mt-3 text-xl">{item.title}</CardTitle>
                {item.publicationDate ? <p className="text-xs text-muted-foreground">{item.publicationDate}</p> : null}
              </CardHeader>
              <CardContent className="space-y-4">
                {item.imageUrl ? <img className="max-h-64 rounded-lg border border-border object-contain" src={item.imageUrl} alt={`${item.title} research figure`} /> : null}
                {item.summary ? <p className="text-sm text-muted-foreground">{item.summary}</p> : null}
                {item.methodology ? <section><h3 className="text-sm font-medium text-foreground">Methodology</h3><p className="mt-1 text-sm text-muted-foreground">{item.methodology}</p></section> : null}
                <div className="flex flex-wrap gap-2">
                  {[...new Set([...(item.tags ?? item.topics ?? []), ...item.technologies])].map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
                {item.link ? <Button asChild variant="ghost" size="sm" className="px-0 text-primary"><a href={item.link} target="_blank" rel="noreferrer">View details <ArrowUpRight className="ml-2 h-4 w-4" /></a></Button> : null}
                {item.pdfUrl ? <Button asChild variant="outline" size="sm"><a href={item.pdfUrl} target="_blank" rel="noreferrer">Open paper PDF</a></Button> : null}
                {item.githubUrl ? <Button asChild variant="outline" size="sm"><a href={item.githubUrl} target="_blank" rel="noreferrer">GitHub</a></Button> : null}
              </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
