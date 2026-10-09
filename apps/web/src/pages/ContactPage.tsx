import { PageMeta } from '../components/common/PageMeta';
import { EmptyState } from '../components/common/EmptyState';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';

export function ContactPage() {
  const { profile } = usePublicPortfolio();
  const contactLinks = [
    profile.email ? { label: profile.email, href: `mailto:${profile.email}` } : null,
    profile.github ? { label: 'GitHub', href: profile.github } : null,
    profile.linkedin ? { label: 'LinkedIn', href: profile.linkedin } : null,
    ...profile.socials.map((social) => ({ label: social.label ?? social.name ?? 'Social link', href: social.href ?? social.url ?? '' })).filter((social) => social.href)
  ].filter((item): item is { label: string; href: string } => item !== null);
  return (
    <>
      <PageMeta title="Contact" description="Contact information for MD Mahtab Ahmed Mahin is not currently available on this site." />

      <section className="py-8 md:py-12">
        <header className="max-w-4xl border-b border-border pb-9 md:pb-12"><p className="eyebrow">Contact / 10</p><h1 className="section-title mt-4">Start a conversation.</h1><p className="section-copy mt-5">{contactLinks.length ? 'Choose a published channel below.' : 'Contact channels will appear here when the owner chooses to publish them.'}</p></header>

        {contactLinks.length ? <ul className="max-w-3xl divide-y divide-border border-b border-border">{contactLinks.map((item, index) => <li key={item.href} className="grid gap-3 py-5 sm:grid-cols-[3rem_1fr] sm:items-center"><span className="font-mono text-xs text-accent-foreground">{String(index + 1).padStart(2, '0')}</span><a className="inline-flex min-h-10 items-center text-lg text-link" href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noreferrer' : undefined}>{item.label}</a></li>)}</ul> : <div className="max-w-3xl pt-8"><EmptyState title="Contact information unavailable" description="No email address or social contact links have been provided for publication." /></div>}
      </section>
    </>
  );
}
