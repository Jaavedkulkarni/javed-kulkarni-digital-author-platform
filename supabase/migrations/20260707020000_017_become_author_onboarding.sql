-- Self-service author onboarding: atomic role assignment + author profile creation.
-- Uses SECURITY DEFINER; does not weaken RLS on user_roles or authors.

-- Lock down internal role helper — not callable from clients.
REVOKE ALL ON FUNCTION public.assign_user_role(uuid, text, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.assign_user_role(uuid, text, uuid) FROM anon;
REVOKE ALL ON FUNCTION public.assign_user_role(uuid, text, uuid) FROM authenticated;

CREATE OR REPLACE FUNCTION public.become_author(p_display_name text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_base_slug text;
  v_slug text;
  v_counter integer := 2;
  v_author_id uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF length(trim(coalesce(p_display_name, ''))) = 0 THEN
    RAISE EXCEPTION 'Display name required';
  END IF;

  IF NOT public.user_has_role('reader') THEN
    RAISE EXCEPTION 'Reader role required';
  END IF;

  IF public.user_has_role('author') THEN
    RAISE EXCEPTION 'Author role already assigned';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM authors
    WHERE profile_id = v_user_id
      AND deleted_at IS NULL
  ) THEN
    RAISE EXCEPTION 'Author profile already exists';
  END IF;

  PERFORM public.assign_user_role(v_user_id, 'author', v_user_id);

  v_base_slug := public.slugify(trim(p_display_name));
  IF v_base_slug IS NULL OR v_base_slug = '' THEN
    v_base_slug := 'author';
  END IF;

  v_slug := v_base_slug;
  WHILE EXISTS (SELECT 1 FROM authors WHERE slug = v_slug) LOOP
    v_slug := v_base_slug || '-' || v_counter::text;
    v_counter := v_counter + 1;
  END LOOP;

  INSERT INTO authors (
    profile_id,
    slug,
    display_name,
    is_verified,
    status,
    social_links
  )
  VALUES (
    v_user_id,
    v_slug,
    trim(p_display_name),
    true,
    'active',
    '{}'::jsonb
  )
  RETURNING id INTO v_author_id;

  RETURN v_author_id;
END;
$$;

COMMENT ON FUNCTION public.become_author(text) IS
  'Atomic self-service reader-to-author onboarding: assigns author role and creates authors row';

REVOKE ALL ON FUNCTION public.become_author(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.become_author(text) TO authenticated;
