import { PageMeta } from '../components/common/PageMeta';
import { skillAreas, skills } from '../data/skills';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';
import type { SkillEvidence } from '../types';

const evidenceLabel: Record<SkillEvidence, string> = {
  cv: 'CV',
  portfolio: 'This site'
};

const bandLabel = {
  skill: 'Verified technology',
  academic: 'Academic context',
  learning: 'Learning topic'
} as const;

export function SkillsPage() {
  const { profile } = usePublicPortfolio();

  return (
    <>
      <PageMeta title="Skills" description="CV-listed and portfolio-demonstrated skills, kept separate from learning topics and research interests." />

      <section className="py-8 md:py-12">
        <header className="max-w-4xl border-b border-border pb-9 md:pb-12">
          <p className="eyebrow">Skills / 04</p>
          <h1 className="section-title mt-4">A careful account of what I can show.</h1>
          <p className="section-copy mt-5">Technologies appear only when the supplied CV names them or this portfolio uses them. Learning topics and research interests are listed separately. None of these labels is a proficiency rating, a count of years, or a certification.</p>
        </header>

        <ul className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3" aria-label="How to read this page">
          <li className="min-w-0 border-t border-border pt-3"><span className="font-semibold text-foreground">CV</span> — named in the supplied CV</li>
          <li className="min-w-0 border-t border-border pt-3"><span className="font-semibold text-foreground">This site</span> — used while building this portfolio</li>
          <li className="min-w-0 border-t border-border pt-3"><span className="font-semibold text-foreground">Learning topic</span> — a study direction, not a skill</li>
        </ul>

        <div className="mt-4 divide-y divide-border border-b border-border">
          {skillAreas.map((area, index) => {
            const areaSkills = skills.filter((skill) => skill.category === area.title);
            const interests = profile.researchInterests.filter((interest) => interest.area === area.title);
            const headingId = `skill-area-${index + 1}`;

            return (
              <section key={area.title} className="grid min-w-0 gap-5 py-7 sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] sm:gap-8 md:py-9" aria-labelledby={headingId}>
                <div className="flex min-w-0 items-start gap-4">
                  <span className="font-mono text-xs text-accent-foreground">{String(index + 1).padStart(2, '0')}</span>
                  <div className="min-w-0">
                    <h2 id={headingId} className="break-words font-display text-2xl font-medium leading-tight">{area.title}</h2>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary">{bandLabel[area.band]}</p>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{area.summary}</p>
                  {areaSkills.length ? (
                    <ul className="mt-4 flex min-w-0 flex-wrap gap-2" aria-label={`${area.title} technologies`}>
                      {areaSkills.map((skill) => (
                        <li key={skill.name} className="max-w-full break-words border border-border bg-card px-3 py-2 text-sm text-foreground">
                          <span>{skill.name}</span>
                          {skill.evidence ? <span className="ml-2 text-xs font-medium text-muted-foreground">{evidenceLabel[skill.evidence]}</span> : null}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {interests.length ? (
                    <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                      {interests.map((interest) => (
                        <li key={interest.title} className="min-w-0 border-t border-border pt-4">
                          <h3 className="break-words text-base font-medium">{interest.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">{interest.description}</p>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </>
  );
}
