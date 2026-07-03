import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { AdminLayout } from './AdminLayout';
import { ArticleEditor } from './ArticleEditor';
import { adminPathFromView } from '../../lib/adminPaths';
import { articleEditorPath, getArticleEditorMode } from '../../lib/adminEditorRoutes';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Copy,
  X,
  FileText,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Star,
  Filter,
} from 'lucide-react';
import { format } from 'date-fns';

interface Article {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  category_id: string | null;
  author_name?: string;
  author_image?: string;
  status: 'draft' | 'published' | 'scheduled';
  published_at?: string;
  scheduled_at?: string;
  is_featured: boolean;
  views_count: number;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  category?: { id: string; name: string; slug: string } | null;
}

const PAGE_SIZE = 15;

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  draft: 'bg-gray-500/15 text-gray-400 border-gray-500/25',
  scheduled: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
};
const STATUS_LABELS: Record<string, string> = {
  published: 'प्रकाशित',
  draft: 'ड्राफ्ट',
  scheduled: 'नियोजित',
};

export function ArticleManager() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editorMode = getArticleEditorMode(location.pathname);

  // ─── List state ───────────────────────────────────────────────────
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const isEditorOpen = editorMode !== null;

  const loadArticleById = useCallback(async (id: string) => {
    const { data } = await supabase.from('blog_articles').select('*').eq('id', id).maybeSingle();
    return data as Article | null;
  }, []);

  useEffect(() => {
    if (editorMode !== 'edit') return;
    const id = searchParams.get('id');
    if (!id) {
      navigate(adminPathFromView('articles'), { replace: true });
      return;
    }
    if (editingArticle?.id === id) return;

    let cancelled = false;
    loadArticleById(id).then((data) => {
      if (cancelled) return;
      if (data) setEditingArticle(data);
      else navigate(adminPathFromView('articles'), { replace: true });
    });
    return () => {
      cancelled = true;
    };
  }, [editorMode, searchParams, editingArticle?.id, loadArticleById, navigate]);

  useEffect(() => {
    if (editorMode === 'create') {
      setEditingArticle(null);
    }
  }, [editorMode]);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from('blog_articles')
      .select('id, title, slug, subtitle, featured_image, category_id, status, published_at, is_featured, views_count, category:blog_categories(id, name, slug)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (filterStatus !== 'all') query = query.eq('status', filterStatus);
    if (searchQuery.trim()) {
      query = query.or(`title.ilike.%${searchQuery}%,slug.ilike.%${searchQuery}%`);
    }

    const { data, count, error } = await query;
    if (!error) {
      setArticles(
        (data ?? []).map((a: any) => ({
          ...a,
          category: Array.isArray(a.category) ? (a.category[0] ?? null) : a.category,
        }))
      );
      setTotal(count ?? 0);
    }
    setLoading(false);
  }, [page, searchQuery, filterStatus]);

  useEffect(() => {
    if (!isEditorOpen) loadArticles();
  }, [isEditorOpen, loadArticles]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterStatus]);

  // ─── Actions ──────────────────────────────────────────────────────
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  const handleCreateNew = () => {
    setEditingArticle(null);
    navigate(articleEditorPath('create'));
  };

  const handleEdit = async (article: Article) => {
    const data = await loadArticleById(article.id);
    if (!data) return;
    setEditingArticle(data);
    navigate(articleEditorPath('edit', data.id));
  };

  const handleSaved = () => {
    setEditingArticle(null);
    navigate(adminPathFromView('articles'));
    void loadArticles();
  };

  const handleCancel = () => {
    setEditingArticle(null);
    navigate(adminPathFromView('articles'));
  };

  const handleDuplicate = async (article: Article) => {
    const newSlug = `${article.slug}-copy-${Date.now().toString(36)}`;
    const { error } = await supabase.from('blog_articles').insert({
      title: `${article.title} (Copy)`,
      slug: newSlug,
      subtitle: article.subtitle,
      excerpt: article.excerpt,
      content: article.content,
      featured_image: article.featured_image,
      category_id: article.category_id,
      status: 'draft',
      is_featured: false,
      views_count: 0,
      likes_count: 0,
      comments_count: 0,
      reading_time: 1,
    });
    if (!error) loadArticles();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('हा लेख कायमचा हटवायचा आहे का?')) return;
    setDeletingId(id);
    const { error } = await supabase.from('blog_articles').delete().eq('id', id);
    if (!error) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      setTotal((prev) => prev - 1);
    }
    setDeletingId(null);
  };

  // ─── Editor view ──────────────────────────────────────────────────
  if (isEditorOpen) {
    if (editorMode === 'edit' && !editingArticle) {
      return (
        <AdminLayout title="लेख">
          <div className="py-24 flex justify-center">
            <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
          </div>
        </AdminLayout>
      );
    }

    return (
      <ArticleEditor
        article={editorMode === 'create' ? null : editingArticle}
        onSaved={handleSaved}
        onCancel={handleCancel}
      />
    );
  }

  // ─── List view ────────────────────────────────────────────────────
  return (
    <AdminLayout title="लेख">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">लेख</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} लेख एकूण</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold text-sm rounded-lg transition-colors shadow-lg shadow-gold-500/20"
        >
          <Plus className="w-4 h-4" />
          नवीन लेख
        </button>
      </div>

      {/* Filters */}
      <div className="bg-navy-800 border border-navy-700 rounded-xl p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none text-sm"
              placeholder="शीर्षक किंवा slug शोधा..."
            />
            {searchInput && (
              <button type="button" onClick={clearSearch} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button type="submit" className="px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-gray-300 hover:text-white hover:border-navy-500 text-sm transition-colors">
            शोधा
          </button>
        </form>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white text-sm"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-navy-800 border border-navy-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="divide-y divide-navy-700">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4 animate-pulse">
                <div className="w-14 h-10 rounded-lg bg-navy-700 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-navy-700 rounded w-2/3" />
                  <div className="h-3 bg-navy-700 rounded w-1/3" />
                </div>
                <div className="h-5 w-16 bg-navy-700 rounded-full hidden sm:block" />
                <div className="h-3 w-20 bg-navy-700 rounded hidden lg:block" />
                <div className="h-3 w-10 bg-navy-700 rounded hidden xl:block" />
                <div className="h-8 w-24 bg-navy-700 rounded ml-auto" />
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-navy-600 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              {searchQuery || filterStatus !== 'all' ? 'कोणतेही निकाल आढळले नाही.' : 'अजून कोणतेही लेख नाही.'}
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <button onClick={handleCreateNew} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 text-gold-400 rounded-lg text-sm font-medium hover:bg-gold-500/20 transition-colors">
                <Plus className="w-4 h-4" /> पहिला लेख लिहा
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden lg:grid grid-cols-[56px_1fr_160px_110px_130px_80px_120px] gap-4 px-5 py-2.5 bg-navy-900/50 border-b border-navy-700">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">शीर्षक</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">श्रेणी</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">स्थिती</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">प्रकाशित</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Views</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">क्रिया</span>
            </div>

            <div className="divide-y divide-navy-700/60">
              {articles.map((article) => (
                <ArticleRow
                  key={article.id}
                  article={article}
                  onEdit={handleEdit}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                  deletingId={deletingId}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-navy-700 bg-navy-900/30">
                <p className="text-sm text-gray-500">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-navy-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const p = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          p === page
                            ? 'bg-gold-500 text-navy-900'
                            : 'text-gray-400 hover:text-white hover:bg-navy-700'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-navy-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

// ─── Article Row ────────────────────────────────────────────────────────────

function ArticleRow({
  article,
  onEdit,
  onDuplicate,
  onDelete,
  deletingId,
}: {
  article: Article;
  onEdit: (a: Article) => void;
  onDuplicate: (a: Article) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}) {
  const isDeleting = deletingId === article.id;

  return (
    <div className={`px-5 py-3.5 hover:bg-navy-700/30 transition-colors ${isDeleting ? 'opacity-50' : ''}`}>
      {/* Desktop */}
      <div className="hidden lg:grid grid-cols-[56px_1fr_160px_110px_130px_80px_120px] gap-4 items-center">
        {/* Image */}
        <div className="w-14 h-10 rounded-lg overflow-hidden bg-navy-700 flex-shrink-0 flex items-center justify-center">
          {article.featured_image ? (
            <img src={article.featured_image} alt="" className="w-full h-full object-cover" />
          ) : (
            <FileText className="w-4 h-4 text-gray-500" />
          )}
        </div>

        {/* Title */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-white text-sm font-medium truncate">{article.title}</p>
            {article.is_featured && <Star className="w-3 h-3 text-gold-400 fill-gold-400 flex-shrink-0" />}
          </div>
          <p className="text-gray-500 text-xs truncate mt-0.5 font-mono">/{article.slug}</p>
        </div>

        {/* Category */}
        <div>
          {article.category ? (
            <span className="text-sm text-gray-400 truncate block">{article.category.name}</span>
          ) : (
            <span className="text-gray-600 text-sm">—</span>
          )}
        </div>

        {/* Status */}
        <div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[article.status] ?? ''}`}>
            {STATUS_LABELS[article.status] ?? article.status}
          </span>
        </div>

        {/* Published date */}
        <div>
          <span className="text-sm text-gray-400">
            {article.published_at ? format(new Date(article.published_at), 'd MMM yyyy') : '—'}
          </span>
        </div>

        {/* Views */}
        <div>
          <span className="text-sm text-gray-400 tabular-nums">
            {(article.views_count ?? 0).toLocaleString()}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-0.5">
          {article.status === 'published' && (
            <Link
              to={`/blog/${article.slug}`}
              target="_blank"
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-600 transition-colors"
              title="View"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          )}
          <button
            onClick={() => onEdit(article)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-600 transition-colors"
            title="Edit"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDuplicate(article)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-600 transition-colors"
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(article.id)}
            disabled={isDeleting}
            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden flex items-center gap-3">
        <div className="w-12 h-10 rounded-lg overflow-hidden bg-navy-700 flex-shrink-0 flex items-center justify-center">
          {article.featured_image ? (
            <img src={article.featured_image} alt="" className="w-full h-full object-cover" />
          ) : (
            <FileText className="w-4 h-4 text-gray-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-white text-sm font-medium truncate flex-1">{article.title}</p>
            <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[article.status] ?? ''}`}>
              {STATUS_LABELS[article.status] ?? article.status}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {article.category && <span>{article.category.name}</span>}
            {article.published_at && <span>{format(new Date(article.published_at), 'd MMM yyyy')}</span>}
            <span>{(article.views_count ?? 0).toLocaleString()} views</span>
          </div>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button onClick={() => onEdit(article)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-600 transition-colors">
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDuplicate(article)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-600 transition-colors">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(article.id)} disabled={isDeleting} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArticleManager;
