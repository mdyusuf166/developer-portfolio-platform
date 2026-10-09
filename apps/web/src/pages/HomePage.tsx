import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageMeta } from '../components/common/PageMeta';
import { LoadingState } from '../components/common/LoadingState';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';
import { usePublicProjects } from '../hooks/usePublicProjects';

export function HomePage() {
  const { profile } = usePublicPortfolio();
  const { projects, isLoading, error } = usePublicProjects();
  const featuredProjects = projects.filter((project) => project.featured);
  const selectedProjects = (featuredProjects.length ? featuredProjects : projects).slice(0, 3);

  return (
    <>
      <PageMeta title="Home" description="MD Mahtab Ahmed Mahin, a Computer Science and Engineering undergraduate focused on software and exploring AI/ML." />

      <section className="grid min-w-0 items-start gap-12 py-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-16 md:py-14" aria-labelledby="home-heading">
        <div className="relative min-w-0">
          <p className="eyebrow mb-7 flex items-center gap-3"><span className="h-px w-9 bg-accent" /> {profile.title}</p>
          {profile.profileImageUrl ? <img className="mb-7 h-24 w-24 max-w-full rounded-full object-cover ring-4 ring-muted" width={96} height={96} src={profile.profileImageUrl} alt={`Portrait of ${profile.name}`} /> : null}
          <h1 id="home-heading" className="max-w-3xl break-words font-display text-[clamp(2.05rem,8vw,5.5rem)] font-medium leading-[1.08] tracking-[-0.045em] text-foreground">{profile.name}</h1>
          <p className="mt-7 max-w-2xl text-xl leading-8 text-muted-foreground md:text-2xl md:leading-9">{profile.headline}</p>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">{profile.shortBio}</p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link to="/projects" className="inline-flex min-h-12 items-center gap-3 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">Explore selected work <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            <Link to="/resume" className="inline-flex min-h-12 items-center gap-2 border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary">View CV</Link>
            <Link to="/about" className="inline-flex min-h-12 items-center gap-2 border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary">A little about me <ArrowDownRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
          {profile.socials.some((social) => social.href ?? social.url) ? (
            <nav aria-label="Social links" className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              {profile.socials.filter((social) => Boolean(social.href ?? social.url)).map((social) => {
                const href = social.href ?? social.url ?? '';
                return <a key={social.label ?? social.name} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined} className="inline-flex min-h-9 items-center gap-1 text-link">{social.label ?? social.name ?? 'Link'}{href.startsWith('http') ? <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /> : null}</a>;
              })}
            </nav>
          ) : null}
        </div>

        <aside className="relative min-w-0 border-l border-border pl-4 sm:pl-6 md:ml-4 md:pl-9" aria-labelledby="current-focus-heading">
          <span className="absolute -left-px top-0 h-14 w-px bg-accent" aria-hidden="true" />
          <p className="eyebrow">A working direction</p>
          <h2 id="current-focus-heading" className="mt-4 font-display text-3xl font-medium leading-tight text-foreground">Questions at the intersection of learning systems and useful software.</h2>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">{profile.about}</p>
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {profile.researchInterests.map((interest, index) => <li key={interest.title} className="flex min-w-0 items-start gap-4 py-3.5"><span className="font-mono text-xs text-accent-foreground">{String(index + 1).padStart(2, '0')}</span><span className="min-w-0 break-words text-sm font-medium text-foreground">{interest.title}</span></li>)}
          </ul>
          <Link to="/research" className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm text-link">Explore research interests <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </aside>
      </section>

      <section className="editorial-rule py-12 md:py-16" aria-labelledby="selected-work-heading">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div><p className="eyebrow">01 / Selected work</p><h2 id="selected-work-heading" className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">AI / ML project showcase</h2></div>
          <Link to="/projects" className="inline-flex min-h-11 items-center gap-2 text-sm text-link">View all projects <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        {isLoading ? <LoadingState message="Loading published projects..." /> : selectedProjects.length ? (
          <div className="divide-y divide-border border-y border-border">
            {selectedProjects.map((project, index) => (
              <article key={project.slug} className="grid gap-4 py-6 md:grid-cols-[4rem_minmax(0,1fr)_auto] md:items-start md:gap-7 md:py-8">
                <span className="font-mono text-sm text-accent-foreground">0{index + 1}</span>
                <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(10rem,0.55fr)] sm:items-start">
                  <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{project.category}</p><h3 className="mt-2 font-display text-2xl font-medium text-foreground">{project.title}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{project.shortDescription}</p></div>
                  {project.image ? <img className="aspect-[16/10] w-full object-cover" src={project.image.src} alt={project.image.alt} loading="lazy" /> : null}
                </div>
                <Link className="inline-flex min-h-11 items-center gap-2 text-sm text-link md:mt-5" to={`/projects/${project.slug}`}>Case study <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
        ) : (
          <div role="status" className="grid gap-5 border-y border-border bg-card/50 px-5 py-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-7">
            <div><p className="font-display text-xl font-medium text-foreground">{error ? 'The project feed is unavailable right now.' : 'No projects have been published yet.'}</p><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Published case studies will appear here when there is work ready to share, with the details and evidence attached.</p></div>
            <Link to="/projects" className="inline-flex min-h-11 items-center gap-2 text-sm text-link">Visit projects <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        )}
      </section>

      <section className="grid gap-8 border-t border-border py-12 md:grid-cols-[0.7fr_1.3fr] md:py-16" aria-labelledby="next-heading">
        <div><p className="eyebrow">02 / Beyond the build</p><h2 id="next-heading" className="mt-3 font-display text-3xl font-medium">A few threads I keep following.</h2></div>
        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {profile.researchInterests.slice(0, 4).map((interest) => <div key={interest.title} className="border-t border-border pt-4"><span className="text-sm font-medium text-foreground">{interest.title}</span><p className="mt-2 text-sm leading-6 text-muted-foreground">{interest.description}</p></div>)}
        </div>
      </section>

      <section className="flex flex-col gap-6 bg-primary px-6 py-8 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:px-9 sm:py-10" aria-labelledby="contact-heading">
        <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/75">03 / Get in touch</p><h2 id="contact-heading" className="mt-2 font-display text-3xl font-medium sm:text-4xl">Have a thoughtful problem in mind?</h2></div>
        <Link to="/contact" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 border border-primary-foreground/40 px-5 py-3 text-sm font-semibold transition-colors hover:bg-primary-foreground hover:text-primary">Start a conversation <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
      </section>
    </>
  );
}
