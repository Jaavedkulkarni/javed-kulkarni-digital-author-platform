/*
================================================================================
AuthorOS — Database Foundation (015)
Platform: notifications, user_settings, analytics_events
================================================================================
*/

-- ─── notifications ───────────────────────────────────────────────────────────

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category public.notification_category NOT NULL DEFAULT 'system',
  channel public.notification_channel NOT NULL DEFAULT 'in_app',
  title VARCHAR(300) NOT NULL,
  body TEXT NOT NULL,
  action_url TEXT,
  action_label VARCHAR(100),
  reference_type VARCHAR(50),
  reference_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  archived_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE notifications IS 'In-app and cross-channel notification records';
COMMENT ON COLUMN notifications.reference_type IS 'Polymorphic ref: order, book, membership, etc.';
COMMENT ON COLUMN notifications.reference_id IS 'UUID of referenced entity';

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, created_at DESC)
  WHERE is_read = FALSE AND deleted_at IS NULL AND is_archived = FALSE;
CREATE INDEX idx_notifications_category ON notifications(user_id, category);
CREATE INDEX idx_notifications_reference ON notifications(reference_type, reference_id);

CREATE TRIGGER notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── user_settings ───────────────────────────────────────────────────────────

CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  appearance JSONB NOT NULL DEFAULT '{
    "theme": "system",
    "accentColor": "gold",
    "fontSize": "medium"
  }'::jsonb,
  reading JSONB NOT NULL DEFAULT '{
    "readingMode": "scroll",
    "pageAnimation": "on",
    "autoBookmark": true,
    "readingProgress": true,
    "showCompletedBooks": true,
    "openLastPageAutomatically": true
  }'::jsonb,
  notifications JSONB NOT NULL DEFAULT '{
    "orders": true,
    "membership": true,
    "reading": true,
    "promotions": false,
    "weeklySummary": true,
    "push": true
  }'::jsonb,
  language JSONB NOT NULL DEFAULT '{
    "preferredLanguage": "Marathi",
    "contentLanguage": "Marathi",
    "dateFormat": "DD MMM YYYY",
    "timeFormat": "12-hour"
  }'::jsonb,
  downloads JSONB NOT NULL DEFAULT '{
    "wifiOnly": true,
    "autoDeleteFinished": false
  }'::jsonb,
  privacy JSONB NOT NULL DEFAULT '{
    "readingHistory": true,
    "shareActivity": false,
    "recommendations": true,
    "analytics": true
  }'::jsonb,
  version INTEGER NOT NULL DEFAULT 1,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT user_settings_user_unique UNIQUE (user_id)
);

COMMENT ON TABLE user_settings IS 'Per-user settings (mirrors Reader Settings module structure)';
COMMENT ON COLUMN user_settings.appearance IS 'Theme, accent, font size preferences';
COMMENT ON COLUMN user_settings.version IS 'Schema version for settings migration';

CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

CREATE TRIGGER user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION public.ensure_user_settings(target_user_id UUID)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE settings_id UUID;
BEGIN
  INSERT INTO user_settings (user_id) VALUES (target_user_id)
  ON CONFLICT (user_id) DO NOTHING
  RETURNING id INTO settings_id;

  IF settings_id IS NULL THEN
    SELECT id INTO settings_id FROM user_settings WHERE user_id = target_user_id;
  END IF;

  RETURN settings_id;
END;
$$;

COMMENT ON FUNCTION public.ensure_user_settings IS 'Idempotently create default settings for a user';

-- ─── analytics_events ──────────────────────────────────────────────────────────

CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id VARCHAR(100),
  event_type public.analytics_event_type NOT NULL,
  event_name VARCHAR(200),
  book_id UUID REFERENCES books(id) ON DELETE SET NULL,
  chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
  page_path TEXT,
  properties JSONB NOT NULL DEFAULT '{}'::jsonb,
  device_type VARCHAR(50),
  user_agent TEXT,
  ip_hash VARCHAR(64),
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE analytics_events IS 'Append-only analytics event log';
COMMENT ON COLUMN analytics_events.user_id IS 'NULL for anonymous events';
COMMENT ON COLUMN analytics_events.ip_hash IS 'Hashed IP for privacy compliance';
COMMENT ON COLUMN analytics_events.properties IS 'Flexible event payload (search query, duration, etc.)';

CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_book_id ON analytics_events(book_id);
CREATE INDEX idx_analytics_events_occurred_at ON analytics_events(occurred_at DESC);
CREATE INDEX idx_analytics_events_session ON analytics_events(session_id);

-- ─── RLS: notifications ──────────────────────────────────────────────────────

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select_own" ON notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND public.is_not_deleted(deleted_at));

CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "notifications_insert_system" ON notifications FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR user_id = auth.uid());

CREATE POLICY "notifications_delete_own" ON notifications FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ─── RLS: user_settings ──────────────────────────────────────────────────────

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_settings_select_own" ON user_settings FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND public.is_not_deleted(deleted_at));

CREATE POLICY "user_settings_insert_own" ON user_settings FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_settings_update_own" ON user_settings FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_settings_admin" ON user_settings FOR SELECT TO authenticated
  USING (public.is_admin());

-- ─── RLS: analytics_events ───────────────────────────────────────────────────

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "analytics_insert_authenticated" ON analytics_events FOR INSERT TO authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "analytics_insert_anon" ON analytics_events FOR INSERT TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY "analytics_select_own" ON analytics_events FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "analytics_select_admin" ON analytics_events FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "analytics_select_author" ON analytics_events FOR SELECT TO authenticated
  USING (
    public.is_author()
    AND book_id IS NOT NULL
    AND public.author_owns_book(book_id)
  );

-- ─── Auto-create user_settings on profile creation ───────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user_settings()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM public.ensure_user_settings(NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created_settings
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_settings();

-- Backfill settings for existing profiles
INSERT INTO user_settings (user_id)
SELECT p.id FROM profiles p
ON CONFLICT (user_id) DO NOTHING;
