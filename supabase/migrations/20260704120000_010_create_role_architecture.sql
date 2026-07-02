-- Sprint 7: Multi-role architecture — profiles, roles, user_roles, invitations

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(200),
  avatar TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_status ON profiles(status);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO roles (name) VALUES
  ('super_admin'),
  ('author'),
  ('admin'),
  ('reader');

CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

CREATE TABLE role_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_role_invitations_email ON role_invitations(email);
CREATE INDEX idx_role_invitations_token ON role_invitations(token);
CREATE INDEX idx_role_invitations_status ON role_invitations(status);

-- Role helper functions for RLS
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
      AND r.name = ANY(role_names)
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.user_has_role('super_admin');
$$;

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

  INSERT INTO user_roles (user_id, role_id, assigned_by)
  VALUES (target_user_id, target_role_id, actor_user_id)
  ON CONFLICT (user_id, role_id) DO NOTHING;
END;
$$;

CREATE OR REPLACE FUNCTION public.ensure_profile_for_user(
  target_user_id UUID,
  target_email TEXT,
  target_full_name TEXT DEFAULT NULL,
  target_avatar TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar, status)
  VALUES (
    target_user_id,
    COALESCE(NULLIF(TRIM(target_email), ''), ''),
    NULLIF(TRIM(target_full_name), ''),
    NULLIF(TRIM(target_avatar), ''),
    'active'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar = COALESCE(EXCLUDED.avatar, profiles.avatar),
    updated_at = NOW();
END;
$$;

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
    RETURN NEW;
  END IF;

  IF meta_role = 'admin' THEN
    PERFORM public.assign_user_role(NEW.id, 'admin', NEW.id);
  ELSIF meta_role = 'reader' OR meta_role = '' THEN
    PERFORM public.assign_user_role(NEW.id, 'reader', NEW.id);
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_roles
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user_roles();

-- Backfill profiles and roles for existing users
INSERT INTO profiles (id, email, full_name, avatar, status)
SELECT
  u.id,
  COALESCE(u.email, ''),
  COALESCE(
    NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(u.raw_user_meta_data->>'name'), '')
  ),
  NULLIF(TRIM(u.raw_user_meta_data->>'avatar_url'), ''),
  'active'
FROM auth.users u
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
  updated_at = NOW();

INSERT INTO user_roles (user_id, role_id, assigned_by)
SELECT u.id, r.id, u.id
FROM auth.users u
CROSS JOIN roles r
WHERE lower(trim(u.email)) = 'jaavedkulkarni@gmail.com'
  AND r.name = 'super_admin'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id, assigned_by)
SELECT rp.id, r.id, rp.id
FROM reader_profiles rp
JOIN roles r ON r.name = 'reader'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id, assigned_by)
SELECT u.id, r.id, u.id
FROM auth.users u
JOIN roles r ON r.name = 'admin'
WHERE COALESCE(u.raw_user_meta_data->>'role', '') = 'admin'
  AND lower(trim(u.email)) <> 'jaavedkulkarni@gmail.com'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id, assigned_by)
SELECT u.id, r.id, u.id
FROM auth.users u
JOIN roles r ON r.name = 'reader'
WHERE COALESCE(u.raw_user_meta_data->>'role', '') = 'reader'
  AND NOT EXISTS (SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id)
ON CONFLICT DO NOTHING;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.is_super_admin());

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id OR public.is_super_admin())
  WITH CHECK (auth.uid() = id OR public.is_super_admin());

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id OR public.is_super_admin());

CREATE POLICY "roles_select_authenticated" ON roles
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "user_roles_select_own" ON user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_super_admin());

CREATE POLICY "user_roles_manage_super_admin" ON user_roles
  FOR ALL TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

CREATE POLICY "role_invitations_manage_super_admin" ON role_invitations
  FOR ALL TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());
