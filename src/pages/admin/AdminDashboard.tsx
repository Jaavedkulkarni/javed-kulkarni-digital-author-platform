import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { AdminLayout } from './AdminLayout';
import { adminPathFromView } from '../../lib/adminPaths';
import {
  BookOpen,
  FileText,
  FolderOpen,
  Mail,
  Eye,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  TrendingUp,
  ArrowUpRight,
  Clock,
  ShoppingBag,
  Users,
  PenTool,
  DollarSign,
  Image,
  Package,
} from 'lucide-react';
import { format } from 'date-fns';

interface Stats {
  books: number;
  articles: number;
  products: number;
  readers: number;
  authors: number;
  revenue: number;
  media: number;
  orders: number;
}

interface RecentArticle {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'scheduled';
  published_at: string | null;
  created_at: string;
  category: { name: string; slug: string } | null;
}

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  draft: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  scheduled: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
};

const STATUS_LABELS: Record<string, string> = {
  published: 'प्रकाशित',
  draft: 'ड्राफ्ट',
  scheduled: 'नियोजित',
};

const DASHBOARD_CACHE_TTL_MS = 60_000;
let dashboardCache: { stats: Stats; recentArticles: RecentArticle[]; cachedAt: number } | null = null;

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    books: 0,
    articles: 0,
    products: 0,
    readers: 0,
    authors: 0,
    revenue: 0,
    media: 0,
    orders: 0,
  });
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async (force = false) => {
    if (
      !force &&
      dashboardCache &&
      Date.now() - dashboardCache.cachedAt < DASHBOARD_CACHE_TTL_MS
    ) {
      setStats(dashboardCache.stats);
      setRecentArticles(dashboardCache.recentArticles);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [
        booksRes,
        articlesRes,
        productsRes,
        readersRes,
        recentRes,
      ] = await Promise.all([
        supabase.from('books').select('id', { count: 'exact', head: true }),
        supabase.from('blog_articles').select('id', { count: 'exact', head: true }),
        supabase.from('books').select('id', { count: 'exact', head: true }),
        supabase.from('blog_newsletter_subscribers').select('id', { count: 'exact', head: true }),
        supabase
          .from('blog_articles')
          .select('id, title, slug, status, published_at, created_at, category:blog_categories(name, slug)')
          .order('created_at', { ascending: false })
          .limit(10),
      ]);

      const nextStats: Stats = {
        books: booksRes.count ?? 0,
        articles: articlesRes.count ?? 0,
        products: productsRes.count ?? 0,
        readers: readersRes.count ?? 0,
        authors: 0,
        revenue: 0,
        media: 0,
        orders: 0,
      };

      const nextRecent = (recentRes.data || []).map((a: any) => ({
        ...a,
        category: Array.isArray(a.category) ? a.category[0] ?? null : a.category,
      }));

      dashboardCache = {
        stats: nextStats,
        recentArticles: nextRecent,
        cachedAt: Date.now(),
      };

      setStats(nextStats);
      setRecentArticles(nextRecent);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('हा लेख कायमचा हटवायचा आहे का?')) return;
    setDeletingId(id);
    const { error } = await supabase.from('blog_articles').delete().eq('id', id);
    if (!error) {
      setRecentArticles((prev) => prev.filter((a) => a.id !== id));
      setStats((prev) => ({ ...prev, articles: Math.max(0, prev.articles - 1) }));
      dashboardCache = null;
    }
    setDeletingId(null);
  };

  const statCards = [
    { label: 'Books', value: stats.books, icon: BookOpen, iconColor: 'text-blue-400', iconBg: 'bg-blue-500/10', action: () => navigate(adminPathFromView('books')) },
    { label: 'Articles', value: stats.articles, icon: FileText, iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/10', action: () => navigate(adminPathFromView('articles')) },
    { label: 'Products', value: stats.products, icon: Package, iconColor: 'text-purple-400', iconBg: 'bg-purple-500/10', action: () => navigate(adminPathFromView('products')) },
    { label: 'Readers', value: stats.readers, icon: Users, iconColor: 'text-cyan-400', iconBg: 'bg-cyan-500/10', action: () => navigate(adminPathFromView('subscribers')) },
    { label: 'Authors', value: stats.authors, icon: PenTool, iconColor: 'text-gold-400', iconBg: 'bg-gold-500/10', action: undefined },
    { label: 'Revenue', value: stats.revenue, icon: DollarSign, iconColor: 'text-green-400', iconBg: 'bg-green-500/10', action: undefined },
    { label: 'Media', value: stats.media, icon: Image, iconColor: 'text-pink-400', iconBg: 'bg-pink-500/10', action: () => navigate(adminPathFromView('media')) },
    { label: 'Orders', value: stats.orders, icon: ShoppingBag, iconColor: 'text-orange-400', iconBg: 'bg-orange-500/10', action: undefined },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Page heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {new Date().toLocaleDateString('mr-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => navigate(adminPathFromView('create'))}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold text-sm rounded-lg transition-colors shadow-lg shadow-gold-500/20"
        >
          <Plus className="w-4 h-4" />
          नवीन लेख
        </button>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-4 mb-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-navy-800 rounded-xl p-5 animate-pulse">
              <div className="w-8 h-8 bg-navy-700 rounded-lg mb-3" />
              <div className="h-7 bg-navy-700 rounded w-12 mb-1.5" />
              <div className="h-3 bg-navy-700 rounded w-20" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-4 mb-8">
          {statCards.map((card) => (
            <button
              key={card.label}
              onClick={card.action}
              disabled={!card.action}
              className={`group bg-navy-800 border border-navy-700 rounded-xl p-5 text-left transition-all duration-200 ${
                card.action
                  ? 'hover:border-gold-500/30 hover:bg-navy-750 cursor-pointer'
                  : 'cursor-default'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center mb-4`}>
                <card.icon className={`w-4.5 h-4.5 ${card.iconColor}`} style={{ width: '18px', height: '18px' }} />
              </div>
              <p className="text-2xl font-bold text-white tabular-nums">
                {card.value.toLocaleString()}
              </p>
              <p className="text-gray-500 text-xs mt-1 leading-tight">{card.label}</p>
              {card.action && (
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-600 mt-2 group-hover:text-gold-400 transition-colors" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Recent Articles Table */}
      <div className="bg-navy-800 border border-navy-700 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-700">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gold-400" />
            <h2 className="text-white font-semibold">अलीकडील लेख</h2>
          </div>
          <button
            onClick={() => navigate(adminPathFromView('articles'))}
            className="flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 transition-colors font-medium"
          >
            सर्व पहा
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {loading ? (
          <div className="divide-y divide-navy-700">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="h-4 bg-navy-700 rounded flex-1 max-w-xs" />
                  <div className="h-5 bg-navy-700 rounded w-16" />
                  <div className="h-4 bg-navy-700 rounded w-24 hidden sm:block" />
                  <div className="h-4 bg-navy-700 rounded w-20 hidden md:block" />
                  <div className="h-8 bg-navy-700 rounded w-20 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : recentArticles.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-navy-600 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">अजून कोणतेही लेख नाही</p>
            <button
              onClick={() => navigate(adminPathFromView('create'))}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 text-gold-400 rounded-lg text-sm font-medium hover:bg-gold-500/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
              पहिला लेख तयार करा
            </button>
          </div>
        ) : (
          <>
            {/* Table header — desktop only */}
            <div className="hidden md:grid grid-cols-[1fr_120px_160px_130px_120px] gap-4 px-6 py-2.5 border-b border-navy-700 bg-navy-900/50">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">शीर्षक</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">स्थिती</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">श्रेणी</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">तारीख</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">क्रिया</span>
            </div>

            <div className="divide-y divide-navy-700/60">
              {recentArticles.map((article) => (
                <div
                  key={article.id}
                  className="px-6 py-4 hover:bg-navy-700/30 transition-colors"
                >
                  {/* Mobile layout */}
                  <div className="md:hidden">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-white text-sm font-medium line-clamp-2 flex-1">{article.title}</p>
                      <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[article.status] ?? ''}`}>
                        {STATUS_LABELS[article.status] ?? article.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {article.category && (
                          <span className="text-gray-400">{article.category.name}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(article.published_at ?? article.created_at), 'd MMM yyyy')}
                        </span>
                      </div>
                      <ArticleActions article={article} onDelete={handleDelete} deletingId={deletingId} onEdit={() => navigate(adminPathFromView('articles'))} />
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:grid grid-cols-[1fr_120px_160px_130px_120px] gap-4 items-center">
                    {/* Title */}
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{article.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5 truncate">/{article.slug}</p>
                    </div>

                    {/* Status */}
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_STYLES[article.status] ?? ''}`}>
                        {STATUS_LABELS[article.status] ?? article.status}
                      </span>
                    </div>

                    {/* Category */}
                    <div>
                      {article.category ? (
                        <span className="text-sm text-gray-400 truncate block">{article.category.name}</span>
                      ) : (
                        <span className="text-gray-600 text-sm">—</span>
                      )}
                    </div>

                    {/* Date */}
                    <div>
                      <span className="text-sm text-gray-400">
                        {format(new Date(article.published_at ?? article.created_at), 'd MMM yyyy')}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end">
                      <ArticleActions article={article} onDelete={handleDelete} deletingId={deletingId} onEdit={() => navigate(adminPathFromView('articles'))} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

function ArticleActions({
  article,
  onDelete,
  deletingId,
  onEdit,
}: {
  article: RecentArticle;
  onDelete: (id: string) => void;
  deletingId: string | null;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {article.status === 'published' && (
        <Link
          to={`/blog/${article.slug}`}
          target="_blank"
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-navy-600 transition-colors"
          title="View"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      )}
      <button
        onClick={onEdit}
        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-navy-600 transition-colors"
        title="Edit"
      >
        <Edit3 className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onDelete(article.id)}
        disabled={deletingId === article.id}
        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
        title="Delete"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default AdminDashboard;
