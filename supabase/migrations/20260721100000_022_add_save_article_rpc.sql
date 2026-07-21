CREATE OR REPLACE FUNCTION public.save_article_with_tags(
  p_article_id UUID,
  p_article_data JSONB,
  p_tag_ids UUID[]
) RETURNS UUID AS $$
DECLARE
  v_article_id UUID := p_article_id;
BEGIN
  -- Handle Upsert
  IF v_article_id IS NULL THEN
    INSERT INTO blog_articles (
      title, subtitle, slug, excerpt, content, featured_image, category_id,
      author_name, author_image, status, published_at, scheduled_at,
      is_featured, meta_title, meta_description, og_image, reading_time
    ) VALUES (
      p_article_data->>'title',
      p_article_data->>'subtitle',
      p_article_data->>'slug',
      p_article_data->>'excerpt',
      p_article_data->>'content',
      p_article_data->>'featured_image',
      NULLIF(p_article_data->>'category_id', '')::UUID,
      p_article_data->>'author_name',
      p_article_data->>'author_image',
      p_article_data->>'status',
      NULLIF(p_article_data->>'published_at', '')::TIMESTAMPTZ,
      NULLIF(p_article_data->>'scheduled_at', '')::TIMESTAMPTZ,
      COALESCE((p_article_data->>'is_featured')::BOOLEAN, FALSE),
      p_article_data->>'meta_title',
      p_article_data->>'meta_description',
      p_article_data->>'og_image',
      NULLIF(p_article_data->>'reading_time', '')::INT
    ) RETURNING id INTO v_article_id;
  ELSE
    UPDATE blog_articles SET
      title = p_article_data->>'title',
      subtitle = p_article_data->>'subtitle',
      slug = p_article_data->>'slug',
      excerpt = p_article_data->>'excerpt',
      content = p_article_data->>'content',
      featured_image = p_article_data->>'featured_image',
      category_id = NULLIF(p_article_data->>'category_id', '')::UUID,
      author_name = p_article_data->>'author_name',
      author_image = p_article_data->>'author_image',
      status = p_article_data->>'status',
      published_at = NULLIF(p_article_data->>'published_at', '')::TIMESTAMPTZ,
      scheduled_at = NULLIF(p_article_data->>'scheduled_at', '')::TIMESTAMPTZ,
      is_featured = COALESCE((p_article_data->>'is_featured')::BOOLEAN, FALSE),
      meta_title = p_article_data->>'meta_title',
      meta_description = p_article_data->>'meta_description',
      og_image = p_article_data->>'og_image',
      reading_time = NULLIF(p_article_data->>'reading_time', '')::INT,
      updated_at = NOW()
    WHERE id = v_article_id;
  END IF;

  -- Sync tags: Delete old, then Insert new (deduplicated)
  DELETE FROM blog_article_tags WHERE article_id = v_article_id;
  
  IF p_tag_ids IS NOT NULL AND array_length(p_tag_ids, 1) > 0 THEN
      INSERT INTO blog_article_tags (article_id, tag_id)
      SELECT DISTINCT v_article_id, tag_id
      FROM UNNEST(p_tag_ids) AS tag_id
      WHERE tag_id IS NOT NULL;
  END IF;

  RETURN v_article_id;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = pg_catalog, public;
