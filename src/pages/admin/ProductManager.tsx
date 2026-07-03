import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { listProductTypes } from '../../lib/productTypeService';
import { supabase } from '../../lib/supabase';
import { AdminLayout } from './AdminLayout';
import { AdminWarning } from './AdminWarning';
import { ProductEditor } from './ProductEditor';
import type { Product, ProductListItem } from '../../types/productEntity';
import type { ProductTypeWithFormats } from '../../types/product';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Package,
  ChevronLeft,
  ChevronRight,
  Star,
  Filter,
  Sparkles,
  EyeOff,
} from 'lucide-react';
import { format } from 'date-fns';
import { adminPathFromView } from '../../lib/adminPaths';
import { getProductEditorMode, productEditorPath } from '../../lib/adminEditorRoutes';

const PAGE_SIZE = 15;
const LANGUAGE_OPTIONS = ['मराठी', 'English'];

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  draft: 'bg-gray-500/15 text-gray-400 border-gray-500/25',
};

export function ProductManager() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editorMode = getProductEditorMode(location.pathname);
  const { getProducts, getProduct, deleteProduct } = useProducts();

  const [items, setItems] = useState<ProductListItem[]>([]);
  const [productTypes, setProductTypes] = useState<ProductTypeWithFormats[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [tableEmpty, setTableEmpty] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const isEditorOpen = editorMode !== null;

  useEffect(() => {
    if (editorMode !== 'edit') return;
    const id = searchParams.get('id');
    if (!id) {
      navigate(adminPathFromView('products'), { replace: true });
      return;
    }
    if (editingProduct?.id === id) return;
    getProduct(id).then((full) => {
      if (full) setEditingProduct(full);
      else navigate(adminPathFromView('products'), { replace: true });
    });
  }, [editorMode, searchParams, editingProduct?.id, getProduct, navigate]);

  useEffect(() => {
    if (editorMode === 'create') setEditingProduct(null);
  }, [editorMode]);

  useEffect(() => {
    listProductTypes().then(setProductTypes).catch(console.error);
    supabase
      .from('book_categories')
      .select('id, name')
      .order('sort_order', { ascending: true })
      .then(({ data }) => setCategories(data ?? []));
  }, []);

  useEffect(() => {
    supabase
      .from('books')
      .select('id', { count: 'exact', head: true })
      .then(({ count }) => setTableEmpty((count ?? 0) === 0));
  }, [items, total]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getProducts({
        page,
        limit: PAGE_SIZE,
        search: searchQuery || undefined,
        status: filterStatus as 'all' | 'draft' | 'published',
        category_id: filterCategory || undefined,
        product_type_id: filterType || undefined,
        language: filterLanguage || undefined,
        sort_by: 'created_at',
        sort_order: 'desc',
      });
      setItems(result.data);
      setTotal(result.total);
    } catch (err) {
      console.error(err);
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [getProducts, page, searchQuery, filterStatus, filterCategory, filterType, filterLanguage]);

  useEffect(() => {
    if (!isEditorOpen) loadProducts();
  }, [isEditorOpen, loadProducts]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterStatus, filterCategory, filterType, filterLanguage]);

  const handleCreateNew = () => {
    setEditingProduct(null);
    navigate(productEditorPath('create'));
  };

  const handleEdit = async (item: ProductListItem) => {
    const full = await getProduct(item.id);
    if (!full) return;
    setEditingProduct(full);
    navigate(productEditorPath('edit', full.id));
  };

  const handleCancel = () => {
    setEditingProduct(null);
    navigate(adminPathFromView('products'));
  };

  const handleSaved = () => {
    setEditingProduct(null);
    navigate(adminPathFromView('products'));
    void loadProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product permanently?')) return;
    setDeletingId(id);
    const ok = await deleteProduct(id);
    if (ok) {
      setItems((prev) => prev.filter((p) => p.id !== id));
      setTotal((prev) => prev - 1);
    }
    setDeletingId(null);
  };

  const hasActiveFilters =
    !!searchQuery ||
    filterStatus !== 'all' ||
    !!filterCategory ||
    !!filterType ||
    !!filterLanguage;

  if (isEditorOpen) {
    if (editorMode === 'edit' && !editingProduct) {
      return (
        <AdminLayout title="Products">
          <div className="py-24 flex justify-center">
            <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
          </div>
        </AdminLayout>
      );
    }

    return (
      <ProductEditor
        product={editingProduct}
        onCancel={handleCancel}
        onSaved={handleSaved}
      />
    );
  }

  return (
    <AdminLayout title="Products">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-gold-400" />
            Products
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} products total</p>
        </div>
        <button
          type="button"
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold text-sm rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Product
        </button>
      </div>

      {tableEmpty && !hasActiveFilters && !loading && (
        <AdminWarning
          title="Products table is empty"
          message="No products found. Existing book seed data or new products will appear here."
        />
      )}

      <div className="bg-navy-800 border border-navy-700 rounded-xl p-4 mb-5 flex flex-col xl:flex-row gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearchQuery(searchInput.trim());
          }}
          className="flex-1 flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search title, slug, SKU..."
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white text-sm focus:border-gold-400 focus:outline-none"
            />
            {searchInput && (
              <button type="button" onClick={() => { setSearchInput(''); setSearchQuery(''); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button type="submit" className="px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-gray-300 text-sm hover:text-white">Search</button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white text-sm">
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white text-sm">
            <option value="">All Types</option>
            {productTypes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white text-sm">
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select value={filterLanguage} onChange={(e) => setFilterLanguage(e.target.value)} className="px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white text-sm">
            <option value="">All Languages</option>
            {LANGUAGE_OPTIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-navy-800 border border-navy-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No products found.</div>
        ) : (
          <>
            <div className="hidden lg:grid grid-cols-[48px_1fr_120px_120px_90px_100px_80px] gap-3 px-5 py-2.5 bg-navy-900/50 border-b border-navy-700 text-xs font-semibold text-gray-500 uppercase">
              <span>Cover</span>
              <span>Title</span>
              <span>Type</span>
              <span>Category</span>
              <span>Status</span>
              <span>Price</span>
              <span className="text-right">Actions</span>
            </div>
            <div className="divide-y divide-navy-700/60">
              {items.map((item) => (
                <ProductRow key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} deletingId={deletingId} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-navy-700">
                <p className="text-sm text-gray-500">{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}</p>
                <div className="flex gap-1">
                  <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="p-1.5 rounded-lg text-gray-400 hover:text-white disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
                  <button type="button" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="p-1.5 rounded-lg text-gray-400 hover:text-white disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

function ProductRow({
  item,
  onEdit,
  onDelete,
  deletingId,
}: {
  item: ProductListItem;
  onEdit: (item: ProductListItem) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}) {
  const price = item.sale_price ?? item.regular_price;
  return (
    <div className={`px-5 py-3.5 hover:bg-navy-700/30 ${deletingId === item.id ? 'opacity-50' : ''}`}>
      <div className="hidden lg:grid grid-cols-[48px_1fr_120px_120px_90px_100px_80px] gap-3 items-center">
        <div className="w-10 h-14 rounded-lg overflow-hidden bg-navy-700 flex items-center justify-center">
          {item.cover_image ? (
            <img src={item.cover_image} alt="" className="w-full h-full object-contain bg-white p-0.5" />
          ) : (
            <Package className="w-4 h-4 text-gray-500" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-white text-sm font-medium truncate">{item.title}</p>
            {item.is_featured && <Star className="w-3 h-3 text-gold-400 fill-gold-400" />}
            {item.is_new_release && <Sparkles className="w-3 h-3 text-gold-400" />}
            {item.is_hidden && <EyeOff className="w-3 h-3 text-gray-500" />}
          </div>
          <p className="text-gray-500 text-xs font-mono truncate">/{item.slug}</p>
        </div>
        <span className="text-sm text-gray-400 truncate">{item.product_type?.name ?? '—'}</span>
        <span className="text-sm text-gray-400 truncate">{item.category?.name ?? '—'}</span>
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs border w-fit ${STATUS_STYLES[item.status] ?? ''}`}>{item.status}</span>
        <span className="text-sm text-gray-400">{price != null ? `₹${price}` : '—'}</span>
        <div className="flex justify-end gap-1">
          <button type="button" onClick={() => onEdit(item)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-600"><Edit3 className="w-3.5 h-3.5" /></button>
          <button type="button" onClick={() => onDelete(item.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      <div className="lg:hidden flex items-center gap-3">
        <div className="w-10 h-14 rounded-lg bg-navy-700 flex-shrink-0 overflow-hidden">
          {item.cover_image && <img src={item.cover_image} alt="" className="w-full h-full object-contain bg-white p-0.5" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{item.title}</p>
          <p className="text-xs text-gray-500">{item.product_type?.name} · {item.status} · {item.publication_date ? format(new Date(item.publication_date), 'd MMM yyyy') : '—'}</p>
        </div>
        <button type="button" onClick={() => onEdit(item)} className="p-2 text-gray-400"><Edit3 className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
}

export default ProductManager;
