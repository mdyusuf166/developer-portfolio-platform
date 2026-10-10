import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageMeta } from '../components/common/PageMeta';
import { EmptyState } from '../components/common/EmptyState';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';

export function BlogPage() {
  const { profile, isLoading, error } = usePublicPortfolio();
  return (
    <>
      <PageMeta title="Blog" description="Technical writing by MD Mahtab Ahmed Mahin. No articles are currently published." />

      <section className="py-8 md:py-12">
        <header className="max-w-4xl border-b border-border pb-9 md:pb-12"><p className="eyebrow">Notes / 08</p><h1 className="section-title mt-4">Technical writing</h1><p className="section-copy mt-5">Ideas, experiments, and working notes will live here when they are ready to publish.</p></header>

        {isLoading ? <p role="status" className="text-sm text-muted-foreground">Loading articles...</p> : profile.blogPosts.length === 0 ? (
          <EmptyState title={error ? 'Articles unavailable' : 'No articles published'} description={error || 'Technical writing will be added when articles are ready to share.'} />
        ) : (
          <div className="divide-y divide-border border-b border-border">
            {profile.blogPosts.map((post, index) => (
              <article key={post.slug} className="grid min-w-0 gap-5 py-7 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,0.5fr)] md:gap-8 md:py-9">
                <span className="font-mono text-sm text-accent-foreground">{String(index + 1).padStart(2, '0')}</span>
                <div><p className="eyebrow">{post.category}{post.date ? ` · ${post.date}` : ''}</p><h2 className="mt-2 font-display text-2xl font-medium"><Link to={`/blog/${post.slug}`} className="hover:text-primary">{post.title}</Link></h2><p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{post.excerpt}</p><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">{post.tags.map((tag) => <span key={tag} className="text-xs text-muted-foreground">{tag}</span>)}</div><Link to={`/blog/${post.slug}`} className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm text-link">Read article <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
                {post.coverImage ? <img className="aspect-[4/3] w-full border border-border object-cover" src={post.coverImage} alt={`Cover image for ${post.title}`} loading="lazy" /> : <p className="text-xs text-muted-foreground">{post.readingTime ?? post.readTime ?? ''}</p>}
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
