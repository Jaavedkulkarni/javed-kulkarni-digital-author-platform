/*
================================================================================
AuthorOS — Database Foundation (012)
Catalog: authors, publishers, categories, series, books, chapters
================================================================================
Migrates legacy book_categories entity table → categories
Creates book_categories junction (books ↔ categories)
================================================================================
*/

-- ─── Rename legacy category entity table ─────────────────────────────────────

ALTER TABLE IF EXISTS book_categories RENAME TO categories;

COMMENT ON TABLE categories IS 'Canonical book taxonomy categories (renamed from book_categories)';

ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN categories.parent_id IS 'Optional parent for hierarchical taxonomy';
COMMENT ON COLUMN categories.is_active IS 'FALSE hides category from public catalog';
COMMENT ON COLUMN categories.deleted_at IS 'Soft delete timestamp';

CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active) WHERE deleted_at IS NULL;

-- ─── authors ─────────────────────────────────────────────────────────────────

CREATE TABLE authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  slug VARCHAR(200) NOT NULL,
  display_name VARCHAR(200) NOT NULL,
  legal_name VARCHAR(200),
  bio TEXT,
  short_bio VARCHAR(500),
  avatar_storage_path TEXT,
  cover_storage_path TEXT,
  website_url TEXT,
  social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT authors_slug_unique UNIQUE (slug)
);

COMMENT ON TABLE authors IS 'Author identity and public metadata';
COMMENT ON COLUMN authors.profile_id IS 'Optional link to platform user (auth.users / profiles)';
COMMENT ON COLUMN authors.avatar_storage_path IS 'Supabase Storage path reference (bucket: author-assets)';
COMMENT ON COLUMN authors.social_links IS 'JSON map of social platform URLs';

CREATE INDEX idx_authors_profile_id ON authors(profile_id);
CREATE INDEX idx_authors_slug ON authors(slug);
CREATE INDEX idx_authors_status ON authors(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_authors_featured ON authors(is_featured) WHERE deleted_at IS NULL;

CREATE TRIGGER authors_updated_at
  BEFORE UPDATE ON authors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── publishers ──────────────────────────────────────────────────────────────

CREATE TABLE publishers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  slug VARCHAR(200) NOT NULL,
  name VARCHAR(200) NOT NULL,
  legal_name VARCHAR(200),
  description TEXT,
  logo_storage_path TEXT,
  website_url TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(30),
  address JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT publishers_slug_unique UNIQUE (slug)
);

COMMENT ON TABLE publishers IS 'Publisher / imprint identity';
COMMENT ON COLUMN publishers.logo_storage_path IS 'Supabase Storage path reference (bucket: publisher-assets)';

CREATE INDEX idx_publishers_profile_id ON publishers(profile_id);
CREATE INDEX idx_publishers_slug ON publishers(slug);
CREATE INDEX idx_publishers_status ON publishers(status) WHERE deleted_at IS NULL;

CREATE TRIGGER publishers_updated_at
  BEFORE UPDATE ON publishers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── series ──────────────────────────────────────────────────────────────────

CREATE TABLE series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
  publisher_id UUID REFERENCES publishers(id) ON DELETE SET NULL,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL,
  subtitle TEXT,
  description TEXT,
  cover_storage_path TEXT,
  primary_language VARCHAR(10) NOT NULL DEFAULT 'mr',
  supported_languages JSONB NOT NULL DEFAULT '["mr"]'::jsonb,
  book_count INTEGER NOT NULL DEFAULT 0,
  is_complete BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT series_slug_unique UNIQUE (slug)
);

COMMENT ON TABLE series IS 'Multi-book series grouping';
COMMENT ON COLUMN series.supported_languages IS 'ISO 639-1 codes for future multilingual series';
COMMENT ON COLUMN series.cover_storage_path IS 'Storage path reference (bucket: book-covers)';

CREATE INDEX idx_series_author_id ON series(author_id);
CREATE INDEX idx_series_publisher_id ON series(publisher_id);
CREATE INDEX idx_series_slug ON series(slug);
CREATE INDEX idx_series_featured ON series(is_featured) WHERE deleted_at IS NULL;

