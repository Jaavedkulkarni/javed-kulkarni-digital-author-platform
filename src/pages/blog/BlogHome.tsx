import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import { BlogLayout } from '../../components/blog/BlogLayout';
import { Article, Category } from '../../types/blog';
import {
  Search,
  TrendingUp,
  Clock,
  Eye,
  Heart,
  ArrowRight,
  Bookmark,
  Calendar,
  X,
} from 'lucide-react';
import { format } from 'date-fns';

const ARTICLES_PER_PAGE = 9;

const CATEGORY_EMOJIS: Record<string, string> = {
  relationships: '❤️',
  parenting: '👨‍👩‍👧',
  'digital-life': '📱',
  'self-development': '🧠',
  society: '🌍',
  'book-excerpts': '📚',
  'authors-notes': '✍️',
  news: '📰',
};

export function BlogHome() {
  const {
    darkMode,
    categories,
    fetchArticles,
    fetchFeaturedArticles,
    fetchTrendingArticles,
    subscribeNewsletter,
    searchArticles,
  } = useBlog();

  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(q);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    loadData();
  }, [q, page]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (q) {
        const [results, trending] = await Promise.all([
          searchArticles(q, page),
          fetchTrendingArticles(5),
        ]);
        setLatestArticles(results.data);
        setTotalPages(results.total_pages);
        setTotalCount(results.total);
        setTrendingArticles(trending);
        setFeaturedArticle(null);
      } else {
        const [latest, featured, trending] = await Promise.all([
          fetchArticles({ sort_by: 'published_at', sort_order: 'desc', limit: ARTICLES_PER_PAGE, page }),
          page === 1 ? fetchFeaturedArticles(1) : Promise.resolve([]),
          fetchTrendingArticles(5),
        ]);
        setLatestArticles(latest.data);
        setTotalPages(latest.total_pages);
        setTotalCount(latest.total);
        setFeaturedArticle(featured[0] ?? null);
        setTrendingArticles(trending);
      }
    } catch (err) {
      console.error('Error loading articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    if (searchInput.trim()) newParams.set('q', searchInput.trim());
    setSearchParams(newParams);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const goToPage = (p: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(p));
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await subscribeNewsletter(newsletterEmail);
    setNewsletterStatus(result);
    if (result.success) setNewsletterEmail('');
  };

  return (
    <BlogLayout>
      {/* Hero Banner */}
      <section className={`py-16 ${darkMode ? 'bg-navy-800' : 'bg-gradient-to-br from-navy-500 via-navy-600 to-navy-700'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            जावेद कुलकर्णी
            <span className="text-gold-400"> ब्लॉग</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            नातेसंबंध, पालकत्व, आत्मविकास, डिजिटल जीवन आणि बऱ्याच काहीवर...
            <span className="text-gold-300"> विचार, अनुभव आणि शब्दांची सफर.</span>
          </p>
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="लेख शोधा..."
                  className="w-full pl-12 pr-10 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button type="submit" className="btn-secondary whitespace-nowrap">
                शोधा
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className={`py-6 border-b ${darkMode ? 'bg-navy-900 border-navy-800' : 'bg-white border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            <Link
              to="/blog"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 ${
                !q
                  ? darkMode
                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                    : 'bg-navy-800 text-white'
                  : darkMode
                    ? 'bg-navy-800 text-gray-300 hover:bg-gold-500/10 hover:text-gold-400'
                    : 'bg-gray-100 text-navy-700 hover:bg-gold-100 hover:text-gold-600'
              }`}
            >
              सर्व लेख
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/blog/${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 ${
                  darkMode
                    ? 'bg-navy-800 text-gray-300 hover:bg-gold-500/10 hover:text-gold-400'
                    : 'bg-gray-100 text-navy-700 hover:bg-gold-100 hover:text-gold-600'
                }`}
              >
                {CATEGORY_EMOJIS[cat.slug] || ''} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Search results header */}
      {q && (
        <div className={`py-6 ${darkMode ? 'bg-navy-900' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              "<span className={`font-semibold ${darkMode ? 'text-white' : 'text-navy-800'}`}>{q}</span>" साठी {totalCount} निकाल
            </p>
            <button
              onClick={clearSearch}
              className="inline-flex items-center gap-1 text-xs text-gold-500 hover:text-gold-400 transition-colors"
            >
              <X className="w-3 h-3" /> साफ करा
            </button>
          </div>
        </div>
      )}

      {/* Featured Article — only on page 1, no search */}
      {!q && page === 1 && featuredArticle && (
        <section className={`py-12 ${darkMode ? 'bg-navy-800/50' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-navy-800'}`}>
              <Bookmark className="w-6 h-6 text-gold-500" />
              विशेष लेख
            </h2>
            <Link to={`/blog/${featuredArticle.slug}`} className="block group">
              <div className={`rounded-2xl overflow-hidden shadow-xl ${darkMode ? 'bg-navy-800' : 'bg-white'}`}>
                <div className="grid md:grid-cols-2">
                  <div className="aspect-video md:aspect-auto min-h-[220px] bg-gradient-to-br from-navy-500 to-navy-700">
                    {featuredArticle.featured_image ? (
                      <img
                        src={featuredArticle.featured_image}
                        alt={featuredArticle.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl">{CATEGORY_EMOJIS[featuredArticle.category?.slug ?? ''] || '📝'}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    {featuredArticle.category && (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium mb-4 w-fit ${
                        darkMode ? 'bg-gold-500/20 text-gold-400' : 'bg-gold-100 text-gold-600'
                      }`}>
                        {CATEGORY_EMOJIS[featuredArticle.category.slug] || ''} {featuredArticle.category.name}
                      </span>
                    )}
                    <h3 className={`text-2xl font-bold mb-2 group-hover:text-gold-500 transition-colors leading-tight ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                      {featuredArticle.title}
                    </h3>
                    {featuredArticle.subtitle && (
                      <p className={`text-base mb-3 ${darkMode ? 'text-gold-300/80' : 'text-gold-700'}`}>
                        {featuredArticle.subtitle}
                      </p>
                    )}
                    {featuredArticle.excerpt && (
                      <p className={`mb-4 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {featuredArticle.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {featuredArticle.published_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(featuredArticle.published_at), 'd MMM yyyy')}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredArticle.reading_time} मिनिटे
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Main Content + Sidebar */}
      <section className={`py-12 ${darkMode ? 'bg-navy-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Articles Grid */}
            <div className="lg:col-span-2">
              {!q && (
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                  नवीन लेख
                </h2>
              )}
              {loading ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className={`rounded-xl overflow-hidden ${darkMode ? 'bg-navy-800' : 'bg-gray-50'} animate-pulse`}>
                      <div className="aspect-video bg-gray-300" />
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4" />
                        <div className="h-3 bg-gray-300 rounded w-full" />
                        <div className="h-3 bg-gray-300 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : latestArticles.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  {latestArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} darkMode={darkMode} />
                  ))}
                </div>
              ) : (
                <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <p className="text-xl font-medium mb-2">
                    {q ? 'कोणतेही निकाल आढळले नाही.' : 'अजून कोणतेही लेख प्रकाशित झालेले नाहीत.'}
                  </p>
                  {!q && <p className="text-sm">Admin Panel वरून नवीन लेख जोडा.</p>}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && !loading && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                        p === page
                          ? 'bg-gold-500 text-navy-900 shadow-md'
                          : darkMode
                            ? 'bg-navy-800 text-gray-300 hover:bg-navy-700 hover:text-white'
                            : 'bg-gray-100 text-navy-700 hover:bg-navy-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Trending */}
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-navy-800' : 'bg-gray-50'}`}>
                <h3 className={`text-lg font-bold mb-5 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                  <TrendingUp className="w-5 h-5 text-gold-500" />
                  सर्वाधिक वाचन
                </h3>
                {trendingArticles.length > 0 ? (
                  <div className="space-y-4">
                    {trendingArticles.map((article, i) => (
                      <Link
                        key={article.id}
                        to={`/blog/${article.slug}`}
                        className={`block group ${darkMode ? 'text-gray-300' : 'text-navy-700'}`}
                      >
                        <div className="flex gap-3">
                          <span className="text-2xl font-bold text-gold-500/40 leading-none tabular-nums">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <h4 className="font-medium text-sm leading-tight group-hover:text-gold-500 transition-colors line-clamp-2">
                              {article.title}
                            </h4>
                            <span className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <Eye className="w-3 h-3" />
                              {article.views_count}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">कोणतेही लेख नाही.</p>
                )}
              </div>

              {/* Newsletter */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600">
                <h3 className="text-lg font-bold text-navy-900 mb-1">न्यूझलेटर</h3>
                <p className="text-navy-800/80 text-sm mb-4">
                  नवीन लेख आणि अपडेट्स सरळ तुमच्या ईमेलमध्ये.
                </p>
                <form onSubmit={handleNewsletterSubmit}>
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="तुमचा ईमेल"
                    required
                    className="w-full px-4 py-2.5 rounded-lg mb-3 text-navy-800 placeholder-navy-800/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
                  />
                  <button type="submit" className="w-full py-2.5 rounded-lg bg-navy-900 text-white font-medium hover:bg-navy-800 transition-colors text-sm">
                    सब्स्क्राईब करा
                  </button>
                </form>
                {newsletterStatus && (
                  <p className={`mt-3 text-sm ${newsletterStatus.success ? 'text-navy-800' : 'text-red-800'}`}>
                    {newsletterStatus.message}
                  </p>
                )}
              </div>

              {/* All Categories */}
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-navy-800' : 'bg-gray-50'}`}>
                <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                  सर्व श्रेणी
                </h3>
                <div className="space-y-1.5">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/blog/${cat.slug}`}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        darkMode
                          ? 'text-gray-300 hover:bg-navy-700 hover:text-gold-400'
                          : 'text-navy-700 hover:bg-white hover:text-gold-600'
                      }`}
                    >
                      <span>{CATEGORY_EMOJIS[cat.slug] || ''}</span>
                      <span>{cat.name}</span>
                      <ArrowRight className="w-3 h-3 ml-auto opacity-50" />
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </BlogLayout>
  );
}

function ArticleCard({ article, darkMode }: { article: Article; darkMode: boolean }) {
  const emoji = CATEGORY_EMOJIS[article.category?.slug ?? ''] || '📝';
  return (
    <Link to={`/blog/${article.slug}`} className="block group h-full">
      <div className={`rounded-xl overflow-hidden h-full flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 ${
        darkMode ? 'bg-navy-800 hover:bg-navy-750' : 'bg-gray-50 hover:bg-white'
      }`}>
        <div className="aspect-video relative bg-gradient-to-br from-navy-500 to-navy-700 flex-shrink-0">
          {article.featured_image ? (
            <img
              src={article.featured_image}
              alt={article.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl">{emoji}</span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          {article.category && (
            <span className={`inline-flex items-center gap-1 text-xs font-medium mb-2 ${
              darkMode ? 'text-gold-400' : 'text-gold-600'
            }`}>
              {emoji} {article.category.name}
            </span>
          )}
          <h3 className={`font-bold text-base leading-snug mb-1 group-hover:text-gold-500 transition-colors line-clamp-2 ${
            darkMode ? 'text-white' : 'text-navy-800'
          }`}>
            {article.title}
          </h3>
          {article.subtitle && (
            <p className={`text-xs mb-2 line-clamp-1 ${darkMode ? 'text-gold-300/70' : 'text-gold-700'}`}>
              {article.subtitle}
            </p>
          )}
          {article.excerpt && (
            <p className={`text-sm line-clamp-2 mb-3 flex-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto">
            {article.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(new Date(article.published_at), 'd MMM yyyy')}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.reading_time} मि.
            </span>
            <span className="flex items-center gap-1 ml-auto">
              <Eye className="w-3 h-3" />
              {article.views_count}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
export default BlogHome;
