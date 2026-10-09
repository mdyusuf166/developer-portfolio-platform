import { ArrowLeft, ArrowUpRight, Github } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { PageMeta } from '../components/common/PageMeta';
import { Button } from '../components/ui/button';
import { usePublicProject } from '../hooks/usePublicProject';
import { LoadingState } from '../components/common/LoadingState';

export function ProjectDetailPage() {
  const { slug } = useParams();
  const { project, isLoading, error, notFound } = usePublicProject(slug);

  if (isLoading) return <LoadingState message="Loading project..." />;
  if (!project) return <>
    <PageMeta title={notFound ? 'Project not found' : 'Project unavailable'} description={error || 'No published project exists at this address.'} robots="noindex, follow" />
    <section className="flex min-h-[50vh] flex-col items-start justify-center py-12"><p className="eyebrow">Project archive</p><h1 className="mt-4 font-display text-4xl font-medium">{notFound ? 'Project not found.' : 'Project unavailable.'}</h1><Button asChild variant="outline" className="mt-7"><Link to="/projects"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Back to projects</Link></Button></section>
  </>;

  const sections = [
    { title: 'The problem', content: project.problem },
    { title: 'Approach', content: project.approach },
    { title: 'Implementation', content: project.implementation }
  ].filter((section): section is { title: string; content: string } => Boolean(section.content));
  const lists = [
    { title: 'Architecture', items: project.architecture },
    { title: 'Results', items: project.results },
    { title: 'Engineering challenges', items: project.technicalChallenges },
    { title: 'What I learned', items: project.learnings }
  ].filter((section) => section.items?.length);

  return <>
    <PageMeta title={project.title} description={project.shortDescription} />
    <article className="py-5 md:py-10">
      <Link to="/projects" className="inline-flex min-h-11 items-center gap-2 text-sm text-link"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> All projects</Link>
      <header className="grid gap-8 border-b border-border py-8 md:grid-cols-[minmax(0,1fr)_minmax(15rem,0.55fr)] md:items-end md:py-12">
        <div><p className="eyebrow">Case study / {project.category}</p><h1 className="section-title mt-4">{project.title}</h1><p className="section-copy mt-5">{project.shortDescription}</p></div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          {project.githubUrl ? <Button asChild><a href={project.githubUrl} target="_blank" rel="noreferrer"><Github className="mr-2 h-4 w-4" aria-hidden="true" /> Source code</a></Button> : null}
          {project.demoUrl ? <Button asChild variant="outline"><a href={project.demoUrl} target="_blank" rel="noreferrer">Live demo <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" /></a></Button> : null}
        </div>
      </header>
      {project.image ? <figure className="py-8 md:py-10"><img className="max-h-[42rem] w-full border border-border object-cover" src={project.image.src} alt={project.image.alt} />{project.image.caption ? <figcaption className="mt-3 text-sm text-muted-foreground">{project.image.caption}</figcaption> : null}</figure> : null}
      <div className="grid gap-12 py-8 md:grid-cols-[minmax(0,1fr)_15rem] md:gap-16 md:py-10">
        <div className="space-y-10">
          <section><p className="eyebrow">Overview</p><h2 className="mt-2 font-display text-2xl font-medium">What this work is</h2><p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">{project.description || project.shortDescription}</p></section>
          {sections.map((section) => <section key={section.title} className="border-t border-border pt-7"><h2 className="font-display text-2xl font-medium">{section.title}</h2><p className="mt-3 max-w-3xl text-base leading-8 text-muted-foreground">{section.content}</p></section>)}
          {lists.map((section) => <section key={section.title} className="border-t border-border pt-7"><h2 className="font-display text-2xl font-medium">{section.title}</h2><ul className="mt-4 max-w-3xl space-y-3">{section.items?.map((item) => <li key={item} className="flex gap-3 text-sm leading-7 text-muted-foreground"><span className="mt-3 h-1.5 w-1.5 shrink-0 bg-accent" aria-hidden="true" />{item}</li>)}</ul></section>)}
        </div>
        {project.technologies?.length ? <aside className="h-fit border-t border-primary pt-5 md:sticky md:top-28"><h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Built with</h2><ul className="mt-4 divide-y divide-border">{project.technologies.map((technology) => <li key={technology} className="py-2.5 text-sm text-foreground">{technology}</li>)}</ul></aside> : null}
      </div>
    </article>
  </>;
}
