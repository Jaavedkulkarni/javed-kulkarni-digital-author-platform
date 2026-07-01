import { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from './AdminLayout';
import {
  listFormats,
  createFormat,
  updateFormat,
  setFormatActive,
  deleteFormat,
  formatToSlug,
} from '../../lib/formatService';
import type { FormatFormData, FormatWithUsage } from '../../types/product';
import { Plus, Search, Edit3, Trash2, X, Save, Layers, Power, PowerOff } from 'lucide-react';

const FORMAT_TYPES = ['physical', 'digital', 'access', 'stream', 'interactive'];

function emptyForm(): FormatFormData {
  return {
    name: '',
    slug: '',
    format_type: 'digital',
    downloadable: true,
    shipping_required: false,
    sort_order: '0',
  };
}

const inputCls =
  'w-full px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-500 focus:border-gold-400 focus:outline-none text-sm';

export function FormatManager() {
  const [items, setItems] = useState<FormatWithUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FormatWithUsage | null>(null);
  const [form, setForm] = useState<FormatFormData>(emptyForm());
  const [slugManual, setSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await listFormats({ includeInactive: showInactive, search }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [showInactive, search]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setSlugManual(false);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (item: FormatWithUsage) => {
    setEditing(item);
    setForm({
      name: item.name,
      slug: item.slug,
      format_type: item.format_type,
      downloadable: item.downloadable,
      shipping_required: item.shipping_required,
      sort_order: String(item.sort_order ?? 0),
    });
    setSlugManual(true);
    setError(null);
    setModalOpen(true);
  };

  const setField = <K extends keyof FormatFormData>(key: K, value: FormatFormData[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'name' && !slugManual && typeof value === 'string') {
        next.slug = formatToSlug(value);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('Name is required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editing) {
        await updateFormat(editing.id, form);
      } else {
        await createFormat(form);
      }
      setModalOpen(false);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (item: FormatWithUsage) => {
    await setFormatActive(item.id, !item.active);
    await load();
  };

  const handleDelete = async (item: FormatWithUsage) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    setDeletingId(item.id);
    const result = await deleteFormat(item.id);
    if (!result.ok) alert(result.reason ?? 'Cannot delete.');
    setDeletingId(null);
    await load();
  };

  return (
    <AdminLayout title="Formats">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-gold-400" />
            Formats
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{items.length} formats</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold text-sm rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Format
        </button>
      </div>

      <div className="bg-navy-800 border border-navy-700 rounded-xl p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, slug, or type..."
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white text-sm focus:border-gold-400 focus:outline-none"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-400 whitespace-nowrap">
          <input type="checkbox" checked={showInactive} onChange={(e) => setShowInactive(e.target.checked)} className="accent-gold-400" />
          Show inactive
        </label>
      </div>

      <div className="bg-navy-800 border border-navy-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No formats found.</div>
        ) : (
          <div className="divide-y divide-navy-700/60">
            {items.map((item) => (
              <div
                key={item.id}
                className={`px-5 py-4 flex items-center gap-4 ${!item.active ? 'opacity-60' : ''} ${deletingId === item.id ? 'opacity-40' : ''}`}
              >
                <div className="w-10 h-10 rounded-lg bg-navy-700 flex items-center justify-center text-gold-400 flex-shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{item.name}</p>
                    {!item.active && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400">Inactive</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs font-mono mt-0.5">
                    /{item.slug} · {item.format_type}
                    {item.downloadable ? ' · downloadable' : ''}
                    {item.shipping_required ? ' · shipping' : ''}
                  </p>
                </div>
                <p className="text-gray-500 text-xs hidden md:block">
                  {item.product_type_count} types · {item.book_count} books
                </p>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => handleToggleActive(item)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-600">
                    {item.active ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <button type="button" onClick={() => openEdit(item)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-600">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => handleDelete(item)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-navy-800 border border-navy-700 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-navy-700">
              <h2 className="text-white font-semibold">{editing ? 'Edit Format' : 'New Format'}</h2>
              <button type="button" onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Name *</label>
                <input type="text" value={form.name} onChange={(e) => setField('name', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => { setSlugManual(true); setField('slug', e.target.value); }}
                  className={`${inputCls} font-mono text-xs`}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Format Type</label>
                <select value={form.format_type} onChange={(e) => setField('format_type', e.target.value)} className={inputCls}>
                  {FORMAT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Sort Order</label>
                <input type="number" value={form.sort_order} onChange={(e) => setField('sort_order', e.target.value)} className={inputCls} />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" checked={form.downloadable} onChange={(e) => setField('downloadable', e.target.checked)} className="accent-gold-400" />
                Downloadable
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" checked={form.shipping_required} onChange={(e) => setField('shipping_required', e.target.checked)} className="accent-gold-400" />
                Shipping Required
              </label>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gold-500 text-navy-900 font-semibold text-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default FormatManager;
