import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageMeta } from '../components/common/PageMeta';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';

export function BlogPage() {
  const { profile, isLoading, error } = usePublicPortfolio();
  return (
    <>
      <PageMeta title="Blog" description="Technical writing by MD Mahtab Ahmed Mahin. No articles are currently published." />

      <section className="space-y-8 py-8 md:py-12">
        <div className="space-y-4">
          <p className="eyebrow">Blog</p>
          <h1 className="section-title">Technical writing</h1>
        </div>

        {isLoading ? <p role="status" className="text-sm text-muted-foreground">Loading articles...</p> : profile.blogPosts.length === 0 ? (
          <EmptyState title={error ? 'Articles unavailable' : 'No articles published'} description={error || 'Technical writing will be added when articles are ready to share.'} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {profile.blogPosts.map((post) => (
              <Card key={post.slug} className="h-full overflow-hidden">
              {post.coverImage ? <img className="aspect-[16/9] w-full object-cover" src={post.coverImage} alt="" loading="lazy" /> : null}
              <div className="flex items-center justify-between gap-3 border-b border-border bg-muted px-5 py-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <span>{post.category}</span>
                {post.date ? <span>{post.date}</span> : null}
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.readingTime ?? post.readTime ?? '5 min read'}</span>
                  <Button asChild variant="ghost" size="sm" className="px-0 text-primary">
                    <Link to={`/blog/${post.slug}`}>
                      Read article <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