CREATE TRIGGER series_updated_at
  BEFORE UPDATE ON series
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── books extensions ────────────────────────────────────────────────────────

ALTER TABLE books
  ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS publisher_id UUID REFERENCES publishers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS series_id UUID REFERENCES series(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS series_order INTEGER,
  ADD COLUMN IF NOT EXISTS workflow_status public.book_workflow_status,
  ADD COLUMN IF NOT EXISTS primary_language VARCHAR(10) DEFAULT 'mr',
  ADD COLUMN IF NOT EXISTS supported_languages JSONB NOT NULL DEFAULT '["mr"]'::jsonb,
  ADD COLUMN IF NOT EXISTS epub_storage_path TEXT,
  ADD COLUMN IF NOT EXISTS pdf_storage_path TEXT,
  ADD COLUMN IF NOT EXISTS epub_file_size_bytes BIGINT,
  ADD COLUMN IF NOT EXISTS pdf_file_size_bytes BIGINT,
  ADD COLUMN IF NOT EXISTS page_count INTEGER,
  ADD COLUMN IF NOT EXISTS word_count INTEGER,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

COMMENT ON TABLE books IS 'Universal book product; supports draft/review/published/archived workflow';
COMMENT ON COLUMN books.workflow_status IS 'Enterprise workflow state (replaces legacy status over time)';
COMMENT ON COLUMN books.primary_language IS 'Primary content language ISO 639-1';
COMMENT ON COLUMN books.supported_languages IS 'All available translation language codes';
COMMENT ON COLUMN books.epub_storage_path IS 'Storage ref: book-files/{book_id}/edition.epub';
COMMENT ON COLUMN books.pdf_storage_path IS 'Storage ref: book-files/{book_id}/edition.pdf';
COMMENT ON COLUMN books.category_id IS 'DEPRECATED: use book_categories junction; kept for backward compatibility';
COMMENT ON COLUMN books.deleted_at IS 'Soft delete; NULL = active';

-- Migrate legacy status → workflow_status
UPDATE books SET workflow_status = 'published'::public.book_workflow_status
WHERE workflow_status IS NULL AND status = 'published';

UPDATE books SET workflow_status = 'draft'::public.book_workflow_status
WHERE workflow_status IS NULL AND status = 'draft';

UPDATE books SET workflow_status = 'draft'::public.book_workflow_status
WHERE workflow_status IS NULL;

ALTER TABLE books
  ALTER COLUMN workflow_status SET DEFAULT 'draft'::public.book_workflow_status,
  ALTER COLUMN workflow_status SET NOT NULL;

-- Expand legacy status check to include review + archived
ALTER TABLE books DROP CONSTRAINT IF EXISTS books_status_check;
ALTER TABLE books ADD CONSTRAINT books_status_check
  CHECK (status IN ('draft', 'review', 'published', 'archived'));

CREATE INDEX IF NOT EXISTS idx_books_author_id ON books(author_id);
CREATE INDEX IF NOT EXISTS idx_books_publisher_id ON books(publisher_id);
CREATE INDEX IF NOT EXISTS idx_books_series_id ON books(series_id);
CREATE INDEX IF NOT EXISTS idx_books_workflow_status ON books(workflow_status);
CREATE INDEX IF NOT EXISTS idx_books_primary_language ON books(primary_language);
CREATE INDEX IF NOT EXISTS idx_books_published_at ON books(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_books_active ON books(id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_books_epub_path ON books(epub_storage_path) WHERE epub_storage_path IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_books_pdf_path ON books(pdf_storage_path) WHERE pdf_storage_path IS NOT NULL;

-- ─── book_categories (junction) ──────────────────────────────────────────────

CREATE TABLE book_categories (
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (book_id, category_id)
);

COMMENT ON TABLE book_categories IS 'Many-to-many: books ↔ categories';

CREATE INDEX idx_book_categories_category ON book_categories(category_id);
CREATE INDEX idx_book_categories_primary ON book_categories(book_id) WHERE is_primary = TRUE;

-- Backfill junction from legacy books.category_id
INSERT INTO book_categories (book_id, category_id, is_primary, sort_order)
SELECT b.id, b.category_id, TRUE, 0
FROM books b
WHERE b.category_id IS NOT NULL
ON CONFLICT (book_id, category_id) DO NOTHING;

-- ─── chapters ────────────────────────────────────────────────────────────────

CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  parent_chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500),
  chapter_number NUMERIC(8, 2) NOT NULL,
  summary TEXT,
  content TEXT,
  content_storage_path TEXT,
  language_code VARCHAR(10) NOT NULL DEFAULT 'mr',
  word_count INTEGER,
  estimated_read_minutes INTEGER,
  is_preview BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT chapters_book_number_unique UNIQUE (book_id, chapter_number, language_code)
);

COMMENT ON TABLE chapters IS 'Book chapters; supports multilingual editions via language_code';
COMMENT ON COLUMN chapters.content_storage_path IS 'Optional storage ref for large chapter content';
COMMENT ON COLUMN chapters.chapter_number IS 'Supports decimal ordering (e.g. 1, 1.5, 2)';

CREATE INDEX idx_chapters_book_id ON chapters(book_id);
CREATE INDEX idx_chapters_book_sort ON chapters(book_id, sort_order);
CREATE INDEX idx_chapters_language ON chapters(language_code);
CREATE INDEX idx_chapters_preview ON chapters(book_id) WHERE is_preview = TRUE AND deleted_at IS NULL;

CREATE TRIGGER chapters_updated_at
  BEFORE UPDATE ON chapters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── book ownership helpers (catalog) ────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.author_owns_book(target_book_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM books b
    JOIN authors a ON a.id = b.author_id
    WHERE b.id = target_book_id
      AND a.profile_id = auth.uid()
      AND public.is_not_deleted(b.deleted_at)
      AND public.is_not_deleted(a.deleted_at)
  );
$$;

CREATE OR REPLACE FUNCTION public.publisher_owns_book(target_book_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM books b
    JOIN publishers p ON p.id = b.publisher_id
    WHERE b.id = target_book_id
      AND p.profile_id = auth.uid()
      AND public.is_not_deleted(b.deleted_at)
      AND public.is_not_deleted(p.deleted_at)
  );
$$;

CREATE OR REPLACE FUNCTION public.can_manage_book(target_book_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_admin() OR public.author_owns_book(target_book_id) OR public.publisher_owns_book(target_book_id);
$$;

-- ─── RLS: authors ────────────────────────────────────────────────────────────

ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authors_select_public" ON authors FOR SELECT TO public
  USING (public.is_not_deleted(deleted_at) AND status = 'active');

CREATE POLICY "authors_select_staff" ON authors FOR SELECT TO authenticated
  USING (public.is_staff() OR profile_id = auth.uid());

CREATE POLICY "authors_insert_staff" ON authors FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR (public.is_author() AND profile_id = auth.uid()));

CREATE POLICY "authors_update_owner" ON authors FOR UPDATE TO authenticated
  USING (public.is_admin() OR profile_id = auth.uid())
  WITH CHECK (public.is_admin() OR profile_id = auth.uid());

CREATE POLICY "authors_delete_admin" ON authors FOR DELETE TO authenticated
  USING (public.is_admin());

-- ─── RLS: publishers ───────────────────────────────────────────────────────

ALTER TABLE publishers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "publishers_select_public" ON publishers FOR SELECT TO public
  USING (public.is_not_deleted(deleted_at) AND status = 'active');

CREATE POLICY "publishers_select_staff" ON publishers FOR SELECT TO authenticated
  USING (public.is_staff() OR profile_id = auth.uid());

CREATE POLICY "publishers_insert_staff" ON publishers FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR (public.is_publisher() AND profile_id = auth.uid()));

