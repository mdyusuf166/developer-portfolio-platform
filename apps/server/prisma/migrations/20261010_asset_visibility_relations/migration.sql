ALTER TABLE "projects" ADD COLUMN "imageAssetId" TEXT;
ALTER TABLE "blog_posts" ADD COLUMN "coverImageAssetId" TEXT;
ALTER TABLE "research_items" ADD COLUMN "imageAssetId" TEXT;
ALTER TABLE "research_items" ADD COLUMN "fileAssetId" TEXT;
ALTER TABLE "achievements" ADD COLUMN "imageAssetId" TEXT;
ALTER TABLE "achievements" ADD COLUMN "documentAssetId" TEXT;
ALTER TABLE "portfolio_profile" ADD COLUMN "profileImageAssetId" TEXT;
ALTER TABLE "portfolio_profile" ADD COLUMN "profileImagePublic" BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE "portfolio_profile" ADD COLUMN "resumeAssetId" TEXT;
ALTER TABLE "upload_assets" ADD COLUMN "ownerAdminId" TEXT;

CREATE INDEX "upload_assets_ownerAdminId_idx" ON "upload_assets"("ownerAdminId");

ALTER TABLE "projects" ADD CONSTRAINT "projects_imageAssetId_fkey" FOREIGN KEY ("imageAssetId") REFERENCES "upload_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_coverImageAssetId_fkey" FOREIGN KEY ("coverImageAssetId") REFERENCES "upload_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "research_items" ADD CONSTRAINT "research_items_imageAssetId_fkey" FOREIGN KEY ("imageAssetId") REFERENCES "upload_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "research_items" ADD CONSTRAINT "research_items_fileAssetId_fkey" FOREIGN KEY ("fileAssetId") REFERENCES "upload_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_imageAssetId_fkey" FOREIGN KEY ("imageAssetId") REFERENCES "upload_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_documentAssetId_fkey" FOREIGN KEY ("documentAssetId") REFERENCES "upload_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "portfolio_profile" ADD CONSTRAINT "portfolio_profile_profileImageAssetId_fkey" FOREIGN KEY ("profileImageAssetId") REFERENCES "upload_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "portfolio_profile" ADD CONSTRAINT "portfolio_profile_resumeAssetId_fkey" FOREIGN KEY ("resumeAssetId") REFERENCES "upload_assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "upload_assets" ADD CONSTRAINT "upload_assets_ownerAdminId_fkey" FOREIGN KEY ("ownerAdminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
