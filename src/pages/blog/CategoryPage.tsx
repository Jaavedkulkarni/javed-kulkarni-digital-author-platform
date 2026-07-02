import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import { useTheme } from '../../context/ThemeContext';
import { BlogLayout } from '../../components/blog/BlogLayout';
import { Article, PaginatedResult } from '../../types/blog';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Calendar,
  Search,
  BookOpen,
} from 'lucide-react';
import { format } from 'date-fns';

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

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { darkMode } = useTheme();
  const { categories, fetchArticlesByCategory } = useBlog();
  const [searchParams, setSearchParams] = useSearchParams();

  const category = categories.find((c) => c.slug === slug);
  const [articles, setArticles] = useState<PaginatedResult<Article>>({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    total_pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    if (slug) loadArticles();
  }, [slug, page]);

  const loadArticles = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const result = await fetchArticlesByCategory(slug, page);
      setArticles(result);
    } catch (err) {
      console.error('Error loading category articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPage = () => {
    const newPage = Math.max(1, page - 1);
    searchParams.set('page', String(newPage));
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    const newPage = Math.min(articles.total_pages, page + 1);
    searchParams.set('page', String(newPage));
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const emoji = CATEGORY_EMOJIS[slug ?? ''] || '';

  const displayedArticles = searchQuery.trim()
    ? articles.data.filter((a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.excerpt ?? '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : articles.data;

  return (
    <BlogLayout>
      {/* Category Banner */}
      <section className={`py-16 ${darkMode ? 'bg-navy-800' : 'bg-gradient-to-br from-navy-500 via-navy-600 to-navy-700'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-white/70">
              <li>
                <Link to="/blog" className="hover:text-white">ब्लॉग</Link>
              </li>
              <li><ChevronRight className="w-4 h-4" /></li>
              <li className="text-gold-400">{category?.name || 'Category'}</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            {category ? (
              <>
                <div className="flex items-center gap-4 mb-4">
                  {emoji && (
                    <span className="text-5xl">{emoji}</span>
                  )}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                    {category.name}
                  </h1>
                </div>
                {category.description && (
                  <p className="text-lg text-white/80">{category.description}</p>
                )}
              </>
            ) : (
              <>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">श्रेणी आढळली नाही</h1>
                <p className="text-white/80">ही श्रेणी उपलब्ध नाही.</p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className={`py-12 ${darkMode ? 'bg-navy-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-navy-800'}`}>
              लेख ({articles.total})
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="या श्रेणीत शोधा..."
                className={`pl-9 pr-4 py-2 rounded-lg text-sm ${
                  darkMode
                    ? 'bg-navy-800 border-navy-700 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-200 text-navy-800 placeholder-gray-400'
                } border focus:outline-none focus:border-gold-400`}
              />
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`rounded-xl p-4 ${darkMode ? 'bg-navy-800' : 'bg-gray-50'} animate-pulse`}>
                  <div className="aspect-video rounded-lg bg-gray-300 mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                    <div className="h-4 bg-gray-300 rounded w-full" />
                    <div className="h-3 bg-gray-300 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayedArticles.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                {displayedArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} darkMode={darkMode} emoji={emoji} />
                ))}
              </div>

              {!searchQuery && articles.total_pages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className={`p-2 rounded-lg transition-all ${
                      page === 1
                        ? 'opacity-50 cursor-not-allowed'
                        : darkMode
                          ? 'bg-navy-800 text-white hover:bg-navy-700'
                          : 'bg-navy-100 text-navy-700 hover:bg-navy-200'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    पृष्ठ {page} / {articles.total_pages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={page === articles.total_pages}
                    className={`p-2 rounded-lg transition-all ${
                      page === articles.total_pages
                        ? 'opacity-50 cursor-not-allowed'
                        : darkMode
                          ? 'bg-navy-800 text-white hover:bg-navy-700'
                          : 'bg-navy-100 text-navy-700 hover:bg-navy-200'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium mb-2">
                {searchQuery ? 'या शोधासाठी लेख आढळले नाही.' : 'या श्रेणीत अजून लेख नाही.'}
              </p>
              <p className="text-sm">कृपया पुन्हा भेट द्या.</p>
            </div>
          )}
        </div>
      </section>

      {/* Related Categories */}
      <section className={`py-12 ${darkMode ? 'bg-navy-800/50' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-navy-800'}`}>
            इतर श्रेणी
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories
              .filter((c) => c.slug !== slug)
              .slice(0, 7)
              .map((cat) => (
                <Link
                  key={cat.id}
                  to={`/blog/${cat.slug}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 ${
                    darkMode
                      ? 'bg-navy-800 text-gray-300 hover:bg-gold-500/10 hover:text-gold-400'
                      : 'bg-white text-navy-700 hover:bg-gold-100 shadow-sm'
                  }`}
                >
                  {CATEGORY_EMOJIS[cat.slug] || ''} {cat.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </BlogLayout>
  );
}

function ArticleCard({ article, darkMode, emoji }: { article: Article; darkMode: boolean; emoji: string }) {
  return (
    <Link to={`/blog/${article.slug}`} className="block group">
      <div className={`rounded-xl overflow-hidden h-full flex flex-col ${
        darkMode ? 'bg-navy-800' : 'bg-gray-50'
      } shadow-sm hover:shadow-xl transition-all duration-300`}>
        <div className="aspect-video bg-gradient-to-br from-navy-500 to-navy-700 flex-shrink-0">
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
        <div className="p-5 flex flex-col flex-1">
          <h3 className={`font-bold text-lg mb-1 group-hover:text-gold-500 transition-colors line-clamp-2 ${
            darkMode ? 'text-white' : 'text-navy-800'
          }`}>
            {article.title}
          </h3>
          {article.subtitle && (
            <p className={`text-sm mb-2 line-clamp-1 ${darkMode ? 'text-gold-300/70' : 'text-gold-700'}`}>
              {article.subtitle}
            </p>
          )}
          {article.excerpt && (
            <p className={`text-sm line-clamp-2 mb-3 flex-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto">
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
export default CategoryPage;