CREATE POLICY "publishers_update_owner" ON publishers FOR UPDATE TO authenticated
  USING (public.is_admin() OR profile_id = auth.uid())
  WITH CHECK (public.is_admin() OR profile_id = auth.uid());

CREATE POLICY "publishers_delete_admin" ON publishers FOR DELETE TO authenticated
  USING (public.is_admin());

-- ─── RLS: series ─────────────────────────────────────────────────────────────

ALTER TABLE series ENABLE ROW LEVEL SECURITY;

CREATE POLICY "series_select_public" ON series FOR SELECT TO public
  USING (public.is_not_deleted(deleted_at));

CREATE POLICY "series_select_auth" ON series FOR SELECT TO authenticated USING (true);

CREATE POLICY "series_manage_staff" ON series FOR ALL TO authenticated
  USING (public.is_admin() OR public.is_author() OR public.is_publisher())
  WITH CHECK (public.is_admin() OR public.is_author() OR public.is_publisher());

-- ─── RLS: categories (upgrade from legacy) ───────────────────────────────────

DROP POLICY IF EXISTS "book_categories_select" ON categories;
DROP POLICY IF EXISTS "book_categories_insert" ON categories;
DROP POLICY IF EXISTS "book_categories_update" ON categories;
DROP POLICY IF EXISTS "book_categories_delete" ON categories;

