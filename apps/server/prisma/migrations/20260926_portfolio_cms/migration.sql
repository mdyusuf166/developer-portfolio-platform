ALTER TABLE "projects"
  ADD COLUMN "problem" TEXT,
  ADD COLUMN "approach" TEXT,
  ADD COLUMN "implementation" TEXT,
  ADD COLUMN "architecture" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "technologies" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "results" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "technicalChallenges" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "learnings" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "githubUrl" TEXT,
  ADD COLUMN "demoUrl" TEXT;

ALTER TABLE "blog_posts"
  ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "coverImageUrl" TEXT;

ALTER TABLE "experiences"
  ADD COLUMN "responsibilities" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "technologies" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "status" TEXT NOT NULL DEFAULT 'published';
ALTER TABLE "experiences" ALTER COLUMN "status" SET DEFAULT 'draft';

ALTER TABLE "education"
  ADD COLUMN "coursework" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "status" TEXT NOT NULL DEFAULT 'published';
ALTER TABLE "education" ALTER COLUMN "status" SET DEFAULT 'draft';

ALTER TABLE "research_items"
  ADD COLUMN "area" TEXT,
  ADD COLUMN "methodology" TEXT,
  ADD COLUMN "technologies" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "publicationDate" TIMESTAMP(3),
  ADD COLUMN "publicationUrl" TEXT,
  ADD COLUMN "paperUrl" TEXT,
  ADD COLUMN "githubUrl" TEXT,
  ADD COLUMN "notes" TEXT,
  ADD COLUMN "imageUrl" TEXT,
  ADD COLUMN "fileUrl" TEXT;

ALTER TABLE "achievements"
  ADD COLUMN "credentialUrl" TEXT,
  ADD COLUMN "imageUrl" TEXT,
  ADD COLUMN "documentUrl" TEXT,
  ADD COLUMN "status" TEXT NOT NULL DEFAULT 'published';
ALTER TABLE "achievements" ALTER COLUMN "status" SET DEFAULT 'draft';

ALTER TABLE "services"
  ADD COLUMN "status" TEXT NOT NULL DEFAULT 'published';
ALTER TABLE "services" ALTER COLUMN "status" SET DEFAULT 'draft';

CREATE TABLE "portfolio_profile" (
  "id" TEXT NOT NULL DEFAULT 'primary',
  "name" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "headline" TEXT NOT NULL,
  "bio" TEXT NOT NULL,
  "location" TEXT,
  "email" TEXT,
  "github" TEXT,
  "linkedin" TEXT,
  "profileImageUrl" TEXT,
  "resumeUrl" TEXT,
  "socials" JSONB NOT NULL DEFAULT '[]',
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "portfolio_profile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "upload_assets" (
  "id" TEXT NOT NULL,
  "originalName" TEXT NOT NULL,
  "filename" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "url" TEXT NOT NULL,
  "purpose" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "upload_assets_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "upload_assets_filename_key" ON "upload_assets"("filename");
CREATE UNIQUE INDEX "upload_assets_url_key" ON "upload_assets"("url");
CREATE INDEX "upload_assets_createdAt_idx" ON "upload_assets"("createdAt");