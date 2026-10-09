import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { PageMeta } from '../components/common/PageMeta';
import { usePublicPortfolio } from '../hooks/usePublicPortfolio';

export function BlogPostPage() {
  const { profile } = usePublicPortfolio();
  const { slug } = useParams();
  const post = profile.blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return (
      <section className="flex min-h-[45vh] flex-col items-start justify-center py-12">
        <p className="eyebrow">Article</p>
        <h1 className="mt-4 font-display text-4xl font-medium">Article not found.</h1>
        <Link className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm text-link" to="/blog"><ArrowLeft className="h-4 w-4" /> Back to blog</Link>
      </section>
    );
  }

  return (
    <>
      <PageMeta title={post.title} description={post.excerpt} />
      <article className="mx-auto max-w-4xl py-8 md:py-12">
        <Link className="inline-flex min-h-11 items-center gap-2 text-sm text-link" to="/blog"><ArrowLeft className="h-4 w-4" /> All writing</Link>
        <header className="border-b border-border py-8 md:py-10">
          <p className="eyebrow">{post.category}</p>
          <h1 className="section-title mt-4">{post.title}</h1>
          {post.date || post.readingTime || post.readTime ? (
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {post.date ? <span>{post.date}</span> : null}
              {post.readingTime ?? post.readTime ? <span>{post.readingTime ?? post.readTime}</span> : null}
            </div>
          ) : null}
        </header>
        {post.coverImage ? <img className="mt-8 aspect-[16/8] w-full border border-border object-cover" src={post.coverImage} alt="" /> : null}
        <div className="mx-auto max-w-3xl py-8 md:py-12"><ul className="mb-8 flex flex-wrap gap-x-4 gap-y-2">{post.tags.map((tag) => <li key={tag} className="text-xs text-muted-foreground">{tag}</li>)}</ul><div className="whitespace-pre-wrap text-base leading-8 text-foreground md:text-lg md:leading-9">{post.content}</div></div>
      </article>
    </>
  );
}