CREATE POLICY "categories_select_public" ON categories FOR SELECT TO public
  USING (public.is_not_deleted(deleted_at) AND is_active = TRUE);

CREATE POLICY "categories_select_auth" ON categories FOR SELECT TO authenticated USING (true);

CREATE POLICY "categories_manage_admin" ON categories FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ─── RLS: book_categories junction ───────────────────────────────────────────

ALTER TABLE book_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "book_categories_select_public" ON book_categories FOR SELECT TO public USING (true);
CREATE POLICY "book_categories_select_auth" ON book_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "book_categories_manage_staff" ON book_categories FOR ALL TO authenticated
  USING (public.is_admin() OR public.is_author() OR public.is_publisher())
  WITH CHECK (public.is_admin() OR public.is_author() OR public.is_publisher());

-- ─── RLS: books (upgrade policies) ───────────────────────────────────────────

DROP POLICY IF EXISTS "books_select" ON books;
CREATE POLICY "books_select_public" ON books FOR SELECT TO public
  USING (
    public.is_not_deleted(deleted_at)
    AND workflow_status = 'published'::public.book_workflow_status
    AND COALESCE(is_hidden, FALSE) = FALSE
  );

DROP POLICY IF EXISTS "books_select_auth" ON books;
CREATE POLICY "books_select_auth" ON books FOR SELECT TO authenticated
  USING (
    public.is_not_deleted(deleted_at)
    AND (
      public.is_staff()
      OR workflow_status = 'published'::public.book_workflow_status
      OR public.author_owns_book(id)
      OR public.publisher_owns_book(id)
    )
  );

DROP POLICY IF EXISTS "books_insert" ON books;
CREATE POLICY "books_insert_staff" ON books FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR public.is_author() OR public.is_publisher());

DROP POLICY IF EXISTS "books_update" ON books;
CREATE POLICY "books_update_staff" ON books FOR UPDATE TO authenticated
  USING (public.can_manage_book(id))
  WITH CHECK (public.can_manage_book(id));

DROP POLICY IF EXISTS "books_delete" ON books;
CREATE POLICY "books_delete_admin" ON books FOR DELETE TO authenticated
  USING (public.is_admin());

-- ─── RLS: chapters ───────────────────────────────────────────────────────────

ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chapters_select_public" ON chapters FOR SELECT TO public
  USING (
    public.is_not_deleted(deleted_at)
    AND is_published = TRUE
    AND (
      is_preview = TRUE
      OR EXISTS (
        SELECT 1 FROM books b
        WHERE b.id = chapters.book_id
          AND b.workflow_status = 'published'::public.book_workflow_status
          AND public.is_not_deleted(b.deleted_at)
      )
    )
  );

CREATE POLICY "chapters_select_owner" ON chapters FOR SELECT TO authenticated
  USING (
    public.can_manage_book(book_id)
    OR public.user_owns_book(book_id)
    OR (
      is_published = TRUE
      AND EXISTS (
        SELECT 1 FROM books b
        WHERE b.id = chapters.book_id
          AND b.workflow_status = 'published'::public.book_workflow_status
      )
    )
  );

CREATE POLICY "chapters_manage_staff" ON chapters FOR ALL TO authenticated
  USING (public.can_manage_book(book_id))
  WITH CHECK (public.can_manage_book(book_id));

-- user_owns_book placeholder — defined in 013; create stub here for chapters policy
CREATE OR REPLACE FUNCTION public.user_owns_book(target_book_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT FALSE;
$$;
