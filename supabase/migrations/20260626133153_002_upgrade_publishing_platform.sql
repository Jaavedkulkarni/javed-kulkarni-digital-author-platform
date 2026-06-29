/*
# Upgrade Blog to Full Publishing Platform

## Summary
This migration upgrades the existing blog schema to support a complete author publishing platform.

## Changes

### 1. New Columns
- `blog_articles.subtitle` (TEXT) — optional article subtitle displayed below the title

### 2. Category Updates
- Updates all category `icon` fields to store emoji characters for direct UI display
- Reorders categories to match the new specification
- Removes 'interviews' and replaces with the 8 specified categories

### 3. Storage
- Creates `blog-images` public storage bucket for article image uploads
- Adds RLS policies for public read + authenticated write on the bucket

### 4. Notes
- All changes are additive; no existing data is lost
- Storage bucket is set public so images can be referenced by URL
*/

-- 1. Add subtitle column to blog_articles
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS subtitle TEXT;

-- 2. Update category emojis (store emoji in icon field for direct rendering)
UPDATE blog_categories SET icon = '❤️',  sort_order = 1 WHERE slug = 'relationships';
UPDATE blog_categories SET icon = '👨‍👩‍👧', sort_order = 2 WHERE slug = 'parenting';
UPDATE blog_categories SET icon = '📱',  sort_order = 3 WHERE slug = 'digital-life';
UPDATE blog_categories SET icon = '🧠',  sort_order = 4 WHERE slug = 'self-development';
UPDATE blog_categories SET icon = '🌍',  sort_order = 5 WHERE slug = 'society';
UPDATE blog_categories SET icon = '📚',  sort_order = 6 WHERE slug = 'book-excerpts';
UPDATE blog_categories SET icon = '✍️',  sort_order = 7 WHERE slug = 'authors-notes';
UPDATE blog_categories SET icon = '📰',  sort_order = 8 WHERE slug = 'news';

-- Remove interviews category if no articles linked to it, otherwise keep
DELETE FROM blog_categories WHERE slug = 'interviews'
  AND NOT EXISTS (SELECT 1 FROM blog_articles WHERE category_id = (SELECT id FROM blog_categories WHERE slug = 'interviews'));

-- 3. Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880,
  ARRAY['image/jpeg','image/jpg','image/png','image/gif','image/webp']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. Storage RLS policies
DROP POLICY IF EXISTS "blog_images_public_select" ON storage.objects;
CREATE POLICY "blog_images_public_select" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "blog_images_auth_insert" ON storage.objects;
CREATE POLICY "blog_images_auth_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "blog_images_auth_update" ON storage.objects;
CREATE POLICY "blog_images_auth_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "blog_images_auth_delete" ON storage.objects;
CREATE POLICY "blog_images_auth_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'blog-images');
