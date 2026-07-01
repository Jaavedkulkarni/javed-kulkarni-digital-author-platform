-- Product foundation (Sprint 4) — prepares future Product Engine; books unchanged on public site

-- ─── product_types ─────────────────────────────────────────────────────────────

CREATE TABLE product_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50),
  active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── formats ─────────────────────────────────────────────────────────────────

CREATE TABLE formats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  format_type VARCHAR(50) NOT NULL DEFAULT 'digital',
  downloadable BOOLEAN DEFAULT TRUE,
  shipping_required BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── product_type_formats (many-to-many) ─────────────────────────────────────

CREATE TABLE product_type_formats (
  product_type_id UUID NOT NULL REFERENCES product_types(id) ON DELETE CASCADE,
  format_id UUID NOT NULL REFERENCES formats(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (product_type_id, format_id)
);

-- ─── books extension (admin metadata; public queries unchanged) ──────────────

ALTER TABLE books
  ADD COLUMN IF NOT EXISTS product_type_id UUID REFERENCES product_types(id) ON DELETE SET NULL;

CREATE TABLE book_formats (
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  format_id UUID NOT NULL REFERENCES formats(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (book_id, format_id)
);

-- ─── indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX idx_product_types_slug ON product_types(slug);
CREATE INDEX idx_product_types_active ON product_types(active);
CREATE INDEX idx_formats_slug ON formats(slug);
CREATE INDEX idx_formats_active ON formats(active);
CREATE INDEX idx_formats_format_type ON formats(format_type);
CREATE INDEX idx_books_product_type ON books(product_type_id);
CREATE INDEX idx_book_formats_format ON book_formats(format_id);

-- ─── updated_at triggers ─────────────────────────────────────────────────────

CREATE TRIGGER product_types_updated_at
  BEFORE UPDATE ON product_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER formats_updated_at
  BEFORE UPDATE ON formats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE product_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE formats ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_type_formats ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_formats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "product_types_select" ON product_types
  FOR SELECT TO public USING (true);

CREATE POLICY "formats_select" ON formats
  FOR SELECT TO public USING (true);

CREATE POLICY "product_type_formats_select" ON product_type_formats
  FOR SELECT TO public USING (true);

CREATE POLICY "book_formats_select" ON book_formats
  FOR SELECT TO public USING (true);

CREATE POLICY "product_types_insert" ON product_types
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "product_types_update" ON product_types
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "product_types_delete" ON product_types
  FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

CREATE POLICY "formats_insert" ON formats
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "formats_update" ON formats
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "formats_delete" ON formats
  FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

CREATE POLICY "product_type_formats_insert" ON product_type_formats
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "product_type_formats_delete" ON product_type_formats
  FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

CREATE POLICY "book_formats_insert" ON book_formats
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "book_formats_delete" ON book_formats
  FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- ─── seed product_types ──────────────────────────────────────────────────────

INSERT INTO product_types (name, slug, icon, sort_order) VALUES
  ('Book', 'book', 'book-open', 1),
  ('PDF Guide', 'pdf-guide', 'file-text', 2),
  ('Workbook', 'workbook', 'notebook-pen', 3),
  ('Checklist', 'checklist', 'list-checks', 4),
  ('Planner', 'planner', 'calendar', 5),
  ('Template', 'template', 'layout-template', 6),
  ('Bundle', 'bundle', 'package', 7),
  ('Course', 'course', 'graduation-cap', 8),
  ('Membership', 'membership', 'users', 9);

-- ─── seed formats ────────────────────────────────────────────────────────────

INSERT INTO formats (name, slug, format_type, downloadable, shipping_required, sort_order) VALUES
  ('Paperback', 'paperback', 'physical', false, true, 1),
  ('eBook', 'ebook', 'digital', true, false, 2),
  ('PDF', 'pdf', 'digital', true, false, 3),
  ('EPUB', 'epub', 'digital', true, false, 4),
  ('Audiobook', 'audiobook', 'digital', true, false, 5),
  ('Online Access', 'online-access', 'access', false, false, 6);

-- ─── seed product_type_formats ───────────────────────────────────────────────

INSERT INTO product_type_formats (product_type_id, format_id)
SELECT pt.id, f.id FROM product_types pt, formats f
WHERE pt.slug = 'book' AND f.slug IN ('paperback', 'ebook', 'pdf', 'epub', 'audiobook');

INSERT INTO product_type_formats (product_type_id, format_id)
SELECT pt.id, f.id FROM product_types pt, formats f
WHERE pt.slug = 'pdf-guide' AND f.slug = 'pdf';

INSERT INTO product_type_formats (product_type_id, format_id)
SELECT pt.id, f.id FROM product_types pt, formats f
WHERE pt.slug IN ('workbook', 'checklist', 'planner', 'template') AND f.slug = 'pdf';

INSERT INTO product_type_formats (product_type_id, format_id)
SELECT pt.id, f.id FROM product_types pt, formats f
WHERE pt.slug = 'bundle' AND f.slug IN ('paperback', 'ebook', 'pdf');

INSERT INTO product_type_formats (product_type_id, format_id)
SELECT pt.id, f.id FROM product_types pt, formats f
WHERE pt.slug = 'course' AND f.slug = 'pdf';

INSERT INTO product_type_formats (product_type_id, format_id)
SELECT pt.id, f.id FROM product_types pt, formats f
WHERE pt.slug = 'membership' AND f.slug = 'online-access';

-- ─── backfill existing books ─────────────────────────────────────────────────

UPDATE books
SET product_type_id = (SELECT id FROM product_types WHERE slug = 'book')
WHERE product_type_id IS NULL;
