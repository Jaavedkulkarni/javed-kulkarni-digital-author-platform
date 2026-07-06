/*
================================================================================
AuthorOS — Database Foundation (014)
Reader experience: reading_progress, bookmarks, notes, highlights, downloads
================================================================================
*/

-- ─── reading_progress ────────────────────────────────────────────────────────

CREATE TABLE reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
  format public.digital_format NOT NULL DEFAULT 'epub',
  current_page INTEGER CHECK (current_page IS NULL OR current_page >= 0),
  current_chapter_number NUMERIC(8, 2),
  progress_percent NUMERIC(5, 2) NOT NULL DEFAULT 0
    CHECK (progress_percent >= 0 AND progress_percent <= 100),
  total_pages INTEGER CHECK (total_pages IS NULL OR total_pages >= 0),
  words_read INTEGER NOT NULL DEFAULT 0 CHECK (words_read >= 0),
  reading_time_seconds INTEGER NOT NULL DEFAULT 0 CHECK (reading_time_seconds >= 0),
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  device_info JSONB NOT NULL DEFAULT '{}'::jsonb,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT reading_progress_user_book_unique UNIQUE (user_id, book_id)
);

COMMENT ON TABLE reading_progress IS 'Per-user per-book reading state and completion';
COMMENT ON COLUMN reading_progress.progress_percent IS '0–100 completion percentage';

CREATE INDEX idx_reading_progress_user_id ON reading_progress(user_id);
CREATE INDEX idx_reading_progress_book_id ON reading_progress(book_id);
CREATE INDEX idx_reading_progress_last_read ON reading_progress(user_id, last_read_at DESC);
CREATE INDEX idx_reading_progress_completed ON reading_progress(user_id) WHERE is_completed = TRUE;

CREATE TRIGGER reading_progress_updated_at
  BEFORE UPDATE ON reading_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── bookmarks ───────────────────────────────────────────────────────────────

CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
  label VARCHAR(200),
  page_number INTEGER CHECK (page_number IS NULL OR page_number >= 0),
  position_percent NUMERIC(5, 2) CHECK (position_percent IS NULL OR (position_percent >= 0 AND position_percent <= 100)),
  cfi_location TEXT,
  note TEXT,
  color VARCHAR(20) DEFAULT '#b8860b',
  is_auto BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE bookmarks IS 'Reader bookmarks with optional CFI (EPUB) location';
COMMENT ON COLUMN bookmarks.cfi_location IS 'EPUB Canonical Fragment Identifier';

CREATE INDEX idx_bookmarks_user_book ON bookmarks(user_id, book_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_bookmarks_auto ON bookmarks(user_id, book_id) WHERE is_auto = TRUE AND deleted_at IS NULL;

CREATE TRIGGER bookmarks_updated_at
  BEFORE UPDATE ON bookmarks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── notes ───────────────────────────────────────────────────────────────────

CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
  title VARCHAR(200),
  content TEXT NOT NULL,
  page_number INTEGER CHECK (page_number IS NULL OR page_number >= 0),
  position_percent NUMERIC(5, 2),
  cfi_location TEXT,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE notes IS 'Reader personal notes attached to book positions';

CREATE INDEX idx_notes_user_book ON notes(user_id, book_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_notes_pinned ON notes(user_id) WHERE is_pinned = TRUE AND deleted_at IS NULL;

CREATE TRIGGER notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── highlights ──────────────────────────────────────────────────────────────

CREATE TABLE highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
  selected_text TEXT NOT NULL,
  note TEXT,
  color VARCHAR(20) NOT NULL DEFAULT '#fef08a',
  page_number INTEGER CHECK (page_number IS NULL OR page_number >= 0),
  position_start NUMERIC(8, 4),
  position_end NUMERIC(8, 4),
  cfi_range TEXT,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE highlights IS 'Reader text highlights with optional annotation';
COMMENT ON COLUMN highlights.cfi_range IS 'EPUB CFI range for highlight span';

CREATE INDEX idx_highlights_user_book ON highlights(user_id, book_id) WHERE deleted_at IS NULL;

CREATE TRIGGER highlights_updated_at
  BEFORE UPDATE ON highlights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── downloads ───────────────────────────────────────────────────────────────

CREATE TABLE downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  format public.digital_format NOT NULL,
  status public.download_status NOT NULL DEFAULT 'queued',
  storage_path TEXT,
  file_size_bytes BIGINT CHECK (file_size_bytes IS NULL OR file_size_bytes >= 0),
  download_count INTEGER NOT NULL DEFAULT 0 CHECK (download_count >= 0),
  max_downloads INTEGER CHECK (max_downloads IS NULL OR max_downloads > 0),
  expires_at TIMESTAMP WITH TIME ZONE,
  wifi_only BOOLEAN NOT NULL DEFAULT TRUE,
  device_id VARCHAR(100),
  last_downloaded_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  failure_reason TEXT,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT downloads_user_book_format_unique UNIQUE (user_id, book_id, format)
);

COMMENT ON TABLE downloads IS 'Offline download jobs and entitlement tracking';
COMMENT ON COLUMN downloads.storage_path IS 'Resolved storage path after download preparation';
COMMENT ON COLUMN downloads.wifi_only IS 'Reader preference: download on Wi-Fi only';

CREATE INDEX idx_downloads_user_id ON downloads(user_id);
CREATE INDEX idx_downloads_status ON downloads(status);
CREATE INDEX idx_downloads_user_active ON downloads(user_id) WHERE deleted_at IS NULL;

CREATE TRIGGER downloads_updated_at
  BEFORE UPDATE ON downloads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── RLS: reading_progress ───────────────────────────────────────────────────

ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reading_progress_select_own" ON reading_progress FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND public.is_not_deleted(deleted_at));

CREATE POLICY "reading_progress_upsert_own" ON reading_progress FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND public.user_owns_book(book_id));

CREATE POLICY "reading_progress_update_own" ON reading_progress FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "reading_progress_delete_own" ON reading_progress FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "reading_progress_admin" ON reading_progress FOR SELECT TO authenticated
  USING (public.is_admin());

-- ─── RLS: bookmarks ──────────────────────────────────────────────────────────

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookmarks_own" ON bookmarks FOR ALL TO authenticated
  USING (user_id = auth.uid() AND public.is_not_deleted(deleted_at))
  WITH CHECK (user_id = auth.uid() AND public.user_owns_book(book_id));

-- ─── RLS: notes ──────────────────────────────────────────────────────────────

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notes_own" ON notes FOR ALL TO authenticated
  USING (user_id = auth.uid() AND public.is_not_deleted(deleted_at))
  WITH CHECK (user_id = auth.uid() AND public.user_owns_book(book_id));

-- ─── RLS: highlights ─────────────────────────────────────────────────────────

ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "highlights_own" ON highlights FOR ALL TO authenticated
  USING (user_id = auth.uid() AND public.is_not_deleted(deleted_at))
  WITH CHECK (user_id = auth.uid() AND public.user_owns_book(book_id));

-- ─── RLS: downloads ──────────────────────────────────────────────────────────

ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "downloads_select_own" ON downloads FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND public.is_not_deleted(deleted_at));

CREATE POLICY "downloads_insert_own" ON downloads FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND public.user_owns_book(book_id));

CREATE POLICY "downloads_update_own" ON downloads FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "downloads_delete_own" ON downloads FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "downloads_admin" ON downloads FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
