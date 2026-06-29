/*
# Create Blog Settings Table

Single-row settings table for site-wide configuration:
- Author profile (name, bio, photo URL)
- Social media links (Instagram, Facebook, LinkedIn, X, Amazon)
- Site branding (logo URL, favicon URL)

Uses a fixed primary key of 1 to enforce exactly one row.
Public read so the blog frontend can access author/branding data.
Authenticated-only write so only admins can change settings.
*/

CREATE TABLE IF NOT EXISTS blog_settings (
  id integer PRIMARY KEY DEFAULT 1,
  author_name varchar(255),
  author_bio text,
  author_photo_url text,
  social_instagram varchar(500),
  social_facebook varchar(500),
  social_linkedin varchar(500),
  social_x varchar(500),
  social_amazon varchar(500),
  site_logo_url text,
  site_favicon_url text,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Seed the single settings row (no-op if already exists)
INSERT INTO blog_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- RLS
ALTER TABLE blog_settings ENABLE ROW LEVEL SECURITY;

-- Public SELECT: blog frontend needs author info, logo, etc.
DROP POLICY IF EXISTS "public_read_settings" ON blog_settings;
CREATE POLICY "public_read_settings"
ON blog_settings FOR SELECT
TO public
USING (true);

-- Authenticated UPDATE only (no INSERT/DELETE — row is seeded above)
DROP POLICY IF EXISTS "auth_update_settings" ON blog_settings;
CREATE POLICY "auth_update_settings"
ON blog_settings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
