/*
================================================================================
AuthorOS — Database Foundation (011)
Helpers, enums, role extensions, shared utilities
================================================================================
Depends on: 010_create_role_architecture
================================================================================
*/

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── Enumerations ────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE public.book_workflow_status AS ENUM ('draft', 'review', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
COMMENT ON TYPE public.book_workflow_status IS 'Book lifecycle: draft → review → published → archived';

DO $$ BEGIN
  CREATE TYPE public.digital_format AS ENUM ('epub', 'pdf');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
COMMENT ON TYPE public.digital_format IS 'Digital book formats (storage path references only)';

DO $$ BEGIN
  CREATE TYPE public.order_status AS ENUM ('pending', 'processing', 'completed', 'cancelled', 'refunded', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
COMMENT ON TYPE public.order_status IS 'Commerce order lifecycle states';

DO $$ BEGIN
  CREATE TYPE public.payment_status AS ENUM ('pending', 'authorized', 'captured', 'failed', 'refunded', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
COMMENT ON TYPE public.payment_status IS 'Payment transaction lifecycle states';

DO $$ BEGIN
  CREATE TYPE public.membership_tier AS ENUM ('free', 'basic', 'premium', 'lifetime');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
COMMENT ON TYPE public.membership_tier IS 'Reader membership subscription tiers';

DO $$ BEGIN
  CREATE TYPE public.membership_status AS ENUM ('active', 'paused', 'cancelled', 'expired', 'trial');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
COMMENT ON TYPE public.membership_status IS 'Membership subscription state';

DO $$ BEGIN
  CREATE TYPE public.notification_channel AS ENUM ('in_app', 'email', 'push');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
COMMENT ON TYPE public.notification_channel IS 'Notification delivery channel';

DO $$ BEGIN
  CREATE TYPE public.notification_category AS ENUM ('orders', 'membership', 'reading', 'promotions', 'system', 'account');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
COMMENT ON TYPE public.notification_category IS 'Notification grouping aligned with reader settings';

DO $$ BEGIN
  CREATE TYPE public.download_status AS ENUM ('queued', 'ready', 'downloading', 'completed', 'expired', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
COMMENT ON TYPE public.download_status IS 'Offline download job status';

DO $$ BEGIN
  CREATE TYPE public.analytics_event_type AS ENUM (
    'page_view', 'book_open', 'book_close', 'chapter_start', 'chapter_complete',
    'purchase', 'search', 'wishlist_add', 'download_start', 'download_complete', 'custom'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
COMMENT ON TYPE public.analytics_event_type IS 'Platform analytics event taxonomy';

-- ─── Publisher role ──────────────────────────────────────────────────────────

INSERT INTO roles (name) VALUES ('publisher') ON CONFLICT (name) DO NOTHING;
COMMENT ON TABLE roles IS 'System roles: super_admin, admin, author, publisher, reader';

-- ─── Profile extensions ──────────────────────────────────────────────────────

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS phone VARCHAR(30),
  ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(10) DEFAULT 'mr',
  ADD COLUMN IF NOT EXISTS timezone VARCHAR(64) DEFAULT 'Asia/Kolkata',
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

COMMENT ON TABLE profiles IS 'Core user profile linked 1:1 with auth.users';
COMMENT ON COLUMN profiles.id IS 'UUID PK; mirrors auth.users.id';
COMMENT ON COLUMN profiles.phone IS 'Optional contact phone';
COMMENT ON COLUMN profiles.preferred_language IS 'ISO 639-1 code (mr, en, hi)';
COMMENT ON COLUMN profiles.deleted_at IS 'Soft delete; NULL = active';

CREATE INDEX IF NOT EXISTS idx_profiles_active ON profiles(id) WHERE deleted_at IS NULL;

ALTER TABLE roles
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

COMMENT ON COLUMN roles.description IS 'Human-readable role description for admin UI';

CREATE TRIGGER roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Shared helpers ──────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_not_deleted(target_deleted_at TIMESTAMP WITH TIME ZONE)
RETURNS BOOLEAN LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $$
  SELECT target_deleted_at IS NULL;
$$;
COMMENT ON FUNCTION public.is_not_deleted IS 'TRUE when deleted_at IS NULL (row is active)';

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.user_has_any_role(ARRAY['admin', 'super_admin']);
$$;
COMMENT ON FUNCTION public.is_admin IS 'Current user is admin or super_admin';

CREATE OR REPLACE FUNCTION public.is_author()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.user_has_role('author');
$$;
COMMENT ON FUNCTION public.is_author IS 'Current user has author role';

CREATE OR REPLACE FUNCTION public.is_publisher()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.user_has_role('publisher');
$$;
COMMENT ON FUNCTION public.is_publisher IS 'Current user has publisher role';

CREATE OR REPLACE FUNCTION public.is_reader()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.user_has_role('reader');
$$;
COMMENT ON FUNCTION public.is_reader IS 'Current user has reader role';

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.user_has_any_role(ARRAY['super_admin', 'admin', 'author', 'publisher']);
$$;
COMMENT ON FUNCTION public.is_staff IS 'Current user has any staff role';

CREATE OR REPLACE FUNCTION public.slugify(input TEXT)
RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
  SELECT lower(regexp_replace(regexp_replace(trim(input), '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
$$;
COMMENT ON FUNCTION public.slugify IS 'Generate URL-safe slug from text';
