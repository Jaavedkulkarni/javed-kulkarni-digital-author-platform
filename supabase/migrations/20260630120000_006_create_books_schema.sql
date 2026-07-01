-- Books CMS foundation (Sprint 1)

-- ─── book_categories ─────────────────────────────────────────────────────────

CREATE TABLE book_categories (
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

-- ─── books ───────────────────────────────────────────────────────────────────

CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  subtitle TEXT,
  slug VARCHAR(500) NOT NULL UNIQUE,
  short_description TEXT,
  full_description TEXT,
  cover_image TEXT,
  category_id UUID REFERENCES book_categories(id) ON DELETE SET NULL,
  language VARCHAR(50) DEFAULT 'मराठी',
  isbn VARCHAR(20),
  total_pages INTEGER,
  amazon_url TEXT,
  sample_pdf_url TEXT,
  publication_date DATE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  is_featured BOOLEAN DEFAULT FALSE,
  is_new_release BOOLEAN DEFAULT FALSE,
  meta_title VARCHAR(200),
  meta_description TEXT,
  og_image TEXT,
  author_name VARCHAR(100) DEFAULT 'जावेद कुलकर्णी',
  why_read TEXT,
  authors_note TEXT,
  table_of_contents JSONB DEFAULT '[]',
  related_slugs JSONB DEFAULT '[]',
  featured_highlights JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX idx_books_category ON books(category_id);
CREATE INDEX idx_books_status ON books(status);
CREATE INDEX idx_books_slug ON books(slug);
CREATE INDEX idx_books_publication_date ON books(publication_date DESC);
CREATE INDEX idx_books_is_featured ON books(is_featured);
CREATE INDEX idx_books_language ON books(language);
CREATE INDEX idx_book_categories_slug ON book_categories(slug);

-- ─── updated_at trigger ──────────────────────────────────────────────────────

CREATE TRIGGER book_categories_updated_at
  BEFORE UPDATE ON book_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE book_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "book_categories_select" ON book_categories
  FOR SELECT TO public USING (true);

CREATE POLICY "books_select" ON books
  FOR SELECT TO public USING (status = 'published');

CREATE POLICY "books_select_auth" ON books
  FOR SELECT TO authenticated USING (true);

-- Authenticated write (book_categories)
CREATE POLICY "book_categories_insert" ON book_categories
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "book_categories_update" ON book_categories
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "book_categories_delete" ON book_categories
  FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- Authenticated write (books)
CREATE POLICY "books_insert" ON books
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "books_update" ON books
  FOR UPDATE TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "books_delete" ON books
  FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- ─── seed categories ─────────────────────────────────────────────────────────

INSERT INTO book_categories (name, slug, description, icon, color, sort_order) VALUES
  ('आत्मविकास', 'atmvikas', 'आत्मविकास आणि वैयक्तिक विकास', 'lightbulb', '#b8860b', 1),
  ('पालकत्व', 'parenting', 'पालकत्व आणि कुटुंब', 'baby', '#ec4899', 2),
  ('डिजिटल जीवन', 'digital-life', 'डिजिटल युग आणि तंत्रज्ञान', 'smartphone', '#06b6d4', 3),
  ('कथा', 'katha', 'कथा आणि साहित्य', 'book-open', '#8b5cf6', 4),
  ('भयकथा', 'horror', 'भयकथा आणि रहस्य', 'ghost', '#475569', 5),
  ('विनोदी लेखन', 'humour', 'हास्य आणि विनोदी लेखन', 'smile', '#10b981', 6);

-- ─── seed books (from src/data/books.ts) ─────────────────────────────────────

INSERT INTO books (
  title, slug, short_description, full_description, cover_image, category_id,
  language, isbn, amazon_url, status, is_featured, author_name,
  why_read, authors_note, table_of_contents, related_slugs, featured_highlights, sort_order
) VALUES
(
  'आधुनिक युगातील पालकत्व आणि मुलांमधलं अंतर',
  'parenting',
  'आधुनिक काळातील पालक आणि मुलांमधील बदलते नाते, संवाद आणि समज यावर आधारित मार्गदर्शक पुस्तक. स्मार्टफोन, सोशल मीडिया आणि व्यस्त जीवनशैलीमुळे पालक आणि मुलांमधील भावनिक अंतर कसे वाढत आहे आणि ते कसे कमी करता येईल याचा व्यावहारिक आढावा.',
  NULL,
  '/covers/parenting.webp',
  (SELECT id FROM book_categories WHERE slug = 'parenting'),
  'मराठी', '978-93-344-0195-0',
  'https://www.amazon.in/%E0%A4%86%E0%A4%A7%E0%A5%81%E0%A4%A8%E0%A4%BF%E0%A4%95-%E0%A4%AF%E0%A5%81%E0%A4%97%E0%A4%BE%E0%A4%A4%E0%A5%80%E0%A4%B2-%E0%A4%AA%E0%A4%BE%E0%A4%B2%E0%A4%95%E0%A4%A4%E0%A5%8D%E0%A4%B5-%E0%A4%AE%E0%A5%81%E0%A4%B2%E0%A4%BE%E0%A4%82%E0%A4%AE%E0%A4%A7%E0%A4%B2%E0%A4%82-Marathi-ebook/dp/B0FNWGGYQX/',
  'published', false, 'जावेद कुलकर्णी',
  'जर तुम्हाला वाटत असेल की तुमचे मूल तुमच्यापासून दुरावत आहे किंवा संवाद कमी होत आहे, तर हे पुस्तक तुमच्यासाठी आहे. पालक म्हणून आपल्या मुलाशी जोडलेले राहणे, त्यांना समजून घेणे आणि आधुनिक काळातील आव्हाने सामोरे जाण्यासाठी हे पुस्तक मार्गदर्शक ठरेल.',
  'हे पुस्तक लिहिताना माझ्या मनात एकच विचार होता — प्रत्येक पालकाने आपल्या मुलाशी असलेल्या नात्याला पुन्हा एकदा जपावे. डिजिटल युगातील आव्हाने खरी आहेत, पण त्यावर मात करण्याची शक्ती प्रेम आणि संवादात आहे.',
  '["प्रकरण १: आधुनिक पालकत्वाची नवी परिभाषा","प्रकरण २: डिजिटल युगातील मुले","प्रकरण ३: संवादाचे सेतू","प्रकरण ४: भावनिक बुद्धिमत्ता आणि पालकत्व","प्रकरण ५: सीमारेषा आणि स्वातंत्र्य","प्रकरण ६: एकत्र वाढणे"]'::jsonb,
  '["6d","nirnay"]'::jsonb, '[]'::jsonb, 1
),
(
  'भूत संस्कृती – भाग १',
  'bhut-sanskriti',
  'अदृश्य जग, भावना आणि रहस्यांनी भरलेली काल्पनिक भयकथा. भूत संस्कृती ही केवळ भयकथा नाही — ती एक सांस्कृतिक प्रवास आहे जो आपल्याला आपल्या लोककथा, दंतकथा आणि अदृश्य जगाशी जोडतो.',
  NULL,
  '/covers/bhut-sanskriti-bhag-1.webp',
  (SELECT id FROM book_categories WHERE slug = 'horror'),
  'मराठी', '978-93-344-1846-0',
  'https://www.amazon.in/%E0%A4%AD%E0%A5%82%E0%A4%A4-%E0%A4%B8%E0%A4%82%E0%A4%B8%E0%A5%8D%E0%A4%95%E0%A5%83%E0%A4%A4%E0%A5%80-%E0%A4%AD%E0%A4%BE%E0%A4%97-%E0%A5%A7-Marathi-ebook/dp/B0FP5QN6YD/',
  'published', false, 'जावेद कुलकर्णी',
  'रोमांच, रहस्य आणि मराठी लोकसंस्कृतीच्या अदभुत विश्वात डुंबण्यासाठी हे पुस्तक वाचा. प्रत्येक कथा मनावर खोल ठसा उमटवते आणि रात्री झोप उडवण्याची ताकद ठेवते.',
  'भूत संस्कृती लिहिताना मी माझ्या बालपणातील आजी-आजोबांच्या गोष्टींमधून प्रेरणा घेतली. आपल्या मराठी संस्कृतीतील अदृश्य जगाच्या कल्पना आणि परंपरा जपण्याचा हा माझा प्रयत्न आहे.',
  '["कथा १: काळी वाट","कथा २: जुना वाडा","कथा ३: आरशातील सावली","कथा ४: रात्रीचा पाहुणा","कथा ५: बंद दरवाजा","कथा ६: अंधार आणि आवाज"]'::jsonb,
  '["mehandi","valan"]'::jsonb, '[]'::jsonb, 2
),
(
  'Digital Detox',
  'digital-detox-en',
  'How to become the master of technology, not its prisoner. In a world where screens dominate every moment, this book offers a practical roadmap to reclaiming your time, focus, and mental health from the grip of digital addiction.',
  NULL,
  '/covers/digital-detox-en.webp',
  (SELECT id FROM book_categories WHERE slug = 'atmvikas'),
  'English', '978-93-344-2555-0',
  'https://www.amazon.in/Digital-Detox-Become-Technology-Prisoner-ebook/dp/B0FT642GQ6/',
  'published', false, 'Javed Kulkarni',
  'If you feel overwhelmed by notifications, social media, and the endless scroll, this book will help you take back control. Practical, actionable, and deeply researched — it''s your guide to a healthier relationship with technology.',
  'I wrote this book because I lived through digital burnout myself. The strategies in this book are not theoretical — they are hard-earned lessons from my own journey to reclaim peace in a hyperconnected world.',
  '["Chapter 1: The Digital Trap","Chapter 2: Understanding Dopamine and Addiction","Chapter 3: Mapping Your Digital Life","Chapter 4: The 30-Day Detox Plan","Chapter 5: Building Healthy Digital Habits","Chapter 6: Living with Intention"]'::jsonb,
  '["digital-detox-mr","digital-prison-en","digital-kaid-mr"]'::jsonb, '[]'::jsonb, 3
),
(
  'डिजिटल डिटॉक्स',
  'digital-detox-mr',
  'डिजिटल जगातून मानसिक स्वातंत्र्याकडे नेणारा व्यावहारिक प्रवास. तंत्रज्ञानाचा गुलाम न होता त्याचा मालक कसे व्हावे हे या पुस्तकात सांगितले आहे.',
  NULL,
  '/covers/digital-detox-mr.webp',
  (SELECT id FROM book_categories WHERE slug = 'atmvikas'),
  'मराठी', '978-93-344-0462-3',
  'https://www.amazon.in/%E0%A4%A1%E0%A4%BF%E0%A4%9C%E0%A4%BF%E0%A4%9F%E0%A4%B2-%E0%A4%A1%E0%A4%BF%E0%A4%9F%E0%A5%89%E0%A4%95%E0%A5%8D%E0%A4%B8-%E0%A4%B8%E0%A5%8D%E0%A4%95%E0%A5%8D%E0%A4%B0%E0%A5%80%E0%A4%A8%E0%A4%AA%E0%A4%BE%E0%A4%B8%E0%A5%82%E0%A4%A8-%E0%A4%B8%E0%A4%82%E0%A4%A4%E0%A5%81%E0%A4%B2%E0%A4%A8%E0%A4%BE%E0%A4%9A%E0%A4%BE-Marathi-ebook/dp/B0FPG2VSPX/',
  'published', false, 'जावेद कुलकर्णी',
  'जर सोशल मीडिया, नोटिफिकेशन्स आणि स्क्रीन टाईम तुमच्या जीवनावर ताबा घेत असेल, तर हे पुस्तक तुम्हाला पुन्हा स्वतःचा ताबा मिळवण्यास मदत करेल. मराठीत उपलब्ध असलेले डिजिटल वेलनेसवरील सर्वात व्यावहारिक मार्गदर्शन.',
  'डिजिटल डिटॉक्स हे पुस्तक मी त्या क्षणी लिहायला सुरुवात केली जेव्हा मला जाणवले की माझा फोन माझ्यावर राज्य करतो आहे. हे बदलण्याचा माझा प्रवास म्हणजेच हे पुस्तक.',
  '["प्रकरण १: डिजिटल जगाचे सत्य","प्रकरण २: व्यसनाची मुळे","प्रकरण ३: तुमचे डिजिटल जीवन मोजा","प्रकरण ४: ३० दिवसांचा डिटॉक्स","प्रकरण ५: निरोगी सवयी","प्रकरण ६: जाणीवपूर्वक जगणे"]'::jsonb,
  '["digital-detox-en","digital-kaid-mr","digital-prison-en"]'::jsonb, '[]'::jsonb, 4
),
(
  'डिजिटल कैद आणि नव्या युगातील सायबर युद्ध',
  'digital-kaid-mr',
  'डिजिटल व्यसन, माहिती युद्ध आणि सायबर सुरक्षेवरील पुस्तक. आपण नकळत डिजिटल कैदेत कसे अडकत आहोत आणि या कैदेतून बाहेर पडण्याचे मार्ग काय आहेत हे या पुस्तकात विस्ताराने सांगितले आहे.',
  NULL,
  '/covers/digital-kaid-mr.webp',
  (SELECT id FROM book_categories WHERE slug = 'digital-life'),
  'मराठी', '978-93-344-0590-3',
  'https://www.amazon.in/%E0%A4%A1%E0%A4%BF%E0%A4%9C%E0%A4%BF%E0%A4%9F%E0%A4%B2-%E0%A4%95%E0%A5%88%E0%A4%A6-%E0%A4%A8%E0%A4%B5%E0%A5%8D%E0%A4%AF%E0%A4%BE-%E0%A4%AF%E0%A5%81%E0%A4%97%E0%A4%BE%E0%A4%A4%E0%A5%80%E0%A4%B2-Marathi-ebook/dp/B0FNNFSQRV/',
  'published', true, 'जावेद कुलकर्णी',
  'सोशल मीडिया कंपन्या तुमचे लक्ष, वेळ आणि डेटा कसे चोरतात हे समजून घेण्यासाठी हे पुस्तक वाचा. डिजिटल जगात सुरक्षित राहण्यासाठी आणि माहिती युद्धापासून स्वतःचे रक्षण करण्यासाठी हे अत्यंत उपयुक्त आहे.',
  'हे पुस्तक लिहिताना मला जाणवले की आपण सर्वच एका अदृश्य कैदेत आहोत — आणि आपल्याला त्याची जाणीवही नाही. हे पुस्तक त्या जाणिवेची सुरुवात आहे.',
  '["प्रकरण १: डिजिटल कैदेची ओळख","प्रकरण २: सायबर युद्धाचे स्वरूप","प्रकरण ३: माहिती युद्ध","प्रकरण ४: आपला डेटा आणि गोपनीयता","प्रकरण ५: सायबर सुरक्षा व्यावहारिक मार्गदर्शन","प्रकरण ६: डिजिटल स्वातंत्र्याचा मार्ग"]'::jsonb,
  '["digital-prison-en","digital-detox-mr","digital-detox-en"]'::jsonb,
  '["डिजिटल व्यसन","सोशल मीडिया","डेटा गोपनीयता","कृत्रिम बुद्धिमत्ता","सायबर युद्ध"]'::jsonb,
  5
),
(
  'Digital Prison and the Cyber War of the New Age',
  'digital-prison-en',
  'Understand the hidden dangers of the digital era and cyber warfare. This book exposes how social media algorithms, big tech surveillance, and information warfare are silently controlling our lives, and what we can do to reclaim our freedom.',
  NULL,
  '/covers/digital-prison-en.webp',
  (SELECT id FROM book_categories WHERE slug = 'digital-life'),
  'English', '978-93-344-2678-6',
  'https://www.amazon.in/Digital-Prison-Cyber-Warfare-New-ebook/dp/B0FTMM37Z2/',
  'published', false, 'Javed Kulkarni',
  'In an age where data is the new oil and your attention is the product, this book is essential reading. It will change how you see your phone, your social media feed, and the entire digital ecosystem you inhabit every day.',
  'I wrote this book because the digital prison is invisible — and that''s what makes it so dangerous. Once you see it, you cannot unsee it. That awakening is the first step to freedom.',
  '["Chapter 1: The Invisible Prison","Chapter 2: How Big Tech Controls You","Chapter 3: Information Warfare Explained","Chapter 4: Your Data, Their Weapon","Chapter 5: Practical Cybersecurity","Chapter 6: Reclaiming Digital Freedom"]'::jsonb,
  '["digital-kaid-mr","digital-detox-en","digital-detox-mr"]'::jsonb, '[]'::jsonb, 6
),
(
  'मेहंदी उतरल्यानंतरची गोष्ट',
  'mehandi',
  'भावना, नाती आणि आयुष्याच्या आठवणींवर आधारित कथासंग्रह. मेहंदी उतरल्यानंतर उरतं काय? या प्रश्नाचे उत्तर शोधत निघालेल्या या कथा आपल्याला नात्यांच्या खोल समुद्रात घेऊन जातात.',
  NULL,
  '/covers/mehandi-utarlyanantarchi-goshta.webp',
  (SELECT id FROM book_categories WHERE slug = 'katha'),
  'मराठी', '978-93-5813-939-6',
  'https://www.amazon.in/%E0%A4%AE%E0%A5%87%E0%A4%B9%E0%A5%87%E0%A4%82%E0%A4%A6%E0%A5%80-%E0%A4%89%E0%A4%A4%E0%A4%B0%E0%A4%B2%E0%A5%8D%E0%A4%AF%E0%A4%BE%E0%A4%A8%E0%A4%82%E0%A4%A4%E0%A4%B0%E0%A4%9A%E0%A5%80-%E0%A4%97%E0%A5%8B%E0%A4%B7%E0%A5%8D%E0%A4%9F-%E0%A4%B2%E0%A4%97%E0%A5%8D%E0%A4%A8%E0%A4%BE%E0%A4%A8%E0%A4%82%E0%A4%A4%E0%A4%B0-%E0%A4%AC%E0%A4%A6%E0%A4%B2%E0%A4%A3%E0%A4%BE%E0%A4%B1%E0%A5%8D%E0%A4%AF%E0%A4%BE-ebook/dp/B0GY85KF6B/',
  'published', false, 'जावेद कुलकर्णी',
  'जर तुम्हाला नाती, भावना आणि आयुष्याच्या वळणांवरील साहित्य आवडत असेल, तर या कथासंग्रहातील प्रत्येक कथा तुमच्या हृदयाला स्पर्श करेल. यातील पात्रे तुम्हाला तुमच्या आयुष्याचाच भाग वाटतील.',
  'या कथा मी माझ्या आयुष्यात भेटलेल्या, ऐकलेल्या आणि जाणवलेल्या क्षणांमधून जन्माला आल्या. प्रत्येक कथेमागे एक खरी भावना आहे, एक खरे नाते आहे.',
  '["कथा १: मेहंदी उतरल्यानंतरची गोष्ट","कथा २: चहाचा रंग","कथा ३: शेवटचे पत्र","कथा ४: जुनी खिडकी","कथा ५: आईचा हात","कथा ६: परतीची वाट"]'::jsonb,
  '["valan","bhut-sanskriti"]'::jsonb, '[]'::jsonb, 7
),
(
  'निर्णय घेण्याची कला',
  'nirnay',
  'भीती आणि संभ्रम दूर करून योग्य निर्णय घेण्याचे मार्गदर्शन. आयुष्यात येणाऱ्या प्रत्येक निर्णयाला सामोरे जाण्याची कला शिकवणारे हे पुस्तक आत्मविकासाच्या क्षेत्रातील एक महत्त्वाचे योगदान आहे.',
  NULL,
  '/covers/nirnay-ghenyachi-kala.webp',
  (SELECT id FROM book_categories WHERE slug = 'atmvikas'),
  'मराठी', '978-93-344-1317-5',
  'https://www.amazon.in/%E0%A4%A8%E0%A4%BF%E0%A4%B0%E0%A5%8D%E0%A4%A3%E0%A4%AF-%E0%A4%98%E0%A5%87%E0%A4%A3%E0%A5%8D%E0%A4%AF%E0%A4%BE%E0%A4%9A%E0%A5%80-%E0%A4%95%E0%A4%B2%E0%A4%BE-%E0%A4%98%E0%A5%8D%E0%A4%AF%E0%A4%BE%E0%A4%B5%E0%A5%87%E0%A4%A4-Marathi-ebook/dp/B0H2NBTL47/',
  'published', false, 'जावेद कुलकर्णी',
  'प्रत्येकजण आयुष्यात निर्णय घेताना अडखळतो. भीती, संभ्रम आणि इतरांचे मत यांच्यात अडकलेल्या प्रत्येकासाठी हे पुस्तक एक प्रकाशदीप आहे. स्पष्टतेने आणि आत्मविश्वासाने निर्णय कसे घ्यावेत हे इथे सांगितले आहे.',
  'चांगले निर्णय घेणे ही एक कला आहे — आणि प्रत्येक कलेप्रमाणे ती शिकता येते. माझ्या स्वतःच्या अनुभवातून आणि संशोधनातून तयार झालेले हे पुस्तक तुम्हाला त्या कलेचे शिक्षण देईल.',
  '["प्रकरण १: निर्णयाची भीती","प्रकरण २: माहिती आणि अंतर्ज्ञान","प्रकरण ३: पर्यायांचे मूल्यमापन","प्रकरण ४: भावना आणि तर्क","प्रकरण ५: चुकांमधून शिकणे","प्रकरण ६: आत्मविश्वासाने पुढे जाणे"]'::jsonb,
  '["6d","parenting","digital-detox-mr"]'::jsonb, '[]'::jsonb, 8
),
(
  'जीवन बदलणारे सहा आयाम (6D)',
  '6d',
  'विचार, नाती, ध्येय, भावना, आत्मशोध आणि विकास यांचा जीवनप्रवास. सहा आयामांमधून स्वतःला समजून घेणे आणि जीवन सुंदर बनवण्याचा हा एक सर्वांगीण मार्गदर्शक ग्रंथ आहे.',
  NULL,
  '/covers/saha-aayam-6d.webp',
  (SELECT id FROM book_categories WHERE slug = 'atmvikas'),
  'मराठी', '978-93-5933-125-6',
  'https://www.amazon.in/%E0%A4%9C%E0%A5%80%E0%A4%B5%E0%A4%A8-%E0%A4%AC%E0%A4%A6%E0%A4%B2%E0%A4%A3%E0%A4%BE%E0%A4%B0%E0%A5%87-%E0%A4%B8%E0%A4%B9%E0%A4%BE-%E0%A4%86%E0%A4%AF%E0%A4%BE%E0%A4%AE-%E0%A4%A4%E0%A5%81%E0%A4%AE%E0%A4%9A%E0%A5%8D%E0%A4%AF%E0%A4%BE%E0%A4%A4%E0%A5%80%E0%A4%B2-ebook/dp/B0GX2NDFPB/',
  'published', false, 'जावेद कुलकर्णी',
  'जर तुम्हाला आयुष्यात एक सर्वांगीण बदल हवा असेल — विचारात, नात्यात, ध्येयात आणि स्वतःशी — तर हे पुस्तक तुमचे साथीदार बनेल. 6D पद्धत तुम्हाला एका नव्या जीवनाकडे घेऊन जाईल.',
  '6D हे माझ्या सर्वात जवळचे पुस्तक आहे. या सहा आयामांवर काम करताना मी स्वतः बदललो — आणि हाच बदल मला तुमच्यापर्यंत पोहोचवायचा होता.',
  '["आयाम १: विचार (Dimension of Thought)","आयाम २: नाती (Dimension of Relationships)","आयाम ३: ध्येय (Dimension of Purpose)","आयाम ४: भावना (Dimension of Emotion)","आयाम ५: आत्मशोध (Dimension of Self-Discovery)","आयाम ६: विकास (Dimension of Growth)"]'::jsonb,
  '["nirnay","digital-detox-mr","parenting"]'::jsonb, '[]'::jsonb, 9
),
(
  'वळणं आणि वळवळ',
  'valan',
  'हसत-हसत विचार करायला लावणारे हलकेफुलके लेख. वळणं आणि वळवळ म्हणजे आयुष्याच्या कठीण वळणांवर हसत-खेळत पुढे जाण्याची कला. या पुस्तकातील लेख वाचताना तुम्ही कधी हसाल, कधी विचार कराल आणि कधी स्वतःलाच ओळखाल.',
  NULL,
  '/covers/valan-ani-valaval.webp',
  (SELECT id FROM book_categories WHERE slug = 'humour'),
  'मराठी', '978-93-344-1174-4',
  'https://www.amazon.in/%E0%A4%B5%E0%A4%B3%E0%A4%A3%E0%A4%82-%E0%A4%B5%E0%A4%B3%E0%A4%B5%E0%A4%B3-Marathi-Javed-Kulkarni-ebook/dp/B0FP54SS6H/',
  'published', false, 'जावेद कुलकर्णी',
  'आयुष्यात हास्याची, हलकेपणाची खूप गरज असते. वळणं आणि वळवळ वाचताना तुम्हाला हसू येईल — पण त्या हसण्यामागे एक गहन विचार लपलेला असेल. हे पुस्तक मन हलके करते आणि डोळे उघडते.',
  'विनोद हे माझे शस्त्र आहे — गंभीर गोष्टी हसत-हसत सांगण्याचे. या पुस्तकातील प्रत्येक लेखामागे एक निरीक्षण आहे, एक सत्य आहे, फक्त ते हसत सांगितले आहे.',
  '["लेख १: वळणं आणि वळवळ","लेख २: आधुनिक माणसाची गोष्ट","लेख ३: सोशल मीडियाचा सामना","लेख ४: ऑफिस जीवन","लेख ५: नातेसंबंधातील गमती","लेख ६: स्वतःशीच बोलणे"]'::jsonb,
  '["mehandi","bhut-sanskriti"]'::jsonb, '[]'::jsonb, 10
);
