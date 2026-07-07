/*
================================================================================
AuthorOS — Role Management Foundation (018)
Extends roles / user_roles for enterprise role management
Depends on: 010, 011, 017
================================================================================
*/

-- ─── roles extensions ───────────────────────────────────────────────────────

ALTER TABLE roles
  ADD COLUMN IF NOT EXISTS slug VARCHAR(50),
  ADD COLUMN IF NOT EXISTS is_system BOOLEAN NOT NULL DEFAULT false;

UPDATE roles SET slug = name WHERE slug IS NULL;

ALTER TABLE roles ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_roles_slug ON roles(slug);

UPDATE roles SET
  is_system = true,
  description = COALESCE(description, CASE name
    WHEN 'reader' THEN 'Default role for every registered account'
    WHEN 'author' THEN 'Create and manage books, blogs, and analytics'
    WHEN 'publisher' THEN 'Manage print production, RFQs, and jobs'
    WHEN 'admin' THEN 'Platform administration and content review'
    WHEN 'super_admin' THEN 'Full platform control'
    ELSE description
  END)
WHERE name IN ('reader', 'author', 'publisher', 'admin', 'super_admin');

COMMENT ON COLUMN roles.slug IS 'Stable URL-safe identifier; mirrors name for system roles';
COMMENT ON COLUMN roles.is_system IS 'TRUE for built-in roles that cannot be deleted';

-- ─── user_roles extensions ────────────────────────────────────────────────────

ALTER TABLE user_roles
  ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

UPDATE user_roles SET id = gen_random_uuid() WHERE id IS NULL;
UPDATE user_roles SET created_at = COALESCE(created_at, assigned_at, NOW()) WHERE created_at IS NULL;
UPDATE user_roles SET updated_at = COALESCE(updated_at, assigned_at, NOW()) WHERE updated_at IS NULL;

ALTER TABLE user_roles ALTER COLUMN id SET NOT NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_roles_pkey'
      AND conrelid = 'public.user_roles'::regclass
  ) THEN
    ALTER TABLE user_roles DROP CONSTRAINT user_roles_pkey;
  END IF;
END $$;

ALTER TABLE user_roles ADD PRIMARY KEY (id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_roles_user_role
  ON user_roles(user_id, role_id);

CREATE INDEX IF NOT EXISTS idx_user_roles_active
  ON user_roles(user_id) WHERE is_active = true;

DROP TRIGGER IF EXISTS user_roles_updated_at ON user_roles;
CREATE TRIGGER user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON COLUMN user_roles.is_active IS 'FALSE when role assignment is revoked without deleting history';

-- ─── Role helpers (active assignments only) ───────────────────────────────────

CREATE OR REPLACE FUNCTION public.user_has_role(role_name TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
      AND ur.is_active = true
      AND r.name = role_name
  );
$$;

CREATE OR REPLACE FUNCTION public.user_has_any_role(role_names TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = auth.uid()
      AND ur.is_active = true
      AND r.name = ANY(role_names)
  );
$$;

CREATE OR REPLACE FUNCTION public.is_reader()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.user_has_role('reader');
$$;

COMMENT ON FUNCTION public.is_reader IS 'Current user has active reader role';

-- ─── assign_user_role supports re-activation ──────────────────────────────────

CREATE OR REPLACE FUNCTION public.assign_user_role(
  target_user_id UUID,
  role_name TEXT,
  actor_user_id UUID DEFAULT auth.uid()
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_role_id UUID;
BEGIN
  SELECT id INTO target_role_id FROM roles WHERE name = role_name;
  IF target_role_id IS NULL THEN
    RAISE EXCEPTION 'Unknown role: %', role_name;
  END IF;

  UPDATE user_roles
  SET is_active = true,
      assigned_by = actor_user_id,
      assigned_at = NOW(),
      updated_at = NOW()
  WHERE user_id = target_user_id
    AND role_id = target_role_id;

  IF NOT FOUND THEN
    INSERT INTO user_roles (user_id, role_id, assigned_by, is_active)
    VALUES (target_user_id, target_role_id, actor_user_id, true);
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.assign_user_role(uuid, text, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.assign_user_role(uuid, text, uuid) FROM anon;
REVOKE ALL ON FUNCTION public.assign_user_role(uuid, text, uuid) FROM authenticated;

-- ─── New registrations always receive reader ──────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_auth_user_roles()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  meta_role TEXT;
BEGIN
  meta_role := COALESCE(NEW.raw_user_meta_data->>'role', '');

  PERFORM public.ensure_profile_for_user(
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );

  IF lower(trim(NEW.email)) = 'jaavedkulkarni@gmail.com' THEN
    PERFORM public.assign_user_role(NEW.id, 'super_admin', NEW.id);
    PERFORM public.assign_user_role(NEW.id, 'reader', NEW.id);
    RETURN NEW;
  END IF;

  PERFORM public.assign_user_role(NEW.id, 'reader', NEW.id);

  IF meta_role = 'admin' THEN
    PERFORM public.assign_user_role(NEW.id, 'admin', NEW.id);
  END IF;

  RETURN NEW;
END;
$$;

-- ─── RLS: users read own active assignments ───────────────────────────────────

DROP POLICY IF EXISTS "user_roles_select_own" ON user_roles;
CREATE POLICY "user_roles_select_own" ON user_roles
  FOR SELECT TO authenticated
  USING (
    (auth.uid() = user_id AND is_active = true)
    OR public.is_super_admin()
  );
