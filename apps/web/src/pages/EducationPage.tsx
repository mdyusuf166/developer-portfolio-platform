import { GraduationCap } from 'lucide-react';

import { PageMeta } from '../components/common/PageMeta';
import { EmptyState } from '../components/common/EmptyState';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';

export function EducationPage() {
  const { profile, isLoading, error } = usePublicPortfolio();
  return (
    <>
      <PageMeta title="Education" description="Educational background and relevant learning focus." />

      <section className="py-8 md:py-12">
        <header className="max-w-4xl border-b border-border pb-9 md:pb-12"><p className="eyebrow">Education / 06</p><h1 className="section-title mt-4">Education</h1><p className="section-copy mt-5">Academic details appear here when supplied and confirmed.</p></header>

        {isLoading ? <p role="status" className="text-sm text-muted-foreground">Loading education...</p> : profile.education.length === 0 ? (
          <EmptyState title={error ? 'Education unavailable' : 'No verified education details listed'} description={error || 'Education information will be added when the owner provides confirmed details.'} />
        ) : (
          <div className="divide-y divide-border border-b border-border">
            {profile.education.map((item, index) => (
              <article key={`${item.university}-${item.degree}`} className="grid min-w-0 gap-5 py-8 sm:grid-cols-[3rem_minmax(0,1fr)_minmax(0,auto)] sm:items-start sm:gap-8 md:py-10">
                <span className="font-mono text-sm text-accent-foreground">{String(index + 1).padStart(2, '0')}</span>
                <div><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary"><GraduationCap className="h-4 w-4" aria-hidden="true" />{item.department ?? item.school ?? 'Academic program'}</p><h2 className="mt-3 font-display text-2xl font-medium">{item.degree}</h2><p className="mt-2 text-sm text-muted-foreground">{item.school ?? item.university}</p>{(item.coursework ?? item.relevantCoursework ?? []).length ? <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">{(item.coursework ?? item.relevantCoursework ?? []).map((course) => <li key={course} className="text-xs text-muted-foreground">{course}</li>)}</ul> : null}</div>
                <span className="text-sm text-muted-foreground">{item.period}</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
