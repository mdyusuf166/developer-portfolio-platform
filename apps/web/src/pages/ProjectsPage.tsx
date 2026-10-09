import { useState } from 'react';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageMeta } from '../components/common/PageMeta';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/ui/button';
import { usePublicProjects } from '../hooks/usePublicProjects';
import { LoadingState } from '../components/common/LoadingState';
import type { ProjectCategory } from '../types';

export function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'All'>('All');
  const { projects, isLoading, error } = usePublicProjects();
  const categories = [...new Set(projects.map((project) => project.category))].sort((left, right) => left.localeCompare(right));
  const visibleProjects = selectedCategory === 'All' ? projects : projects.filter((project) => project.category === selectedCategory);

  return (
    <>
      <PageMeta title="Projects" description="Engineering project case studies by MD Mahtab Ahmed Mahin." />
      <section className="py-8 md:py-12" aria-labelledby="projects-heading">
        <div className="grid gap-7 border-b border-border pb-9 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.6fr)] md:items-end md:pb-12">
          <div><p className="eyebrow">Selected work / 01</p><h1 id="projects-heading" className="section-title mt-4">AI / ML Projects</h1></div>
          <p className="section-copy">Projects &amp; case studies: a record of things built, the questions behind them, and the decisions made along the way. Only published work appears here.</p>
        </div>

        {isLoading ? <LoadingState message="Loading published projects..." /> : projects.length === 0 ? (
          <div className="pt-9"><EmptyState title={error ? 'Project feed unavailable' : 'No published projects yet'} description={error || 'Published project case studies will appear here when added by an administrator.'} /></div>
        ) : (
          <>
            {categories.length > 1 ? <div className="flex flex-wrap gap-2 py-6" role="group" aria-label="Filter projects by category">
              {(['All', ...categories] as const).map((category) => <button key={category} type="button" aria-pressed={selectedCategory === category} onClick={() => setSelectedCategory(category)} className={`min-h-10 border px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${selectedCategory === category ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'}`}>{category}</button>)}
            </div> : null}
            <div className="divide-y divide-border border-b border-border">
              {visibleProjects.map((project, index) => (
                <article key={project.slug} className="grid min-w-0 gap-5 py-7 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,0.8fr)] md:gap-8 md:py-9">
                  <span className="font-mono text-sm text-accent-foreground">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary"><span>{project.category}</span>{project.status ? <><span aria-hidden="true">/</span><span className="text-muted-foreground">{project.status}</span></> : null}</div>
                    <h2 className="mt-3 font-display text-3xl font-medium leading-tight text-foreground">{project.title}</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{project.shortDescription}</p>
                    {project.technologies?.length ? <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2" aria-label={`${project.title} technologies`}>{project.technologies.map((technology) => <li key={technology} className="text-xs text-muted-foreground">{technology}</li>)}</ul> : null}
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <Link to={`/projects/${project.slug}`} className="inline-flex min-h-11 items-center gap-2 pr-3 text-sm font-semibold text-primary hover:underline">Read case study <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                      {project.githubUrl ? <Button asChild variant="outline" size="sm"><a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`GitHub repository for ${project.title}`}><Github className="mr-2 h-4 w-4" aria-hidden="true" /> GitHub</a></Button> : null}
                      {project.demoUrl ? <Button asChild variant="outline" size="sm"><a href={project.demoUrl} target="_blank" rel="noreferrer" aria-label={`Demo for ${project.title}`}><ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" /> Demo</a></Button> : null}
                    </div>
                  </div>
                  {project.image ? <figure className="md:pt-1"><img className="aspect-[16/10] w-full border border-border object-cover" src={project.image.src} alt={project.image.alt} loading="lazy" />{project.image.caption ? <figcaption className="mt-2 text-xs text-muted-foreground">{project.image.caption}</figcaption> : null}</figure> : <div className="hidden items-center justify-center border-y border-border bg-muted/40 md:flex" aria-hidden="true"><span className="font-display text-5xl text-primary/25">{String(index + 1).padStart(2, '0')}</span></div>}
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
