import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { PageMeta } from '../components/common/PageMeta';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { usePublicProject } from '../hooks/usePublicProject';
import { LoadingState } from '../components/common/LoadingState';

export function ProjectDetailPage() {
  const { slug } = useParams();
  const { project, isLoading, error, notFound } = usePublicProject(slug);

  if (isLoading) {
    return <LoadingState message="Loading project..." />;
  }

  if (!project) {
    return (
      <>
        <PageMeta title={notFound ? 'Project not found' : 'Project unavailable'} description={error || 'No published project exists at this address.'} robots="noindex, follow" />
        <section className="py-12 text-center">
          <p className="eyebrow">Project</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">{notFound ? 'Project not found.' : 'Project unavailable.'}</h1>
          <Button asChild className="mt-6">
            <Link to="/projects"><ArrowLeft className="mr-2 h-4 w-4" /> Back to projects</Link>
          </Button>
        </section>
      </>
    );
  }

  return (
    <>
      <PageMeta title={project.title} description={project.shortDescription} />
      <section className="space-y-8 py-8 md:py-12">
        <div className="space-y-4">
          <Button asChild variant="ghost" size="sm" className="mb-2">
            <Link to="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" /> Projects
            </Link>
          </Button>
          <p className="eyebrow">Project case study</p>
          <h1 className="section-title">{project.title}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge>{project.category}</Badge>
            {project.status ? <Badge variant="secondary">{project.status}</Badge> : null}
          </div>
        </div>

        <Card>
          <CardContent className="space-y-7 p-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground">Project overview</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{project.description || project.shortDescription}</p>
            </section>
            {project.image ? <figure><img className="max-h-[34rem] w-full rounded-xl border border-border object-cover" src={project.image.src} alt={project.image.alt} />{project.image.caption ? <figcaption className="mt-2 text-sm text-muted-foreground">{project.image.caption}</figcaption> : null}</figure> : null}
            {project.problem ? <section><h2 className="text-lg font-semibold text-foreground">Problem</h2><p className="mt-2 text-sm text-muted-foreground">{project.problem}</p></section> : null}
            {project.approach ? <section><h2 className="text-lg font-semibold text-foreground">Approach</h2><p className="mt-2 text-sm text-muted-foreground">{project.approach}</p></section> : null}
            {project.architecture?.length ? <section><h2 className="text-lg font-semibold text-foreground">Architecture</h2><ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">{project.architecture.map((item) => <li key={item}>{item}</li>)}</ul></section> : null}
            {project.technologies?.length ? (
              <section>
                <h2 className="text-lg font-semibold text-foreground">Technologies</h2>
                <div className="mt-3 flex flex-wrap gap-2">{project.technologies.map((tech) => <Badge key={tech}>{tech}</Badge>)}</div>
              </section>
            ) : null}
            {project.implementation ? <section><h2 className="text-lg font-semibold text-foreground">Implementation</h2><p className="mt-2 text-sm text-muted-foreground">{project.implementation}</p></section> : null}
            {project.results?.length ? <section><h2 className="text-lg font-semibold text-foreground">Results</h2><ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">{project.results.map((item) => <li key={item}>{item}</li>)}</ul></section> : null}
            {project.technicalChallenges?.length ? <section><h2 className="text-lg font-semibold text-foreground">Technical challenges</h2><ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">{project.technicalChallenges.map((item) => <li key={item}>{item}</li>)}</ul></section> : null}
            {project.learnings?.length ? <section><h2 className="text-lg font-semibold text-foreground">Learnings</h2><ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">{project.learnings.map((item) => <li key={item}>{item}</li>)}</ul></section> : null}
            {project.githubUrl || project.demoUrl ? <section className="space-y-3"><h2 className="text-lg font-semibold text-foreground">Links</h2><div className="flex flex-wrap gap-3">
              {project.githubUrl ? <Button asChild size="sm"><a href={project.githubUrl} target="_blank" rel="noreferrer"><Github className="mr-2 h-4 w-4" /> GitHub</a></Button> : null}
              {project.demoUrl ? <Button asChild variant="outline" size="sm"><a href={project.demoUrl} target="_blank" rel="noreferrer"><ExternalLink className="mr-2 h-4 w-4" /> Demo</a></Button> : null}
            </div></section> : null}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
