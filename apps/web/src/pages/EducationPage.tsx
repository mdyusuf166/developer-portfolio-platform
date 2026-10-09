import { GraduationCap } from 'lucide-react';

import { PageMeta } from '../components/common/PageMeta';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';

export function EducationPage() {
  const { profile, isLoading, error } = usePublicPortfolio();
  return (
    <>
      <PageMeta title="Education" description="Educational background and relevant learning focus." />

      <section className="space-y-8 py-8 md:py-12">
        <div className="space-y-4">
          <p className="eyebrow">Education</p>
          <h1 className="section-title">Education</h1>
        </div>

        {isLoading ? <p role="status" className="text-sm text-muted-foreground">Loading education...</p> : profile.education.length === 0 ? (
          <EmptyState title={error ? 'Education unavailable' : 'No verified education details listed'} description={error || 'Education information will be added when the owner provides confirmed details.'} />
        ) : (
          <div className="grid gap-6">
            {profile.education.map((item) => (
              <Card key={`${item.university}-${item.degree}`} className="overflow-hidden">
              <CardHeader className="border-b border-border/80 bg-gradient-to-r from-primary/5 via-transparent to-transparent">
                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                      <GraduationCap className="h-4 w-4" />
                      {item.department ?? item.school ?? 'Academic Program'}
                    </div>
                    <CardTitle className="text-2xl">{item.degree}</CardTitle>
                    <p className="text-muted-foreground">{item.school ?? item.university}</p>
                  </div>
                  <div className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                    {item.period}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex flex-wrap gap-2">
                  {(item.coursework ?? item.relevantCoursework ?? []).map((course) => (
                    <Badge key={course}>{course}</Badge>
                  ))}
                </div>
              </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
