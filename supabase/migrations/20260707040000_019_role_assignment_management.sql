/*
================================================================================
AuthorOS — Role Assignment Management (019)
Audit log + server-side role assignment RPC
Depends on: 018_role_management_foundation
================================================================================
*/

CREATE TABLE IF NOT EXISTS role_assignment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  action VARCHAR(20) NOT NULL CHECK (action IN ('assigned', 'removed')),
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_role_assignment_logs_user_id
  ON role_assignment_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_role_assignment_logs_created_at
  ON role_assignment_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_role_assignment_logs_role_id
  ON role_assignment_logs(role_id);

COMMENT ON TABLE role_assignment_logs IS 'Immutable audit trail for role assignments and removals';

ALTER TABLE role_assignment_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS role_assignment_logs_select ON role_assignment_logs;
CREATE POLICY role_assignment_logs_select ON role_assignment_logs
  FOR SELECT TO authenticated
  USING (public.is_admin() OR auth.uid() = user_id);

DROP POLICY IF EXISTS role_assignment_logs_insert ON role_assignment_logs;
CREATE POLICY role_assignment_logs_insert ON role_assignment_logs
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

-- ─── Count active super admins ────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.count_active_super_admins()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM user_roles ur
  JOIN roles r ON r.id = ur.role_id
  WHERE ur.is_active = true
    AND r.name = 'super_admin';
$$;

COMMENT ON FUNCTION public.count_active_super_admins IS 'Number of users with an active super_admin role';

-- ─── Server-side role assignment / removal ────────────────────────────────────

CREATE OR REPLACE FUNCTION public.apply_user_role_change(
  p_target_user_id UUID,
  p_role_name TEXT,
  p_action TEXT,
  p_reason TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor_id UUID := auth.uid();
  v_role_id UUID;
  v_log_id UUID;
  v_super_admin_count INTEGER;
  v_has_role BOOLEAN;
  v_normalized_action TEXT := lower(trim(p_action));
BEGIN
  IF v_actor_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF p_target_user_id IS NULL THEN
    RAISE EXCEPTION 'Target user is required';
  END IF;

  IF v_normalized_action NOT IN ('assign', 'remove') THEN
    RAISE EXCEPTION 'Invalid action';
  END IF;

  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Insufficient permissions';
  END IF;

  SELECT id INTO v_role_id FROM roles WHERE name = p_role_name;
  IF v_role_id IS NULL THEN
    RAISE EXCEPTION 'Unknown role: %', p_role_name;
  END IF;

  IF p_role_name = 'reader' AND v_normalized_action = 'remove' THEN
    RAISE EXCEPTION 'Reader cannot be removed';
  END IF;

  IF v_normalized_action = 'assign' THEN
    IF NOT public.is_super_admin() THEN
      IF p_role_name NOT IN ('author', 'publisher') THEN
        RAISE EXCEPTION 'Insufficient permissions';
      END IF;
      IF p_target_user_id = v_actor_id AND p_role_name IN ('admin', 'super_admin') THEN
        RAISE EXCEPTION 'Insufficient permissions';
      END IF;
    END IF;

    SELECT EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = p_target_user_id
        AND ur.role_id = v_role_id
        AND ur.is_active = true
    ) INTO v_has_role;

    IF v_has_role THEN
      RAISE EXCEPTION 'Role already assigned';
    END IF;

    UPDATE user_roles
    SET is_active = true,
        assigned_by = v_actor_id,
        assigned_at = NOW(),
        updated_at = NOW()
    WHERE user_id = p_target_user_id
      AND role_id = v_role_id;

    IF NOT FOUND THEN
      INSERT INTO user_roles (user_id, role_id, assigned_by, is_active)
      VALUES (p_target_user_id, v_role_id, v_actor_id, true);
    END IF;

    INSERT INTO role_assignment_logs (user_id, role_id, action, assigned_by, reason)
    VALUES (p_target_user_id, v_role_id, 'assigned', v_actor_id, NULLIF(trim(p_reason), ''))
    RETURNING id INTO v_log_id;

    RETURN v_log_id;
  END IF;

  -- remove
  IF NOT public.is_super_admin() THEN
    IF p_role_name NOT IN ('author', 'publisher') THEN
      RAISE EXCEPTION 'Insufficient permissions';
    END IF;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = p_target_user_id
      AND ur.role_id = v_role_id
      AND ur.is_active = true
  ) INTO v_has_role;

  IF NOT v_has_role THEN
    RAISE EXCEPTION 'Role not assigned';
  END IF;

  IF p_role_name = 'super_admin' AND p_target_user_id = v_actor_id THEN
    v_super_admin_count := public.count_active_super_admins();
    IF v_super_admin_count <= 1 THEN
      RAISE EXCEPTION 'Cannot remove last active Super Admin';
    END IF;
  END IF;

  UPDATE user_roles
  SET is_active = false,
      assigned_by = v_actor_id,
      updated_at = NOW()
  WHERE user_id = p_target_user_id
      AND role_id = v_role_id
      AND is_active = true;

  INSERT INTO role_assignment_logs (user_id, role_id, action, assigned_by, reason)
  VALUES (p_target_user_id, v_role_id, 'removed', v_actor_id, NULLIF(trim(p_reason), ''))
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$;

COMMENT ON FUNCTION public.apply_user_role_change IS
  'Validates and applies role assignment/removal with audit logging';

REVOKE ALL ON FUNCTION public.apply_user_role_change(uuid, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.apply_user_role_change(uuid, text, text, text) TO authenticated;

-- Platform admins may manage author/publisher user_roles rows (fallback path)
DROP POLICY IF EXISTS user_roles_manage_platform_admin ON user_roles;
CREATE POLICY user_roles_manage_platform_admin ON user_roles
  FOR ALL TO authenticated
  USING (
    public.is_admin()
    AND EXISTS (
      SELECT 1 FROM roles r
      WHERE r.id = user_roles.role_id
        AND r.name IN ('author', 'publisher')
    )
  )
  WITH CHECK (
    public.is_admin()
    AND EXISTS (
      SELECT 1 FROM roles r
      WHERE r.id = user_roles.role_id
        AND r.name IN ('author', 'publisher')
    )
  );
