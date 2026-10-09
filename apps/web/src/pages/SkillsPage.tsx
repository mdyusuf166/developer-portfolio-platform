import { PageMeta } from '../components/common/PageMeta';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';

export function SkillsPage() {
  const { profile } = usePublicPortfolio();
  return (
    <>
      <PageMeta title="Skills" description="Areas of focus across machine learning, generative AI, software engineering, cybersecurity, and research." />

      <section className="py-8 md:py-12">
        <header className="max-w-4xl border-b border-border pb-9 md:pb-12"><p className="eyebrow">Skills / 04</p><h1 className="section-title mt-4">Tools I work with, and fields I&apos;m exploring.</h1><p className="section-copy mt-5">These groupings describe current focus and interests, not a claim of mastery or professional experience.</p></header>
        <div className="divide-y divide-border border-b border-border">
          {profile.skills.map((group, index) => (
            <section key={group.category} className="grid gap-4 py-7 sm:grid-cols-[minmax(12rem,0.6fr)_1.4fr] sm:gap-8 md:py-9">
              <div className="flex items-start gap-4"><span className="font-mono text-xs text-accent">0{index + 1}</span><h2 className="font-display text-2xl font-medium">{group.category}</h2></div>
              <ul className="flex flex-wrap gap-x-2 gap-y-2">{group.items.map((skill) => <li key={skill} className="border border-border bg-card px-3 py-2 text-sm text-foreground">{skill}</li>)}</ul>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
