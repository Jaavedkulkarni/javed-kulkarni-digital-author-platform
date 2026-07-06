/*
================================================================================
AuthorOS — Database Foundation (016)
Storage bucket preparation (references only — no file upload engine)
================================================================================
Buckets:
  book-covers     — public read (catalog covers)
  book-files      — private (EPUB/PDF; library entitlement required)
  author-assets   — public read (author avatars)
  publisher-assets — public read (publisher logos)
================================================================================
*/

-- ─── book-covers (public) ───────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'book-covers',
  'book-covers',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Public direct URL access (no listing)
DROP POLICY IF EXISTS "book_covers_public_read" ON storage.objects;
CREATE POLICY "book_covers_public_read" ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'book-covers');

DROP POLICY IF EXISTS "book_covers_staff_insert" ON storage.objects;
CREATE POLICY "book_covers_staff_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'book-covers' AND public.is_staff());

DROP POLICY IF EXISTS "book_covers_staff_update" ON storage.objects;
CREATE POLICY "book_covers_staff_update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'book-covers' AND public.is_staff());

DROP POLICY IF EXISTS "book_covers_staff_delete" ON storage.objects;
CREATE POLICY "book_covers_staff_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'book-covers' AND public.is_admin());

DROP POLICY IF EXISTS "book_covers_staff_list" ON storage.objects;
CREATE POLICY "book_covers_staff_list" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'book-covers' AND public.is_staff());

-- ─── book-files (private — EPUB/PDF) ─────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'book-files',
  'book-files',
  false,
  104857600,
  ARRAY[
    'application/epub+zip',
    'application/pdf',
    'application/octet-stream'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "book_files_read_entitled" ON storage.objects;
CREATE POLICY "book_files_read_entitled" ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'book-files'
    AND (
      public.is_admin()
      OR public.is_staff()
      OR EXISTS (
        SELECT 1 FROM books b
        WHERE (
          b.epub_storage_path = storage.objects.name
          OR b.pdf_storage_path = storage.objects.name
        )
        AND public.user_owns_book(b.id)
      )
      OR EXISTS (
        SELECT 1 FROM downloads d
        WHERE d.storage_path = storage.objects.name
          AND d.user_id = auth.uid()
          AND d.status IN ('ready', 'completed')
          AND public.is_not_deleted(d.deleted_at)
      )
    )
  );

DROP POLICY IF EXISTS "book_files_staff_insert" ON storage.objects;
CREATE POLICY "book_files_staff_insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'book-files'
    AND (public.is_admin() OR public.is_author() OR public.is_publisher())
  );

DROP POLICY IF EXISTS "book_files_staff_update" ON storage.objects;
CREATE POLICY "book_files_staff_update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'book-files' AND public.is_staff());

DROP POLICY IF EXISTS "book_files_staff_delete" ON storage.objects;
CREATE POLICY "book_files_staff_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'book-files' AND public.is_admin());

DROP POLICY IF EXISTS "book_files_staff_list" ON storage.objects;
CREATE POLICY "book_files_staff_list" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'book-files' AND public.is_staff());

-- ─── author-assets (public) ──────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'author-assets',
  'author-assets',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "author_assets_public_read" ON storage.objects;
CREATE POLICY "author_assets_public_read" ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'author-assets');

DROP POLICY IF EXISTS "author_assets_owner_write" ON storage.objects;
CREATE POLICY "author_assets_owner_write" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'author-assets'
    AND (public.is_admin() OR public.is_author())
  );

DROP POLICY IF EXISTS "author_assets_owner_update" ON storage.objects;
CREATE POLICY "author_assets_owner_update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'author-assets' AND (public.is_admin() OR public.is_author()));

DROP POLICY IF EXISTS "author_assets_admin_delete" ON storage.objects;
CREATE POLICY "author_assets_admin_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'author-assets' AND public.is_admin());

-- ─── publisher-assets (public) ───────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'publisher-assets',
  'publisher-assets',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "publisher_assets_public_read" ON storage.objects;
CREATE POLICY "publisher_assets_public_read" ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'publisher-assets');

DROP POLICY IF EXISTS "publisher_assets_owner_write" ON storage.objects;
CREATE POLICY "publisher_assets_owner_write" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'publisher-assets'
    AND (public.is_admin() OR public.is_publisher())
  );

DROP POLICY IF EXISTS "publisher_assets_owner_update" ON storage.objects;
CREATE POLICY "publisher_assets_owner_update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'publisher-assets' AND (public.is_admin() OR public.is_publisher()));

DROP POLICY IF EXISTS "publisher_assets_admin_delete" ON storage.objects;
CREATE POLICY "publisher_assets_admin_delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'publisher-assets' AND public.is_admin());

-- ─── Storage path convention documentation ─────────────────────────────────────
-- book-covers/{book_id}/cover.webp
-- book-files/{book_id}/edition.epub
-- book-files/{book_id}/edition.pdf
-- author-assets/{author_id}/avatar.webp
-- publisher-assets/{publisher_id}/logo.webp
