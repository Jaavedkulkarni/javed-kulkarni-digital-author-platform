/*
================================================================================
AuthorOS — Enterprise Foundation (020)
Audit, activity, idempotency, rate limits, jobs, webhooks, locks, avatars,
feature flags, user security (temp password metadata)
Depends on: 019_role_assignment_management
================================================================================
*/

-- ─── Profile avatar metadata ──────────────────────────────────────────────────

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS avatar_storage_path TEXT,
  ADD COLUMN IF NOT EXISTS avatar_version INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS avatar_updated_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN profiles.avatar_storage_path IS 'Storage path in avatars bucket: {userId}/{filename}';
COMMENT ON COLUMN profiles.avatar_version IS 'Monotonic avatar version for cache busting and CDN';
COMMENT ON COLUMN profiles.avatar_updated_at IS 'Last avatar upload timestamp';

-- ─── User security (temp password framework) ──────────────────────────────────

CREATE TABLE IF NOT EXISTS user_security (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  temp_password_active BOOLEAN NOT NULL DEFAULT false,
  temp_password_expires_at TIMESTAMP WITH TIME ZONE,
  temp_password_created_at TIMESTAMP WITH TIME ZONE,
  temp_password_created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  force_password_change BOOLEAN NOT NULL DEFAULT false,
  first_login_required BOOLEAN NOT NULL DEFAULT false,
  password_rotation_due_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TRIGGER user_security_updated_at
  BEFORE UPDATE ON user_security
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE user_security IS 'Password lifecycle metadata — never stores plaintext passwords';

-- ─── Enterprise audit logs ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL,
  correlation_id UUID NOT NULL,
  trace_id UUID NOT NULL,
  span_id UUID,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_role TEXT,
  target_id UUID,
  target_type TEXT,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  before_state JSONB,
  after_state JSONB,
  ip_address INET,
  browser TEXT,
  platform TEXT,
  user_agent TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_request_id ON audit_logs(request_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_correlation_id ON audit_logs(correlation_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_trace_id ON audit_logs(trace_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target ON audit_logs(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS audit_logs_select_admin ON audit_logs;
CREATE POLICY audit_logs_select_admin ON audit_logs
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- ─── Activity timeline logs ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID,
  correlation_id UUID,
  trace_id UUID,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  target_id UUID,
  target_type TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_target ON activity_logs(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_actor_id ON activity_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON activity_logs(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS activity_logs_select_admin ON activity_logs;
CREATE POLICY activity_logs_select_admin ON activity_logs
  FOR SELECT TO authenticated
  USING (public.is_admin() OR auth.uid() = target_id);

DROP POLICY IF EXISTS activity_logs_select_own ON activity_logs;
CREATE POLICY activity_logs_select_own ON activity_logs
  FOR SELECT TO authenticated
  USING (auth.uid() = target_id);

-- ─── Feature flags (DB-backed, env-overridable at runtime) ────────────────────

CREATE TABLE IF NOT EXISTS feature_flags (
  id TEXT PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

INSERT INTO feature_flags (id, enabled, description) VALUES
  ('EnableUserInvites', false, 'User invitation workflow'),
  ('EnableAvatarUpload', true, 'Avatar upload and management'),
  ('EnableBulkImport', false, 'Bulk data import'),
  ('EnableBulkExport', false, 'Bulk data export'),
  ('EnableMarketplace', false, 'Marketplace module'),
  ('EnablePayments', false, 'Payment processing'),
  ('EnableMFA', false, 'Multi-factor authentication'),
  ('EnableAI', false, 'AI-assisted features'),
  ('EnableAuthors', true, 'Author module'),
  ('EnablePublishers', true, 'Publisher module'),
  ('EnableReaderPortal', true, 'Reader portal'),
  ('EnableNotifications', true, 'Notification engine'),
  ('EnableCMS', true, 'Content management'),
  ('EnableERP', false, 'Enterprise resource planning')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS feature_flags_select_authenticated ON feature_flags;
CREATE POLICY feature_flags_select_authenticated ON feature_flags
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS feature_flags_update_super_admin ON feature_flags;
CREATE POLICY feature_flags_update_super_admin ON feature_flags
  FOR UPDATE TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- ─── Idempotency keys ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS idempotency_keys (
  key TEXT NOT NULL,
  function_name TEXT NOT NULL,
  actor_id UUID,
  request_hash TEXT NOT NULL,
  response_status INTEGER NOT NULL,
  response_body JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (key, function_name)
);

CREATE INDEX IF NOT EXISTS idx_idempotency_keys_expires ON idempotency_keys(expires_at);

-- ─── Rate limit counters ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS rate_limit_counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope TEXT NOT NULL,
  scope_key TEXT NOT NULL,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  UNIQUE (scope, scope_key, window_start)
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_counters_lookup
  ON rate_limit_counters(scope, scope_key, window_start DESC);

-- ─── Background jobs ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS background_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL,
  queue TEXT NOT NULL DEFAULT 'default',
  payload JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'dead_letter', 'scheduled', 'cancelled')),
  priority INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  locked_at TIMESTAMP WITH TIME ZONE,
  locked_by TEXT,
  last_error TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_background_jobs_status ON background_jobs(status, priority DESC, created_at);
CREATE INDEX IF NOT EXISTS idx_background_jobs_scheduled ON background_jobs(scheduled_for)
  WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_background_jobs_queue ON background_jobs(queue, status);

CREATE TRIGGER background_jobs_updated_at
  BEFORE UPDATE ON background_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Webhook subscriptions & deliveries ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS webhook_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  events TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES webhook_subscriptions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'delivered', 'failed', 'retrying')),
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  response_status INTEGER,
  response_body TEXT,
  next_retry_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_status ON webhook_deliveries(status, next_retry_at);

-- ─── Distributed locks ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS distributed_locks (
  lock_key TEXT PRIMARY KEY,
  holder_id TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_distributed_locks_expires ON distributed_locks(expires_at);

-- ─── Avatars storage bucket ───────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS avatars_public_read ON storage.objects;
CREATE POLICY avatars_public_read ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS avatars_owner_insert ON storage.objects;
CREATE POLICY avatars_owner_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS avatars_owner_update ON storage.objects;
CREATE POLICY avatars_owner_update ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS avatars_owner_delete ON storage.objects;
CREATE POLICY avatars_owner_delete ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS avatars_admin_all ON storage.objects;
CREATE POLICY avatars_admin_all ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'avatars' AND public.is_super_admin())
  WITH CHECK (bucket_id = 'avatars' AND public.is_super_admin());

-- ─── Helper: write audit log (service role / security definer) ────────────────

CREATE OR REPLACE FUNCTION public.write_audit_log(
  p_request_id UUID,
  p_correlation_id UUID,
  p_trace_id UUID,
  p_span_id UUID,
  p_actor_id UUID,
  p_actor_role TEXT,
  p_target_id UUID,
  p_target_type TEXT,
  p_action TEXT,
  p_entity TEXT,
  p_before_state JSONB,
  p_after_state JSONB,
  p_ip_address INET,
  p_browser TEXT,
  p_platform TEXT,
  p_user_agent TEXT,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO audit_logs (
    request_id, correlation_id, trace_id, span_id,
    actor_id, actor_role, target_id, target_type,
    action, entity, before_state, after_state,
    ip_address, browser, platform, user_agent, metadata
  ) VALUES (
    p_request_id, p_correlation_id, p_trace_id, p_span_id,
    p_actor_id, p_actor_role, p_target_id, p_target_type,
    p_action, p_entity, p_before_state, p_after_state,
    p_ip_address, p_browser, p_platform, p_user_agent, COALESCE(p_metadata, '{}')
  )
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.write_audit_log FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.write_audit_log TO service_role;

-- ─── Helper: write activity log ───────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.write_activity_log(
  p_request_id UUID,
  p_correlation_id UUID,
  p_trace_id UUID,
  p_actor_id UUID,
  p_target_id UUID,
  p_target_type TEXT,
  p_activity_type TEXT,
  p_description TEXT,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO activity_logs (
    request_id, correlation_id, trace_id, actor_id,
    target_id, target_type, activity_type, description, metadata
  ) VALUES (
    p_request_id, p_correlation_id, p_trace_id, p_actor_id,
    p_target_id, p_target_type, p_activity_type, p_description, COALESCE(p_metadata, '{}')
  )
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.write_activity_log FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.write_activity_log TO service_role;

-- ─── Cleanup expired idempotency keys (callable by scheduled job) ─────────────

CREATE OR REPLACE FUNCTION public.cleanup_expired_idempotency_keys()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  DELETE FROM idempotency_keys WHERE expires_at < NOW();
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.cleanup_expired_idempotency_keys TO service_role;
