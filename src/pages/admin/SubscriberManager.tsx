import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { AdminLayout } from './AdminLayout';
import { SkeletonRows } from './CategoryManager';
import {
  Search,
  Download,
  Trash2,
  Check,
  X,
  Mail,
  Users,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { format } from 'date-fns';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Subscriber {
  id: string;
  email: string;
  subscribed: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

type FilterMode = 'all' | 'active' | 'unsubscribed';

const PAGE_SIZE = 20;

// ─── Main Component ──────────────────────────────────────────────────────────

export function SubscriberManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filter, setFilter] = useState<FilterMode>('all');
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // ── Stats (always off full table, no filter) ──────────────────────────────
  const [stats, setStats] = useState({ total: 0, active: 0, unsubscribed: 0 });

  const loadStats = useCallback(async () => {
    const { data } = await supabase
      .from('blog_newsletter_subscribers')
      .select('subscribed');
    if (data) {
      const active = data.filter((r: any) => r.subscribed).length;
      setStats({ total: data.length, active, unsubscribed: data.length - active });
    }
  }, []);

  // ── Paginated list ────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    setLoading(true);
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from('blog_newsletter_subscribers')
      .select('*', { count: 'exact' })
      .order('subscribed_at', { ascending: false })
      .range(from, to);

    if (filter === 'active') query = query.eq('subscribed', true);
    if (filter === 'unsubscribed') query = query.eq('subscribed', false);
    if (search.trim()) query = query.ilike('email', `%${search.trim()}%`);

    const { data, count, error } = await query;
    if (!error) {
      setSubscribers((data ?? []) as Subscriber[]);
      setTotal(count ?? 0);
    }
    setLoading(false);
  }, [page, filter, search]);

  useEffect(() => { load(); loadStats(); }, [load, loadStats]);

  // Reset page on filter/search change
  useEffect(() => { setPage(1); }, [filter, search]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const clearSearch = () => { setSearchInput(''); setSearch(''); };

  const handleToggle = async (sub: Subscriber) => {
    setTogglingId(sub.id);
    const newStatus = !sub.subscribed;
    await supabase
      .from('blog_newsletter_subscribers')
      .update({
        subscribed: newStatus,
        unsubscribed_at: newStatus ? null : new Date().toISOString(),
      })
      .eq('id', sub.id);
    setTogglingId(null);
    await load();
    await loadStats();
  };

  const handleDelete = async (sub: Subscriber) => {
    if (!confirm(`"${sub.email}" हटवायचा आहे का?`)) return;
    setDeletingId(sub.id);
    await supabase.from('blog_newsletter_subscribers').delete().eq('id', sub.id);
    setDeletingId(null);
    await load();
    await loadStats();
  };

  // ── Export CSV ────────────────────────────────────────────────────────────

  const exportCSV = async () => {
    // Fetch all active subscribers (no pagination) for export
    const { data } = await supabase
      .from('blog_newsletter_subscribers')
      .select('email, subscribed, subscribed_at, unsubscribed_at')
      .eq('subscribed', true)
      .order('subscribed_at', { ascending: false });

    if (!data?.length) return;

    const header = 'Email,Status,Subscribed At';
    const rows = data.map(
      (s: any) =>
        `${s.email},${s.subscribed ? 'Active' : 'Unsubscribed'},${
          s.subscribed_at ? format(new Date(s.subscribed_at), 'yyyy-MM-dd HH:mm') : ''
        }`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <AdminLayout title="Newsletter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Newsletter</h1>
          <p className="text-gray-500 text-sm mt-0.5">Subscribers व्यवस्थापन</p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-700 border border-navy-600 text-gray-300 font-medium text-sm rounded-lg hover:text-white hover:border-navy-500 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={<Users className="w-5 h-5 text-blue-400" />}
          label="एकूण"
          value={stats.total}
          color="blue"
        />
        <StatCard
          icon={<UserCheck className="w-5 h-5 text-emerald-400" />}
          label="Active"
          value={stats.active}
          color="emerald"
        />
        <StatCard
          icon={<UserX className="w-5 h-5 text-red-400" />}
          label="Unsubscribed"
          value={stats.unsubscribed}
          color="red"
        />
      </div>

      {/* Filters */}
      <div className="bg-navy-800 border border-navy-700 rounded-xl p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Email शोधा..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none text-sm"
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
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterMode)}
            className="px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white text-sm focus:border-gold-400 focus:outline-none"
          >
            <option value="all">सर्व</option>
            <option value="active">Active</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-navy-800 border border-navy-700 rounded-xl overflow-hidden">
        {loading ? (
          <SkeletonRows count={8} cols={4} />
        ) : subscribers.length === 0 ? (
          <EmptySubscribers
            hasSearch={!!search || filter !== 'all'}
            onClear={() => { clearSearch(); setFilter('all'); }}
          />
        ) : (
          <>
            {/* Desktop header */}
            <div className="hidden sm:grid grid-cols-[1fr_120px_160px_96px] gap-4 px-5 py-2.5 bg-navy-900/50 border-b border-navy-700">
              {[
                { label: 'Email', cls: '' },
                { label: 'Status', cls: '' },
                { label: 'Subscribe Date', cls: '' },
                { label: 'क्रिया', cls: 'text-right' },
              ].map(({ label, cls }) => (
                <span key={label} className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${cls}`}>
                  {label}
                </span>
              ))}
            </div>

            <div className="divide-y divide-navy-700/60">
              {subscribers.map((sub) => {
                const isDeleting = deletingId === sub.id;
                const isToggling = togglingId === sub.id;
                return (
                  <div
                    key={sub.id}
                    className={`px-5 py-3.5 hover:bg-navy-700/30 transition-colors ${isDeleting ? 'opacity-40 pointer-events-none' : ''}`}
                  >
                    {/* Desktop */}
                    <div className="hidden sm:grid grid-cols-[1fr_120px_160px_96px] gap-4 items-center">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-navy-700 border border-navy-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-gray-400 uppercase">
                            {sub.email[0]}
                          </span>
                        </div>
                        <span className="text-white text-sm truncate">{sub.email}</span>
                      </div>

                      <div>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${
                            sub.subscribed
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                          }`}
                        >
                          {sub.subscribed ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                          {sub.subscribed ? 'Active' : 'Unsubscribed'}
                        </span>
                      </div>

                      <span className="text-gray-400 text-sm">
                        {sub.subscribed_at
                          ? format(new Date(sub.subscribed_at), 'd MMM yyyy')
                          : '—'}
                      </span>

                      <div className="flex items-center justify-end gap-0.5">
                        <button
                          onClick={() => handleToggle(sub)}
                          disabled={isToggling}
                          title={sub.subscribed ? 'Unsubscribe' : 'Re-subscribe'}
                          className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                            sub.subscribed
                              ? 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10'
                              : 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                          }`}
                        >
                          {sub.subscribed ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleDelete(sub)}
                          title="Delete"
                          className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="sm:hidden flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-navy-700 border border-navy-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-gray-300 uppercase">
                          {sub.email[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{sub.email}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs ${sub.subscribed ? 'text-emerald-400' : 'text-gray-500'}`}>
                            {sub.subscribed ? 'Active' : 'Unsubscribed'}
                          </span>
                          {sub.subscribed_at && (
                            <>
                              <span className="text-gray-600 text-xs">·</span>
                              <span className="text-gray-500 text-xs">
                                {format(new Date(sub.subscribed_at), 'd MMM yyyy')}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <button
                          onClick={() => handleToggle(sub)}
                          disabled={isToggling}
                          className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                            sub.subscribed
                              ? 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10'
                              : 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                          }`}
                        >
                          {sub.subscribed ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleDelete(sub)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                    const p =
                      totalPages <= 7
                        ? i + 1
                        : page <= 4
                        ? i + 1
                        : page >= totalPages - 3
                        ? totalPages - 6 + i
                        : page - 3 + i;
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'blue' | 'emerald' | 'red';
}) {
  const colors = {
    blue: 'bg-blue-500/8 border-blue-500/15',
    emerald: 'bg-emerald-500/8 border-emerald-500/15',
    red: 'bg-red-500/8 border-red-500/15',
  };
  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-medium text-gray-400">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white tabular-nums">{value.toLocaleString()}</p>
    </div>
  );
}

function EmptySubscribers({
  hasSearch,
  onClear,
}: {
  hasSearch: boolean;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <Users className="w-12 h-12 text-navy-600 mb-3" />
      <p className="text-gray-500 font-medium">
        {hasSearch ? 'कोणताही subscriber सापडला नाही.' : 'अजून कोणतेही subscribers नाहीत.'}
      </p>
      {hasSearch && (
        <button onClick={onClear} className="mt-3 text-sm text-gold-400 hover:text-gold-300 transition-colors">
          Filter साफ करा
        </button>
      )}
    </div>
  );
}

export default SubscriberManager;
