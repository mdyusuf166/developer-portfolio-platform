import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, FlaskConical, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

import { usePublicProjects } from '../hooks/usePublicProjects';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { PageMeta } from '../components/common/PageMeta';
import { LoadingState } from '../components/common/LoadingState';

export function HomePage() {
  const { projects, isLoading, error } = usePublicProjects();
  const { profile } = usePublicPortfolio();
  const featuredProjects = projects.filter((project) => project.featured);
  const selectedProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 3);

  return (
    <>
      <PageMeta title="Home" description="MD Mahtab Ahmed Mahin, AI / ML Engineer focused on machine learning, generative AI, and software engineering." />

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="grid min-h-[70vh] items-center gap-10 py-10 md:grid-cols-[1.25fr_0.75fr] md:py-16"
      >
        <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.08 }}>
          <Badge className="mb-5 border-primary/20 bg-primary/5 text-primary">{profile.title}</Badge>
          {profile.profileImageUrl ? <img className="mb-5 h-20 w-20 rounded-full border border-border object-cover" src={profile.profileImageUrl} alt={profile.name} /> : null}
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-3 text-lg font-medium text-primary md:text-xl">{profile.title}</p>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground md:text-xl">{profile.headline}</p>
          <p className="mt-4 max-w-xl text-base text-muted-foreground">{profile.bio}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <Link to="/projects">Explore projects <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/research">Explore research interests <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {profile.socials.filter((social) => Boolean(social.href ?? social.url)).map((social) => {
              const label = social.label ?? social.name ?? 'Link';
              const href = social.href ?? social.url ?? '';

              return (
                <a
                  key={label}
                  href={href}
                  className="inline-flex items-center gap-2 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  {label}
                </a>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.12 }} className="relative">
          <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-glow md:p-8">
            <div className="flex items-center gap-3">
              <BrainCircuit className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-foreground">Technical focus</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{profile.bio}</p>
            <ul className="mt-6 space-y-3">
              {profile.researchInterests.map((interest, index) => {
                const Icon = [BrainCircuit, Search, FlaskConical, Search][index % 4];
                return (
                  <li key={interest} className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground">
                    <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {interest}
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="text-sm font-medium text-primary underline-offset-4 hover:underline" to="/about">About</Link>
              <Link className="text-sm font-medium text-primary underline-offset-4 hover:underline" to="/skills">Skills</Link>
              <Link className="text-sm font-medium text-primary underline-offset-4 hover:underline" to="/research">Research</Link>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <section className="space-y-5 border-t border-border py-10 md:py-12" aria-labelledby="selected-projects-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="eyebrow">Selected Projects</p>
            <h2 id="selected-projects-heading" className="text-2xl font-semibold tracking-tight text-foreground">AI / ML project showcase</h2>
          </div>
          <Button asChild variant="outline"><Link to="/projects">View all projects <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
        {isLoading ? <LoadingState message="Loading published projects..." /> : selectedProjects.length === 0 ? (
          <Card role="status">
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{error ? 'The project feed is temporarily unavailable.' : 'No projects have been published yet.'}</p>
              <Link className="shrink-0 text-sm font-medium text-primary underline-offset-4 hover:underline" to="/projects">Explore projects</Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {selectedProjects.map((project) => (
              <Card key={project.slug}>
                <CardContent className="space-y-3 p-5">
                  <p className="text-xs font-medium uppercase text-muted-foreground">{project.category}</p>
                  <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{project.shortDescription}</p>
                  <Link className="inline-flex items-center text-sm font-medium text-primary underline-offset-4 hover:underline" to={`/projects/${project.slug}`}>
                    Case study <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
