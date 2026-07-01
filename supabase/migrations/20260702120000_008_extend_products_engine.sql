-- Sprint 5: Universal Products Engine — extend books table (non-destructive)
-- books row = universal product; public site queries unchanged

ALTER TABLE books ADD COLUMN IF NOT EXISTS gallery_images JSONB DEFAULT '[]'::jsonb;

-- Pricing
ALTER TABLE books ADD COLUMN IF NOT EXISTS regular_price NUMERIC(12, 2);
ALTER TABLE books ADD COLUMN IF NOT EXISTS sale_price NUMERIC(12, 2);
ALTER TABLE books ADD COLUMN IF NOT EXISTS cost_price NUMERIC(12, 2);
ALTER TABLE books ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'INR';
ALTER TABLE books ADD COLUMN IF NOT EXISTS tax_class VARCHAR(50) DEFAULT 'standard';
ALTER TABLE books ADD COLUMN IF NOT EXISTS gst_percent NUMERIC(5, 2) DEFAULT 18;
ALTER TABLE books ADD COLUMN IF NOT EXISTS sku VARCHAR(100);

-- Inventory
ALTER TABLE books ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN DEFAULT FALSE;
ALTER TABLE books ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0;
ALTER TABLE books ADD COLUMN IF NOT EXISTS allow_backorders BOOLEAN DEFAULT FALSE;
ALTER TABLE books ADD COLUMN IF NOT EXISTS shipping_required BOOLEAN DEFAULT FALSE;

-- Digital (metadata only — no download engine in Sprint 5)
ALTER TABLE books ADD COLUMN IF NOT EXISTS downloadable BOOLEAN DEFAULT FALSE;
ALTER TABLE books ADD COLUMN IF NOT EXISTS download_file TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS download_limit INTEGER;
ALTER TABLE books ADD COLUMN IF NOT EXISTS download_expiry_days INTEGER;

-- Visibility (is_featured / is_new_release already exist)
ALTER TABLE books ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;
ALTER TABLE books ADD COLUMN IF NOT EXISTS members_only BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_books_product_type ON books(product_type_id);
CREATE INDEX IF NOT EXISTS idx_books_sku ON books(sku) WHERE sku IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_books_is_hidden ON books(is_hidden);
