CREATE INDEX "projects_category_updatedAt_idx" ON "projects"("category", "updatedAt");
CREATE INDEX "projects_status_updatedAt_idx" ON "projects"("status", "updatedAt");
CREATE INDEX "blog_posts_category_updatedAt_idx" ON "blog_posts"("category", "updatedAt");
CREATE INDEX "blog_posts_published_publishedAt_idx" ON "blog_posts"("published", "publishedAt");
