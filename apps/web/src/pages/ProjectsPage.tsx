import { useState } from 'react';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageMeta } from '../components/common/PageMeta';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import type { ProjectCategory } from '../types';
import { usePublicProjects } from '../hooks/usePublicProjects';
import { LoadingState } from '../components/common/LoadingState';

export function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'All'>('All');
  const { projects: publishedProjects, isLoading, error } = usePublicProjects();
  const categories = [...new Set(publishedProjects.map((project) => project.category))].sort((left, right) => left.localeCompare(right));
  const visibleProjects = selectedCategory === 'All' ? publishedProjects : publishedProjects.filter((project) => project.category === selectedCategory);

  return (
    <>
      <PageMeta title="AI/ML Projects" description="AI and machine learning project case studies by MD Mahtab Ahmed Mahin." />

      <section className="space-y-8 py-8 md:py-12">
        <div className="space-y-4">
          <p className="eyebrow">Selected work</p>
          <h1 className="section-title">AI / ML Projects</h1>
          <p className="section-copy">Each published case study will describe its problem, approach, implementation, and supporting evidence.</p>
        </div>

        {isLoading ? <LoadingState message="Loading published projects..." /> : publishedProjects.length === 0 ? (
          <EmptyState title={error ? 'Project feed unavailable' : 'No published projects yet'} description={error || 'Published project case studies will appear here when added by an administrator.'} />
        ) : (
          <>
            {categories.length > 1 ? (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
                <button
                  type="button"
                  aria-pressed={selectedCategory === 'All'}
                  onClick={() => setSelectedCategory('All')}
                  className={`rounded-lg border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${selectedCategory === 'All' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-foreground hover:bg-muted'}`}
                >All</button>
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={selectedCategory === category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-lg border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${selectedCategory === category ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-foreground hover:bg-muted'}`}
                  >{category}</button>
                ))}
              </div>
            ) : null}

            <div className="grid gap-5 md:grid-cols-2">
              {visibleProjects.map((project) => (
                <Card key={project.slug} className="overflow-hidden">
                  {project.image ? <img className="aspect-[16/9] w-full object-cover" src={project.image.src} alt={project.image.alt} loading="lazy" /> : null}
                  <CardHeader>
                    <div className="flex flex-wrap gap-2">
                      <Badge>{project.category}</Badge>
                      {project.status ? <Badge variant="secondary">{project.status}</Badge> : null}
                    </div>
                    <CardTitle className="pt-2 text-xl">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-6 text-muted-foreground">{project.shortDescription}</p>
                    {project.technologies?.length ? <div className="flex flex-wrap gap-2">{project.technologies.map((technology) => <Badge key={technology} variant="secondary">{technology}</Badge>)}</div> : null}
                    <div className="flex flex-wrap items-center gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link to={`/projects/${project.slug}`} aria-label={`Read ${project.title} case study`}>
                          Case study <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      {project.githubUrl ? <Button asChild variant="outline" size="sm"><a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`GitHub repository for ${project.title}`}><Github className="mr-2 h-4 w-4" /> GitHub</a></Button> : null}
                      {project.demoUrl ? <Button asChild variant="outline" size="sm"><a href={project.demoUrl} target="_blank" rel="noreferrer" aria-label={`Demo for ${project.title}`}><ExternalLink className="mr-2 h-4 w-4" /> Demo</a></Button> : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
