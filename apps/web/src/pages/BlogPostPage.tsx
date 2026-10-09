import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { PageMeta } from '../components/common/PageMeta';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';

export function BlogPostPage() {
  const { profile } = usePublicPortfolio();
  const { slug } = useParams();
  const post = profile.blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return (
      <section className="py-12 text-center">
        <p className="eyebrow">Article</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">Article not found.</h1>
        <Button asChild className="mt-6">
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to blog
          </Link>
        </Button>
      </section>
    );
  }

  return (
    <>
      <PageMeta title={post.title} description={post.excerpt} />
      <section className="space-y-8 py-8 md:py-12">
        <div className="space-y-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" /> Blog
            </Link>
          </Button>
          <p className="eyebrow">{post.category}</p>
          <h1 className="section-title">{post.title}</h1>
          {post.date || post.readingTime || post.readTime ? (
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {post.date ? <span>{post.date}</span> : null}
              {post.readingTime ?? post.readTime ? <span>{post.readingTime ?? post.readTime}</span> : null}
            </div>
          ) : null}
        </div>

        <Card>
          {post.coverImage ? <img className="max-h-[34rem] w-full object-cover" src={post.coverImage} alt="" /> : null}
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
            <div className="prose max-w-none text-base text-muted-foreground">
              <p>{post.content}</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
