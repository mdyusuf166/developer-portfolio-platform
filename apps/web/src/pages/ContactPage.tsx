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

      <section className="space-y-8 py-8 md:py-12">
        <div className="space-y-4">
          <p className="eyebrow">Contact</p>
          <h1 className="section-title">Contact</h1>
          <p className="section-copy">{contactLinks.length ? 'Available contact channels:' : 'A direct contact channel is not currently available on this site.'}</p>
        </div>

        {contactLinks.length ? <ul className="space-y-3">{contactLinks.map((item) => <li key={item.href}><a className="text-primary underline-offset-4 hover:underline" href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noreferrer' : undefined}>{item.label}</a></li>)}</ul> : <EmptyState title="Contact information unavailable" description="No email address or social contact links have been provided for publication." />}
      </section>
    </>
  );
}
