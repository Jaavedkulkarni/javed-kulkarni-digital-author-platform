-- Create blog categories table
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog articles table
CREATE TABLE blog_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  author_name VARCHAR(100) DEFAULT 'जावेद कुलकर्णी',
  author_image TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  reading_time INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  meta_title VARCHAR(200),
  meta_description TEXT,
  og_image TEXT,
  table_of_contents JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog tags table
CREATE TABLE blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create article tags junction table
CREATE TABLE blog_article_tags (
  article_id UUID REFERENCES blog_articles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- Create newsletter subscribers table
CREATE TABLE blog_newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Create blog comments table
CREATE TABLE blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES blog_articles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam', 'trash')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create article likes table
CREATE TABLE blog_article_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES blog_articles(id) ON DELETE CASCADE,
  user_ip VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(article_id, user_ip)
);

-- Create article bookmarks table
CREATE TABLE blog_article_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES blog_articles(id) ON DELETE CASCADE,
  user_ip VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(article_id, user_ip)
);

-- Create indexes for better performance
CREATE INDEX idx_articles_category ON blog_articles(category_id);
CREATE INDEX idx_articles_status ON blog_articles(status);
CREATE INDEX idx_articles_published ON blog_articles(published_at DESC);
CREATE INDEX idx_articles_slug ON blog_articles(slug);
CREATE INDEX idx_comments_article ON blog_comments(article_id);
CREATE INDEX idx_tags_slug ON blog_tags(slug);
CREATE INDEX idx_categories_slug ON blog_categories(slug);

-- Enable RLS
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_article_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_article_bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "categories_select" ON blog_categories FOR SELECT TO public USING (true);
CREATE POLICY "categories_insert" ON blog_categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "categories_update" ON blog_categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "categories_delete" ON blog_categories FOR DELETE TO authenticated USING (true);

-- RLS Policies for articles (public read published, auth manage all)
CREATE POLICY "articles_select" ON blog_articles FOR SELECT TO public USING (status = 'published');
CREATE POLICY "articles_select_auth" ON blog_articles FOR SELECT TO authenticated USING (true);
CREATE POLICY "articles_insert" ON blog_articles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "articles_update" ON blog_articles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "articles_delete" ON blog_articles FOR DELETE TO authenticated USING (true);

-- RLS Policies for tags (public read)
CREATE POLICY "tags_select" ON blog_tags FOR SELECT TO public USING (true);
CREATE POLICY "tags_insert" ON blog_tags FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "tags_update" ON blog_tags FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "tags_delete" ON blog_tags FOR DELETE TO authenticated USING (true);

-- RLS Policies for article_tags (public read)
CREATE POLICY "article_tags_select" ON blog_article_tags FOR SELECT TO public USING (true);
CREATE POLICY "article_tags_insert" ON blog_article_tags FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "article_tags_delete" ON blog_article_tags FOR DELETE TO authenticated USING (true);

-- RLS Policies for newsletter (public insert, auth manage)
CREATE POLICY "newsletter_select" ON blog_newsletter_subscribers FOR SELECT TO authenticated USING (true);
CREATE POLICY "newsletter_insert" ON blog_newsletter_subscribers FOR INSERT TO public WITH CHECK (true);

-- RLS Policies for comments (public insert approved read, auth manage)
CREATE POLICY "comments_select" ON blog_comments FOR SELECT TO public USING (status = 'approved');
CREATE POLICY "comments_select_auth" ON blog_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "comments_insert" ON blog_comments FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "comments_update" ON blog_comments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "comments_delete" ON blog_comments FOR DELETE TO authenticated USING (true);

-- RLS Policies for likes (public read/insert)
CREATE POLICY "likes_select" ON blog_article_likes FOR SELECT TO public USING (true);
CREATE POLICY "likes_insert" ON blog_article_likes FOR INSERT TO public WITH CHECK (true);

-- RLS Policies for bookmarks (public read/insert/delete)
CREATE POLICY "bookmarks_select" ON blog_article_bookmarks FOR SELECT TO public USING (true);
CREATE POLICY "bookmarks_insert" ON blog_article_bookmarks FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "bookmarks_delete" ON blog_article_bookmarks FOR DELETE TO public USING (true);

-- Insert default categories
INSERT INTO blog_categories (name, slug, description, icon, color, sort_order) VALUES
('नातेसंबंध', 'relationships', 'नातेसंबंधांबद्दल लेख', 'Heart', 'rose', 1),
('पालकत्व', 'parenting', 'पालकत्व आणि मुलांचे संगोपन', 'Users', 'pink', 2),
('डिजिटल जीवन', 'digital-life', 'डिजिटल युगातील आव्हाने आणि उकल', 'MonitorSmartphone', 'blue', 3),
('आत्मविकास', 'self-development', 'व्यक्तिगत विकास आणि स्व-शोध', 'Lightbulb', 'amber', 4),
('समाज आणि वास्तव', 'society', 'सामाजिक विषय आणि वास्तव', 'Globe', 'teal', 5),
('पुस्तकांमधील उतारे', 'book-excerpts', 'पुस्तकांतील महत्त्वाचे उतारे', 'BookOpen', 'violet', 6),
('लेखकाच्या टिपण्या', 'authors-notes', 'लेखकाच्या वैयक्तिक टिपण्या', 'PenTool', 'emerald', 7),
('मुलाखती', 'interviews', 'विविध व्यक्तींच्या मुलाखती', 'Mic', 'orange', 8),
('नवीन प्रकाशने', 'news', 'नवीन पुस्तके आणि प्रकाशने', 'Newspaper', 'cyan', 9);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON blog_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON blog_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate reading time
CREATE OR REPLACE FUNCTION calculate_reading_time(content TEXT)
RETURNS INTEGER AS $$
DECLARE
    word_count INTEGER;
BEGIN
    word_count := array_length(regexp_split_to_array(content, '\s+'), 1);
    RETURN GREATEST(1, CEIL(word_count::FLOAT / 200));
END;
$$ language 'plpgsql';

-- Create trigger for reading time
CREATE OR REPLACE FUNCTION update_reading_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.reading_time := calculate_reading_time(NEW.content);
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_reading_time BEFORE INSERT OR UPDATE ON blog_articles
    FOR EACH ROW EXECUTE FUNCTION update_reading_time();