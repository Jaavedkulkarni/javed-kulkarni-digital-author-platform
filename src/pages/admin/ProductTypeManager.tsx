import { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from './AdminLayout';
import {
  listProductTypes,
  createProductType,
  updateProductType,
  setProductTypeActive,
  deleteProductType,
  productTypeToSlug,
} from '../../lib/productTypeService';
import { listFormats } from '../../lib/formatService';
import type { Format, ProductTypeFormData, ProductTypeWithFormats } from '../../types/product';
import { Plus, Search, Edit3, Trash2, X, Save, Package, Power, PowerOff } from 'lucide-react';

function emptyForm(): ProductTypeFormData {
  return { name: '', slug: '', icon: '', sort_order: '0', format_ids: [] };
}

const inputCls =
  'w-full px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-500 focus:border-gold-400 focus:outline-none text-sm';

export function ProductTypeManager() {
  const [items, setItems] = useState<ProductTypeWithFormats[]>([]);
  const [allFormats, setAllFormats] = useState<Format[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showInactive, setShowInactive] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductTypeWithFormats | null>(null);
  const [form, setForm] = useState<ProductTypeFormData>(emptyForm());
  const [slugManual, setSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [types, formats] = await Promise.all([
        listProductTypes({ includeInactive: showInactive, search }),
        listFormats({ includeInactive: true }),
      ]);
      setItems(types);
      setAllFormats(formats);
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

  const openEdit = (item: ProductTypeWithFormats) => {
    setEditing(item);
    setForm({
      name: item.name,
      slug: item.slug,
      icon: item.icon ?? '',
      sort_order: String(item.sort_order ?? 0),
      format_ids: item.format_ids,
    });
    setSlugManual(true);
    setError(null);
    setModalOpen(true);
  };

  const setField = <K extends keyof ProductTypeFormData>(key: K, value: ProductTypeFormData[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'name' && !slugManual && typeof value === 'string') {
        next.slug = productTypeToSlug(value);
      }
      return next;
    });
  };

  const toggleFormat = (formatId: string) => {
    setForm((prev) => ({
      ...prev,
      format_ids: prev.format_ids.includes(formatId)
        ? prev.format_ids.filter((id) => id !== formatId)
        : [...prev.format_ids, formatId],
    }));
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
        await updateProductType(editing.id, form);
      } else {
        await createProductType(form);
      }
      setModalOpen(false);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (item: ProductTypeWithFormats) => {
    await setProductTypeActive(item.id, !item.active);
    await load();
  };

  const handleDelete = async (item: ProductTypeWithFormats) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    setDeletingId(item.id);
    const result = await deleteProductType(item.id);
    if (!result.ok) alert(result.reason ?? 'Cannot delete.');
    setDeletingId(null);
    await load();
  };

  return (
    <AdminLayout title="Product Types">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-gold-400" />
            Product Types
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{items.length} types</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold text-sm rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Product Type
        </button>
      </div>

      <div className="bg-navy-800 border border-navy-700 rounded-xl p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or slug..."
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white text-sm focus:border-gold-400 focus:outline-none"
          />
          {search && (
            <button type="button" onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-400 whitespace-nowrap">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="accent-gold-400"
          />
          Show inactive
        </label>
      </div>

      <div className="bg-navy-800 border border-navy-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No product types found.</div>
        ) : (
          <div className="divide-y divide-navy-700/60">
            {items.map((item) => (
              <div
                key={item.id}
                className={`px-5 py-4 flex items-center gap-4 ${!item.active ? 'opacity-60' : ''} ${deletingId === item.id ? 'opacity-40' : ''}`}
              >
                <div className="w-10 h-10 rounded-lg bg-navy-700 flex items-center justify-center text-gold-400 flex-shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{item.name}</p>
                    {!item.active && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400">Inactive</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs font-mono mt-0.5">/{item.slug} · {item.format_ids.length} formats · {item.book_count ?? 0} books</p>
                </div>
                <p className="text-gray-500 text-sm tabular-nums hidden sm:block">{item.sort_order}</p>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => handleToggleActive(item)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-600" title={item.active ? 'Deactivate' : 'Reactivate'}>
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
          <div className="relative w-full max-w-lg bg-navy-800 border border-navy-700 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-navy-700">
              <h2 className="text-white font-semibold">{editing ? 'Edit Product Type' : 'New Product Type'}</h2>
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
                <label className="block text-xs text-gray-400 mb-1.5">Icon</label>
                <input type="text" value={form.icon} onChange={(e) => setField('icon', e.target.value)} className={inputCls} placeholder="lucide icon name" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Sort Order</label>
                <input type="number" value={form.sort_order} onChange={(e) => setField('sort_order', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2">Supported Formats</label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-navy-700 rounded-lg p-3">
                  {allFormats.map((format) => (
                    <label key={format.id} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.format_ids.includes(format.id)}
                        onChange={() => toggleFormat(format.id)}
                        className="accent-gold-400"
                      />
                      {format.name}
                      {!format.active && <span className="text-xs text-gray-500">(inactive)</span>}
                    </label>
                  ))}
                </div>
              </div>
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

export default ProductTypeManager;
