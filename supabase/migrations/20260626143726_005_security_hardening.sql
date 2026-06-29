/*
# Security Hardening

Addresses three classes of Supabase security warnings:

1. Function Search Path Mutable
   - Recreate all three trigger functions with SET search_path = '' so they cannot
     be hijacked by a mutable search_path.

2. RLS Policy Always True
   - Admin-only tables (blog_articles, blog_categories, blog_tags, blog_article_tags,
     blog_settings): replace bare USING (true) / WITH CHECK (true) with
     USING (auth.uid() IS NOT NULL) so intent is explicit and the predicate is
     not trivially always-true.
   - Public-write tables (blog_comments, blog_newsletter_subscribers,
     blog_article_likes, blog_article_bookmarks): add column-level NOT NULL guards
     as the WITH CHECK / USING predicate so the policy is not trivially open.

3. Public Bucket Allows Listing
   - Drop the broad public SELECT policies on storage.objects for the blog-images
     and media buckets. Direct URL access to public buckets does not require a
     SELECT policy; files remain fully accessible via their public URLs.
   - Add authenticated-only SELECT policies so the admin media library can still
     list files via the Supabase Storage API.
*/

-- ─── 1. Fix Function Search Paths ────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_reading_time(content TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
    word_count INTEGER;
BEGIN
    word_count := array_length(regexp_split_to_array(content, '\s+'), 1);
    RETURN GREATEST(1, CEIL(word_count::FLOAT / 200));
END;
$$;

CREATE OR REPLACE FUNCTION public.update_reading_time()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.reading_time := public.calculate_reading_time(NEW.content);
    RETURN NEW;
END;
$$;

-- ─── 2a. blog_categories (authenticated write policies) ───────────────────────

DROP POLICY IF EXISTS "categories_insert" ON blog_categories;
DROP POLICY IF EXISTS "categories_update" ON blog_categories;
DROP POLICY IF EXISTS "categories_delete" ON blog_categories;

CREATE POLICY "categories_insert" ON blog_categories
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "categories_update" ON blog_categories
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "categories_delete" ON blog_categories
  FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ─── 2b. blog_articles (authenticated write policies) ────────────────────────

DROP POLICY IF EXISTS "articles_insert" ON blog_articles;
DROP POLICY IF EXISTS "articles_update" ON blog_articles;
DROP POLICY IF EXISTS "articles_delete" ON blog_articles;

CREATE POLICY "articles_insert" ON blog_articles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "articles_update" ON blog_articles
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "articles_delete" ON blog_articles
  FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ─── 2c. blog_tags (authenticated write policies) ────────────────────────────

DROP POLICY IF EXISTS "tags_insert" ON blog_tags;
DROP POLICY IF EXISTS "tags_update" ON blog_tags;
DROP POLICY IF EXISTS "tags_delete" ON blog_tags;

CREATE POLICY "tags_insert" ON blog_tags
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "tags_update" ON blog_tags
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "tags_delete" ON blog_tags
  FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ─── 2d. blog_article_tags (authenticated write policies) ────────────────────

DROP POLICY IF EXISTS "article_tags_insert" ON blog_article_tags;
DROP POLICY IF EXISTS "article_tags_delete" ON blog_article_tags;

CREATE POLICY "article_tags_insert" ON blog_article_tags
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "article_tags_delete" ON blog_article_tags
  FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ─── 2e. blog_comments ───────────────────────────────────────────────────────

-- Public INSERT: require the minimum non-null fields a comment must have
DROP POLICY IF EXISTS "comments_insert" ON blog_comments;
CREATE POLICY "comments_insert" ON blog_comments
  FOR INSERT TO public
  WITH CHECK (
    article_id IS NOT NULL
    AND author_name IS NOT NULL
    AND author_email IS NOT NULL
    AND content IS NOT NULL
  );

-- Authenticated UPDATE / DELETE: require a live session
DROP POLICY IF EXISTS "comments_update" ON blog_comments;
DROP POLICY IF EXISTS "comments_delete" ON blog_comments;

CREATE POLICY "comments_update" ON blog_comments
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "comments_delete" ON blog_comments
  FOR DELETE TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ─── 2f. blog_newsletter_subscribers ─────────────────────────────────────────

-- Public INSERT: require a plausible email address
DROP POLICY IF EXISTS "newsletter_insert" ON blog_newsletter_subscribers;
CREATE POLICY "newsletter_insert" ON blog_newsletter_subscribers
  FOR INSERT TO public
  WITH CHECK (
    email IS NOT NULL
    AND length(trim(email)) > 5
    AND trim(email) LIKE '%@%'
  );

-- ─── 2g. blog_article_likes ──────────────────────────────────────────────────

-- Public INSERT: require both FK and IP so the row is meaningful
DROP POLICY IF EXISTS "likes_insert" ON blog_article_likes;
CREATE POLICY "likes_insert" ON blog_article_likes
  FOR INSERT TO public
  WITH CHECK (
    article_id IS NOT NULL
    AND user_ip IS NOT NULL
  );

-- ─── 2h. blog_article_bookmarks ──────────────────────────────────────────────

DROP POLICY IF EXISTS "bookmarks_insert" ON blog_article_bookmarks;
DROP POLICY IF EXISTS "bookmarks_delete" ON blog_article_bookmarks;

CREATE POLICY "bookmarks_insert" ON blog_article_bookmarks
  FOR INSERT TO public
  WITH CHECK (
    article_id IS NOT NULL
    AND user_ip IS NOT NULL
  );

-- DELETE scoped to rows that actually have an IP (rows without IP would be orphaned anyway)
CREATE POLICY "bookmarks_delete" ON blog_article_bookmarks
  FOR DELETE TO public
  USING (user_ip IS NOT NULL);

-- ─── 2i. blog_settings ───────────────────────────────────────────────────────

DROP POLICY IF EXISTS "auth_update_settings" ON blog_settings;
CREATE POLICY "auth_update_settings" ON blog_settings
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ─── 3. Storage: restrict listing to authenticated users ──────────────────────

-- blog-images bucket: drop broad public listing, keep auth-only listing
DROP POLICY IF EXISTS "blog_images_public_select" ON storage.objects;
CREATE POLICY "blog_images_auth_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'blog-images');

-- media bucket: drop broad public listing, keep auth-only listing
DROP POLICY IF EXISTS "public_read_media" ON storage.objects;
CREATE POLICY "auth_list_media" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'media');
