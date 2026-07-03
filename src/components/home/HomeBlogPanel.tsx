import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Eye, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { useBlog } from '../../context/BlogContext';
import type { Article } from '../../types/blog';
import { HomeSectionHeader } from './HomeSectionHeader';

const CATEGORY_EMOJIS: Record<string, string> = {
  'naty-sambandh': '❤️',
  parenting: '👨‍👩‍👧',
  'digital-life': '📱',
  atmvikas: '💡',
  samaj: '🌍',
};

interface HomeBlogPanelProps {
  darkMode: boolean;
  variant: 'latest' | 'trending';
  limit?: number;
  compact?: boolean;
}

function ArticleListItem({ article, darkMode, index }: { article: Article; darkMode: boolean; index?: number }) {
  return (
    <Link
      to={`/blog/${article.slug}`}
      className={`block group rounded-xl p-3 transition-colors ${
        darkMode ? 'hover:bg-navy-700/60' : 'hover:bg-white'
      }`}
    >
      <div className="flex gap-3">
        {index !== undefined && (
          <span className="text-xl font-bold text-gold-500/40 leading-none tabular-nums">{String(index + 1).padStart(2, '0')}</span>
        )}
        <div className="min-w-0 flex-1">
          <h4
            className={`font-medium text-sm leading-snug line-clamp-2 group-hover:text-gold-500 transition-colors ${
              darkMode ? 'text-white' : 'text-navy-800'
            }`}
          >
            {article.title}
          </h4>
          <span className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <Eye className="w-3 h-3" />
            {article.views_count}
          </span>
        </div>
      </div>
    </Link>
  );
}

function ArticleCard({ article, darkMode }: { article: Article; darkMode: boolean }) {
  const emoji = CATEGORY_EMOJIS[article.category?.slug ?? ''] || '📝';
  return (
    <Link to={`/blog/${article.slug}`} className="block group h-full">
      <div
        className={`rounded-xl overflow-hidden h-full flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 ${
          darkMode ? 'bg-navy-800 hover:bg-navy-750' : 'bg-gray-50 hover:bg-white'
        }`}
      >
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
            <span className={`inline-flex items-center gap-1 text-xs font-medium mb-2 ${darkMode ? 'text-gold-400' : 'text-gold-600'}`}>
              {emoji} {article.category.name}
            </span>
          )}
          <h3
            className={`font-bold text-base leading-snug mb-1 group-hover:text-gold-500 transition-colors line-clamp-2 ${
              darkMode ? 'text-white' : 'text-navy-800'
            }`}
          >
            {article.title}
          </h3>
          {article.excerpt && (
            <p className={`text-sm line-clamp-2 mb-3 flex-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{article.excerpt}</p>
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
          </div>
        </div>
      </div>
    </Link>
  );
}

export function HomeBlogPanel({ darkMode, variant, limit = 4, compact = false }: HomeBlogPanelProps) {
  const { fetchArticles, fetchTrendingArticles } = useBlog();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const load = async () => {
      if (variant === 'trending') {
        const data = await fetchTrendingArticles(limit);
        if (!cancelled) setArticles(data);
      } else {
        const { data } = await fetchArticles({ limit, sort_by: 'published_at', sort_order: 'desc' });
        if (!cancelled) setArticles(data);
      }
      if (!cancelled) setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [fetchArticles, fetchTrendingArticles, limit, variant]);

  const titleMr = variant === 'trending' ? 'सर्वाधिक वाचन' : 'ब्लॉग आणि लेख';
  const title = variant === 'trending' ? 'Most Viewed Blog Posts' : 'Blogs & Articles';

  if (loading && !compact) {
    return (
      <section id={variant === 'latest' ? 'blog-link' : undefined} className={`py-20 lg:py-28 ${darkMode ? 'bg-navy-800/50' : 'bg-gray-50'}`}>
        <div className="section-container">
          <HomeSectionHeader titleMr={titleMr} subtitle={title} darkMode={darkMode} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`h-64 rounded-xl animate-pulse ${darkMode ? 'bg-navy-800' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (loading && compact) {
    return (
      <div className={`rounded-2xl p-6 ${darkMode ? 'bg-navy-800' : 'bg-white'}`}>
        <div className="h-6 w-40 bg-gray-300/30 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-300/20 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`rounded-2xl p-5 ${darkMode ? 'bg-navy-800 border border-navy-700' : 'bg-white shadow-lg border border-gray-100'}`}>
        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-navy-800'}`}>
          {variant === 'trending' && <TrendingUp className="w-5 h-5 text-gold-500" />}
          {titleMr}
        </h3>
        {articles.length > 0 ? (
          <div className="space-y-1">
            {articles.map((article, i) => (
              <ArticleListItem key={article.id} article={article} darkMode={darkMode} index={variant === 'trending' ? i : undefined} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">कोणतेही लेख नाही.</p>
        )}
        <Link to="/blog" className="inline-block mt-4 text-sm text-gold-500 hover:text-gold-400">
          सर्व लेख पहा →
        </Link>
      </div>
    );
  }

  return (
    <section id={variant === 'latest' ? 'blog-link' : undefined} className={`py-20 lg:py-28 ${darkMode ? 'bg-navy-800/50' : 'bg-gray-50'}`}>
      <div className="section-container">
        <HomeSectionHeader titleMr={titleMr} subtitle={title} darkMode={darkMode} />
        {articles.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} darkMode={darkMode} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/blog"
                className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${darkMode ? 'text-gold-400 hover:text-gold-300' : 'text-gold-600 hover:text-gold-700'}`}
              >
                सर्व लेख पहा
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        ) : (
          <p className={`text-center text-sm sm:text-base py-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            अजून कोणतेही लेख प्रकाशित झालेले नाहीत.
          </p>
        )}
      </div>
    </section>
  );
}

export default HomeBlogPanel;
