import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import { BlogLayout } from '../../components/blog/BlogLayout';
import { Article, Comment } from '../../types/blog';
import {
  ChevronRight,
  Calendar,
  Clock,
  Eye,
  Heart,
  Bookmark,
  Facebook,
  Linkedin,
  MessageCircle,
  Send,
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Instagram,
  RefreshCw,
} from 'lucide-react';
import { format } from 'date-fns';
import { INSTAGRAM_AUTHOR_URL } from '../../data/books';


export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { darkMode, categories, fetchArticleBySlug, fetchComments, addComment, fetchAdjacentArticles, fetchRelatedArticles } = useBlog();

  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [adjacent, setAdjacent] = useState<{ prev: Article | null; next: Article | null }>({ prev: null, next: null });
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slug) {
      loadArticle();
    }
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const content = contentRef.current;
      const scrollTop = window.scrollY;
      const docHeight = content.scrollHeight - window.innerHeight;
      const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadArticle = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const data = await fetchArticleBySlug(slug);
      setArticle(data);
      if (data) {
        const [articleComments, adj, related] = await Promise.all([
          fetchComments(data.id),
          data.published_at ? fetchAdjacentArticles(data.id, data.published_at) : Promise.resolve({ prev: null, next: null }),
          fetchRelatedArticles(data.id, data.category_id, 3),
        ]);
        setComments(articleComments);
        setAdjacent(adj);
        setRelatedArticles(related);
      }
    } catch (err) {
      console.error('Error loading article:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    if (!article) return;
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(article.title);
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      x: `https://x.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${title}%20${url}`,
    };
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article || !commentForm.message.trim()) return;

    setCommentSubmitting(true);
    try {
      const newComment = await addComment(
        article.id,
        commentForm.name,
        commentForm.email,
        commentForm.message
      );
      if (newComment) {
        setCommentForm({ name: '', email: '', message: '' });
        alert('तुमचा टिप्पणी यशस्वीरित्या पाठवला. अप्रूवल नंतर दिसेल.');
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
    } finally {
      setCommentSubmitting(false);
    }
  };

  if (loading) {
    return (
      <BlogLayout>
        <div className={`min-h-[60vh] flex items-center justify-center ${darkMode ? 'bg-navy-900' : 'bg-white'}`}>
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>लोड करत आहे...</p>
          </div>
        </div>
      </BlogLayout>
    );
  }

  if (!article) {
    return (
      <BlogLayout>
        <div className={`min-h-[60vh] flex items-center justify-center ${darkMode ? 'bg-navy-900' : 'bg-white'}`}>
          <div className="text-center">
            <h1 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-navy-800'}`}>
              लेख आढळला नाही
            </h1>
            <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              हा लेख उपलब्ध नाही किंवा हटवला गेला आहे.
            </p>
            <Link to="/blog" className="btn-primary">
              ब्लॉग होम
            </Link>
          </div>
        </div>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-[60]">
        <div
          className="h-full bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-100"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Article Header */}
      <header className={`py-12 ${darkMode ? 'bg-navy-800' : 'bg-gradient-to-br from-navy-500 via-navy-600 to-navy-700'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-white/70 overflow-x-auto">
              <li>
                <Link to="/blog" className="hover:text-white">ब्लॉग</Link>
              </li>
              <li><ChevronRight className="w-4 h-4 flex-shrink-0" /></li>
              {article.category && (
                <>
                  <li>
                    <Link to={`/blog/${article.category.slug}`} className="hover:text-white">
                      {article.category.name}
                    </Link>
                  </li>
                  <li><ChevronRight className="w-4 h-4 flex-shrink-0" /></li>
                </>
              )}
              <li className="text-gold-400 truncate max-w-[200px]">{article.title}</li>
            </ol>
          </nav>

          {/* Category Badge */}
          {article.category && (
            <Link
              to={`/blog/${article.category.slug}`}
              className="inline-block px-3 py-1 rounded-full bg-gold-400/20 text-gold-400 text-sm font-medium mb-4 hover:bg-gold-400/30"
            >
              {article.category.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
            {article.title}
          </h1>

          {/* Subtitle */}
          {article.subtitle && (
            <p className="text-lg text-gold-200/90 mb-4 font-medium">
              {article.subtitle}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gold-400 flex items-center justify-center text-navy-900 font-bold">
                {article.author_name.charAt(0)}
              </div>
              <span>{article.author_name}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {article.published_at && format(new Date(article.published_at), 'MMMM d, yyyy')}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {article.reading_time} मिनिटे वाचन
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {article.views_count === 1 ? `१ वेळा वाचला` : `${article.views_count} वेळा वाचला`}
            </span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10`}>
        <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
          {article.featured_image ? (
            <img
              src={article.featured_image}
              alt={article.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full flex flex-col items-center justify-center gap-4 ${
              darkMode ? 'bg-navy-800' : 'bg-gradient-to-br from-navy-600 via-navy-700 to-navy-800'
            }`}>
              <div className="w-16 h-16 rounded-full bg-gold-400/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-white/60 text-sm font-medium">{article.author_name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Article Content */}
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${darkMode ? 'bg-navy-900' : 'bg-white'}`}>
        <div className="grid lg:grid-cols-[1fr_250px] gap-12">
          {/* Main Content */}
          <div>
            <div
              ref={contentRef}
              className={`prose max-w-none ${
                darkMode ? 'prose-invert' : 'prose-navy'
              }`}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-navy-700">
                <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  टॅग्स
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className={`px-3 py-1 rounded-full text-sm ${
                        darkMode
                          ? 'bg-navy-800 text-gray-300'
                          : 'bg-gray-100 text-navy-700'
                      }`}
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className={`mt-8 pt-8 border-t flex flex-wrap items-center gap-4 ${
              darkMode ? 'border-navy-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    liked
                      ? 'bg-red-500 text-white'
                      : darkMode
                        ? 'bg-navy-800 text-gray-300 hover:bg-navy-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  <span>{article.likes_count + (liked ? 1 : 0)}</span>
                </button>

                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    bookmarked
                      ? 'bg-gold-500 text-navy-900'
                      : darkMode
                        ? 'bg-navy-800 text-gray-300 hover:bg-navy-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Bookmark className="w-5 h-5" />
                  <span className="hidden sm:inline">Save</span>
                </button>
              </div>

              <div className="flex-1" />

              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Share:
                </span>
                <button
                  onClick={() => handleShare('facebook')}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode
                      ? 'bg-navy-800 text-gray-300 hover:bg-[#1877f2] hover:text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-[#1877f2] hover:text-white'
                  }`}
                  title="Share on Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('x')}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode
                      ? 'bg-navy-800 text-gray-300 hover:bg-black hover:text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-black hover:text-white'
                  }`}
                  title="Share on X"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode
                      ? 'bg-navy-800 text-gray-300 hover:bg-[#0077b5] hover:text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-[#0077b5] hover:text-white'
                  }`}
                  title="Share on LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode
                      ? 'bg-navy-800 text-gray-300 hover:bg-[#25d366] hover:text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-[#25d366] hover:text-white'
                  }`}
                  title="Share on WhatsApp"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </button>
                <button
                  onClick={handleCopyLink}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode
                      ? 'bg-navy-800 text-gray-300 hover:bg-navy-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title="Copy link"
                >
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Instagram Follow */}
            <div className={`mt-6 flex items-center justify-between gap-4 px-5 py-4 rounded-xl border ${
              darkMode ? 'bg-navy-800 border-navy-700' : 'bg-gradient-to-r from-rose-50 to-orange-50 border-rose-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 via-fuchsia-500 to-orange-400 flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                    Follow the Author on Instagram
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    @authorjavedkulkarni
                  </p>
                </div>
              </div>
              <a
                href={INSTAGRAM_AUTHOR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-rose-500 via-fuchsia-500 to-orange-400 hover:opacity-90 transition-opacity shadow-sm"
              >
                <Instagram className="w-4 h-4" />
                Follow
              </a>
            </div>

            {/* Prev / Next Navigation */}
            {(adjacent.prev || adjacent.next) && (
              <div className={`mt-10 pt-8 border-t grid sm:grid-cols-2 gap-4 ${darkMode ? 'border-navy-700' : 'border-gray-200'}`}>
                {adjacent.prev ? (
                  <Link
                    to={`/blog/${adjacent.prev.slug}`}
                    className={`group flex flex-col gap-1 p-4 rounded-xl border transition-all hover:border-gold-400 ${
                      darkMode ? 'bg-navy-800 border-navy-700' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <span className={`flex items-center gap-1 text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <ArrowLeft className="w-3 h-3" /> मागील लेख
                    </span>
                    <span className={`text-sm font-semibold line-clamp-2 group-hover:text-gold-500 transition-colors ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                      {adjacent.prev.title}
                    </span>
                  </Link>
                ) : <div />}
                {adjacent.next ? (
                  <Link
                    to={`/blog/${adjacent.next.slug}`}
                    className={`group flex flex-col gap-1 p-4 rounded-xl border text-right transition-all hover:border-gold-400 ${
                      darkMode ? 'bg-navy-800 border-navy-700' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <span className={`flex items-center gap-1 justify-end text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      पुढील लेख <ArrowRight className="w-3 h-3" />
                    </span>
                    <span className={`text-sm font-semibold line-clamp-2 group-hover:text-gold-500 transition-colors ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                      {adjacent.next.title}
                    </span>
                  </Link>
                ) : <div />}
              </div>
            )}

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className={`mt-10 pt-8 border-t ${darkMode ? 'border-navy-700' : 'border-gray-200'}`}>
                <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                  <RefreshCw className="w-5 h-5 text-gold-500" />
                  तुम्हाला हेही आवडू शकते
                </h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {relatedArticles.map((rel) => (
                    <Link
                      key={rel.id}
                      to={`/blog/${rel.slug}`}
                      className={`group block rounded-xl overflow-hidden transition-all hover:shadow-lg ${
                        darkMode ? 'bg-navy-800' : 'bg-gray-50'
                      }`}
                    >
                      <div className="aspect-video bg-gradient-to-br from-navy-500 to-navy-700">
                        {rel.featured_image ? (
                          <img src={rel.featured_image} alt={rel.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className={`text-sm font-semibold line-clamp-2 group-hover:text-gold-500 transition-colors ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                          {rel.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <div className={`mt-12 pt-12 border-t ${darkMode ? 'border-navy-700' : 'border-gray-200'}`}>
              <h2 className={`text-xl font-bold mb-8 flex items-center gap-2 ${
                darkMode ? 'text-white' : 'text-navy-800'
              }`}>
                <MessageCircle className="w-6 h-6 text-gold-500" />
                टिप्पण्या ({article.comments_count})
              </h2>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className={`p-6 rounded-xl mb-8 ${
                darkMode ? 'bg-navy-800' : 'bg-gray-50'
              }`}>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={commentForm.name}
                    onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                    placeholder="तुमचे नाव"
                    required
                    className={`w-full px-4 py-3 rounded-lg ${
                      darkMode
                        ? 'bg-navy-700 border-navy-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-200 text-navy-800 placeholder-gray-400'
                    } border focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20`}
                  />
                  <input
                    type="email"
                    value={commentForm.email}
                    onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                    placeholder="ईमेल"
                    required
                    className={`w-full px-4 py-3 rounded-lg ${
                      darkMode
                        ? 'bg-navy-700 border-navy-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-200 text-navy-800 placeholder-gray-400'
                    } border focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20`}
                  />
                </div>
                <textarea
                  value={commentForm.message}
                  onChange={(e) => setCommentForm({ ...commentForm, message: e.target.value })}
                  placeholder="तुमचा टिप्पणी..."
                  rows={4}
                  required
                  className={`w-full px-4 py-3 rounded-lg mb-4 resize-none ${
                    darkMode
                      ? 'bg-navy-700 border-navy-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-200 text-navy-800 placeholder-gray-400'
                  } border focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20`}
                />
                <button
                  type="submit"
                  disabled={commentSubmitting}
                  className="btn-primary disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {commentSubmitting ? 'पाठवत आहे...' : 'टिप्पणी पाठवा'}
                </button>
              </form>

              {/* Comments List */}
              {comments.length > 0 ? (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-5 rounded-xl ${darkMode ? 'bg-navy-800' : 'bg-gray-50'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                          darkMode ? 'bg-gold-500/20 text-gold-400' : 'bg-gold-100 text-gold-600'
                        }`}>
                          {comment.author_name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                              {comment.author_name}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {format(new Date(comment.created_at), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {comment.content}
                          </p>
                        </div>
                      </div>
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 ml-12 space-y-4">
                          {comment.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className={`p-4 rounded-lg ${darkMode ? 'bg-navy-700' : 'bg-white'}`}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                  darkMode ? 'bg-gold-500/20 text-gold-400' : 'bg-gold-100 text-gold-600'
                                }`}>
                                  {reply.author_name.charAt(0)}
                                </div>
                                <div>
                                  <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                                    {reply.author_name}
                                  </h4>
                                  <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  अजून कोणतेही टिप्पण्या नाहीत. पहिले टिप्पणी पाठवा!
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Table of Contents */}
            {article.table_of_contents && article.table_of_contents.length > 0 && (
              <div className={`p-5 rounded-xl ${darkMode ? 'bg-navy-800' : 'bg-gray-50'}`}>
                <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                  विषय सूची
                </h3>
                <ul className="space-y-2">
                  {article.table_of_contents.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={`text-sm hover:text-gold-500 transition-colors ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                        style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Categories */}
            <div className={`p-5 rounded-xl ${darkMode ? 'bg-navy-800' : 'bg-gray-50'}`}>
              <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-navy-800'}`}>
                श्रेणी
              </h3>
              <div className="space-y-2">
                {categories.slice(0, 6).map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/blog/${cat.slug}`}
                    className="block text-sm text-gray-500 hover:text-gold-500 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </BlogLayout>
  );
}
export default ArticlePage;
