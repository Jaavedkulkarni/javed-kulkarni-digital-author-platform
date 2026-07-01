-- Sprint 6A: Reader Identity — reader_profiles linked to auth.users

CREATE TABLE reader_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(200),
  display_name VARCHAR(100),
  mobile VARCHAR(20),
  avatar TEXT,
  language VARCHAR(50) DEFAULT 'मराठी',
  membership_status VARCHAR(50) DEFAULT 'free',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reader_profiles_membership ON reader_profiles(membership_status);

CREATE TRIGGER reader_profiles_updated_at
  BEFORE UPDATE ON reader_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE reader_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reader_profiles_select_own" ON reader_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "reader_profiles_insert_own" ON reader_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "reader_profiles_update_own" ON reader_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Auto-create profile when a reader signs up (role = reader in user metadata)
CREATE OR REPLACE FUNCTION public.handle_new_reader()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF COALESCE(NEW.raw_user_meta_data->>'role', '') = 'reader' THEN
    INSERT INTO public.reader_profiles (id, full_name, display_name, joined_at)
    VALUES (
      NEW.id,
      NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
      COALESCE(
        NULLIF(TRIM(NEW.raw_user_meta_data->>'display_name'), ''),
        NULLIF(TRIM(split_part(NEW.email, '@', 1)), '')
      ),
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_reader
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_reader();
