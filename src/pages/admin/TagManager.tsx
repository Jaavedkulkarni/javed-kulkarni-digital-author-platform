import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from './AdminLayout';
import { supabase } from '../../lib/supabase';
import { Modal, FormField, SkeletonRows, EmptyState } from './CategoryManager';
import { Plus, Search, Edit3, Trash2, X, Save, Tag } from 'lucide-react';
import { format } from 'date-fns';

// ─── Types ───────────────────────────────────────────────────────────────────

interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  article_count: number;
}

interface TagForm {
  name: string;
  slug: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function emptyForm(): TagForm {
  return { name: '', slug: '' };
}

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^\w\u0900-\u097F\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

const inputCls =
  'w-full px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-500 focus:border-gold-400 focus:outline-none text-sm';

// ─── Main Component ──────────────────────────────────────────────────────────

export function TagManager() {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BlogTag | null>(null);
  const [form, setForm] = useState<TagForm>(emptyForm());
  const [slugManual, setSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ── Load ──────────────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('blog_tags')
      .select('*, blog_article_tags(count)')
      .order('name', { ascending: true });
    if (!err && data) {
      setTags(
        data.map((t: any) => ({
          ...t,
          article_count: Array.isArray(t.blog_article_tags)
            ? (t.blog_article_tags[0]?.count ?? 0)
            : 0,
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Modal helpers ─────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setSlugManual(false);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (tag: BlogTag) => {
    setEditing(tag);
    setForm({ name: tag.name, slug: tag.slug });
    setSlugManual(true);
    setError(null);
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const setField = (key: keyof TagForm, val: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: val };
      if (key === 'name' && !slugManual) next.slug = toSlug(val);
      return next;
    });
  };

  // ── Save ─────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!form.name.trim()) { setError('नाव आवश्यक आहे.'); return; }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || toSlug(form.name),
      };
      const { error: err } = editing
        ? await supabase.from('blog_tags').update(payload).eq('id', editing.id)
        : await supabase.from('blog_tags').insert(payload);
      if (err) throw err;
      closeModal();
      await load();
    } catch (err: any) {
      setError(err.message ?? 'अज्ञात त्रुटी');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────

  const handleDelete = async (tag: BlogTag) => {
    const msg = tag.article_count > 0
      ? `"${tag.name}" tag हटवायचा आहे का? ${tag.article_count} लेखांतून हा tag काढला जाईल.`
      : `"${tag.name}" tag हटवायचा आहे का?`;
    if (!confirm(msg)) return;
    setDeletingId(tag.id);
    // Remove from article_tags first
    await supabase.from('blog_article_tags').delete().eq('tag_id', tag.id);
    const { error: err } = await supabase.from('blog_tags').delete().eq('id', tag.id);
    if (err) alert('त्रुटी: ' + err.message);
    setDeletingId(null);
    await load();
  };

  // ── Filter ────────────────────────────────────────────────────────────────

  const displayed = tags.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase())
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <AdminLayout title="Tags">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Tags</h1>
          <p className="text-gray-500 text-sm mt-0.5">{tags.length} tags एकूण</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold text-sm rounded-lg transition-colors shadow-lg shadow-gold-500/20"
        >
          <Plus className="w-4 h-4" />
          नवीन Tag
        </button>
      </div>

      {/* Search */}
      <div className="bg-navy-800 border border-navy-700 rounded-xl p-4 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tag नाव किंवा slug शोधा..."
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none text-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tag count summary */}
      {!loading && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {displayed.slice(0, 20).map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-xs text-gray-300 hover:border-navy-500 transition-colors"
            >
              <Tag className="w-2.5 h-2.5 text-gray-500" />
              {tag.name}
              {tag.article_count > 0 && (
                <span className="text-gray-500">({tag.article_count})</span>
              )}
            </span>
          ))}
          {displayed.length > 20 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-navy-800 border border-navy-700 text-xs text-gray-500">
              +{displayed.length - 20} more
            </span>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-navy-800 border border-navy-700 rounded-xl overflow-hidden">
        {loading ? (
          <SkeletonRows count={8} cols={4} />
        ) : displayed.length === 0 ? (
          <EmptyState
            hasData={tags.length > 0}
            onClear={() => setSearch('')}
            onCreate={openCreate}
            label="tag"
          />
        ) : (
          <>
            {/* Desktop header */}
            <div className="hidden sm:grid grid-cols-[1fr_180px_72px_120px_88px] gap-4 px-5 py-2.5 bg-navy-900/50 border-b border-navy-700">
              {[
                { label: 'नाव', align: '' },
                { label: 'Slug', align: '' },
                { label: 'लेख', align: '' },
                { label: 'तयार केले', align: '' },
                { label: 'क्रिया', align: 'text-right' },
              ].map(({ label, align }) => (
                <span key={label} className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${align}`}>
                  {label}
                </span>
              ))}
            </div>

            <div className="divide-y divide-navy-700/60">
              {displayed.map((tag) => (
                <div
                  key={tag.id}
                  className={`px-5 py-3.5 hover:bg-navy-700/30 transition-colors ${deletingId === tag.id ? 'opacity-40 pointer-events-none' : ''}`}
                >
                  {/* Desktop */}
                  <div className="hidden sm:grid grid-cols-[1fr_180px_72px_120px_88px] gap-4 items-center">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-gold-500/10 border border-gold-500/15 flex items-center justify-center flex-shrink-0">
                        <Tag className="w-3 h-3 text-gold-400" />
                      </div>
                      <span className="text-white text-sm font-medium truncate">{tag.name}</span>
                    </div>
                    <p className="text-gray-400 text-xs font-mono truncate">/{tag.slug}</p>
                    <p className="text-gray-400 text-sm tabular-nums">{tag.article_count}</p>
                    <p className="text-gray-400 text-sm">
                      {tag.created_at ? format(new Date(tag.created_at), 'd MMM yyyy') : '—'}
                    </p>
                    <div className="flex items-center justify-end gap-0.5">
                      <button
                        onClick={() => openEdit(tag)}
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-600 transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(tag)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="sm:hidden flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/15 flex items-center justify-center flex-shrink-0">
                      <Tag className="w-3.5 h-3.5 text-gold-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{tag.name}</p>
                      <p className="text-gray-500 text-xs font-mono mt-0.5">/{tag.slug} · {tag.article_count} लेख</p>
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <button onClick={() => openEdit(tag)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-600 transition-colors">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(tag)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <Modal
          title={editing ? 'Tag संपादित करा' : 'नवीन Tag'}
          onClose={closeModal}
        >
          <div className="p-5 space-y-4">
            <FormField label="नाव *">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                className={inputCls}
                placeholder="Tag नाव"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
            </FormField>

            <FormField label="Slug (URL)">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => { setSlugManual(true); setField('slug', e.target.value); }}
                  className={`${inputCls} flex-1 font-mono text-xs`}
                  placeholder="tag-slug"
                />
                <button
                  type="button"
                  onClick={() => { setForm((p) => ({ ...p, slug: toSlug(p.name) })); setSlugManual(false); }}
                  className="px-3 rounded-lg bg-navy-700 border border-navy-600 text-gray-300 hover:text-white text-xs whitespace-nowrap"
                >
                  Auto
                </button>
              </div>
            </FormField>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 px-5 pb-5">
            <button
              onClick={closeModal}
              className="px-4 py-2 rounded-lg bg-navy-700 border border-navy-600 text-gray-300 text-sm hover:text-white hover:bg-navy-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.name.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-900 text-sm font-semibold transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}

export default TagManager;
