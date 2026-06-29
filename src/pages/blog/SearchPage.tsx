import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import { BlogLayout } from '../../components/blog/BlogLayout';
import { Article, PaginatedResult } from '../../types/blog';
import { Search, Clock, Eye, Calendar, BookOpen, X } from 'lucide-react';
import { format } from 'date-fns';

export function SearchPage() {
  const { darkMode, searchArticles } = useBlog();
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<PaginatedResult<Article>>({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    total_pages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q, page);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string, pageNum: number = 1) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const result = await searchArticles(searchQuery, pageNum);
      setResults(result);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchParams.set('q', query);
      searchParams.set('page', '1');
      setSearchParams(searchParams);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearchParams({});
    setResults({ data: [], total: 0, page: 1, limit: 10, total_pages: 0 });
  };

  return (
    <BlogLayout>
      {/* Search Header */}
      <section className={`py-16 ${darkMode ? 'bg-navy-800' : 'bg-gradient-to-br from-navy-500 via-navy-600 to-navy-700'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">
            लेख शोधा
          </h1>

          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="शोधा..."
              className="w-full pl-12 pr-12 py-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 text-lg"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </form>

          {searchParams.get('q') && (
            <p className="text-white/70 text-center mt-4">
              "{searchParams.get('q')}" साठी {results.total} परिणाम
            </p>
          )}
        </div>
      </section>

      {/* Results */}
      <section className={`py-12 ${darkMode ? 'bg-navy-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`rounded-xl p-4 ${darkMode ? 'bg-navy-800' : 'bg-gray-50'} animate-pulse`}>
                  <div className="flex gap-4">
                    <div className="w-32 h-24 rounded-lg bg-gray-300" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4" />
                      <div className="h-4 bg-gray-300 rounded w-full" />
                      <div className="h-3 bg-gray-300 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : results.data.length > 0 ? (
            <div className="space-y-6">
              {results.data.map((article) => (
                <Link
                  key={article.id}
                  to={`/blog/${article.slug}`}
                  className={`block group rounded-xl overflow-hidden ${
                    darkMode ? 'bg-navy-800' : 'bg-gray-50'
                  } hover:shadow-lg transition-all`}
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-48 h-32 sm:h-auto flex-shrink-0 bg-gradient-to-br from-navy-500 to-navy-700 flex items-center justify-center">
                      {article.featured_image ? (
                        <img
                          src={article.featured_image}
                          alt={article.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-white/50">Image</div>
                      )}
                    </div>
                    <div className="p-4 flex-1">
                      {article.category && (
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${
                          darkMode ? 'bg-gold-500/20 text-gold-400' : 'bg-gold-100 text-gold-600'
                        }`}>
                          {article.category.name}
                        </span>
                      )}
                      <h3 className={`font-semibold mb-2 group-hover:text-gold-500 transition-colors ${
                        darkMode ? 'text-white' : 'text-navy-800'
                      }`}>
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {article.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {article.published_at && format(new Date(article.published_at), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.reading_time} मि.
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.views_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : searchParams.get('q') ? (
            <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium mb-2">कोणतेही परिणाम नाही</p>
              <p className="text-sm">भिन्न शब्दांसह पुन्हा शोधा</p>
            </div>
          ) : (
            <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium mb-2">लेख शोधा</p>
              <p className="text-sm">शब्द टाका आणि शोधा क्लिक करा</p>
            </div>
          )}
        </div>
      </section>
    </BlogLayout>
  );
}
