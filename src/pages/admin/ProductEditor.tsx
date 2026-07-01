import { useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { useProducts } from '../../context/ProductContext';
import { listFormats } from '../../lib/formatService';
import { listProductTypes } from '../../lib/productTypeService';
import { AdminLayout } from './AdminLayout';
import { AdminWarning } from './AdminWarning';
import { MediaPicker } from '../../components/admin/MediaPicker';
import { MEDIA_PATHS } from '../../config/media';
import { RichTextEditor } from '../../components/editor/RichTextEditor';
import type { BookCategory } from '../../types/book';
import {
  emptyProductForm,
  generateProductSlug,
  productToForm,
  CURRENCY_OPTIONS,
  TAX_CLASS_OPTIONS,
  type Product,
  type ProductFormData,
} from '../../types/productEntity';
import type { Format, ProductTypeWithFormats } from '../../types/product';
import {
  ChevronLeft,
  Star,
  Sparkles,
  Save,
  Send,
  AlertCircle,
  CheckCircle2,
  Plus,
  X,
  EyeOff,
  Lock,
} from 'lucide-react';

export interface ProductEditorProps {
  product: Product | null;
  onCancel: () => void;
  onSaved: () => void;
  defaultProductTypeSlug?: string;
  returnLabel?: string;
  slugPrefix?: string;
  titleNew?: string;
  titleEdit?: string;
}

const inputCls =
  'w-full px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white placeholder-gray-500 focus:border-gold-400 focus:outline-none text-sm';

const selectCls =
  'w-full px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-white focus:border-gold-400 focus:outline-none text-sm';

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{children}</p>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function CharCount({ value, limit }: { value: string; limit: number }) {
  return (
    <p className={`text-xs mt-1 text-right ${value.length > limit ? 'text-red-400' : 'text-gray-500'}`}>
      {value.length}/{limit}
    </p>
  );
}

export function ProductEditor({
  product,
  onCancel,
  onSaved,
  defaultProductTypeSlug = 'book',
  returnLabel = 'Back to products',
  slugPrefix = '/books/',
  titleNew = 'New Product',
  titleEdit = 'Edit Product',
}: ProductEditorProps) {
  const { createProduct, updateProduct, clearFeaturedExcept } = useProducts();
  const [form, setForm] = useState<ProductFormData>(() =>
    product ? productToForm(product) : emptyProductForm()
  );
  const [categories, setCategories] = useState<BookCategory[]>([]);
  const [productTypes, setProductTypes] = useState<ProductTypeWithFormats[]>([]);
  const [availableFormats, setAvailableFormats] = useState<Format[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productMetaLoading, setProductMetaLoading] = useState(true);
  const [slugManual, setSlugManual] = useState(!!product);
  const [productId, setProductId] = useState<string | null>(product?.id ?? null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const selectedType = productTypes.find((t) => t.id === form.product_type_id);
  const isBookType = selectedType?.slug === 'book' || defaultProductTypeSlug === 'book';

  useEffect(() => {
    supabase
      .from('book_categories')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        setCategories(error ? [] : (data ?? []));
        setCategoriesLoading(false);
      });
  }, []);

  useEffect(() => {
    setProductMetaLoading(true);
    listProductTypes()
      .then((types) => {
        setProductTypes(types);
        if (!product?.product_type_id) {
          const defaultType = types.find((t) => t.slug === defaultProductTypeSlug);
          if (defaultType) {
            setForm((prev) =>
              prev.product_type_id ? prev : { ...prev, product_type_id: defaultType.id }
            );
          }
        }
      })
      .catch(console.error)
      .finally(() => setProductMetaLoading(false));
  }, [product?.product_type_id, defaultProductTypeSlug]);

  useEffect(() => {
    if (!form.product_type_id) {
      setAvailableFormats([]);
      return;
    }
    listFormats({ productTypeId: form.product_type_id }).then(setAvailableFormats).catch(console.error);
  }, [form.product_type_id]);

  useEffect(() => {
    if (!availableFormats.length) return;
    const validIds = new Set(availableFormats.map((f) => f.id));
    setForm((prev) => {
      const filtered = prev.format_ids.filter((id) => validIds.has(id));
      if (filtered.length === prev.format_ids.length) return prev;
      return { ...prev, format_ids: filtered };
    });
  }, [availableFormats]);

  const setField = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'title' && !slugManual) {
        next.slug = generateProductSlug(value as string);
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

  const addGalleryImage = () => {
    setForm((prev) => ({ ...prev, gallery_images: [...prev.gallery_images, ''] }));
  };

  const updateGalleryImage = (index: number, url: string) => {
    setForm((prev) => {
      const next = [...prev.gallery_images];
      next[index] = url;
      return { ...prev, gallery_images: next };
    });
  };

  const removeGalleryImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index),
    }));
  };

  const showMsg = (type: 'success' | 'error', text: string) => {
    setSaveMsg({ type, text });
    setTimeout(() => setSaveMsg(null), 3500);
  };

  const save = async (overrideStatus?: ProductFormData['status']) => {
    if (!form.title.trim()) {
      showMsg('error', 'Title is required.');
      return;
    }
    const slug = form.slug.trim() || generateProductSlug(form.title);
    if (!slug) {
      showMsg('error', 'Slug is required.');
      return;
    }

    setSaving(true);
    try {
      const status = overrideStatus ?? form.status;
      if (form.is_featured) await clearFeaturedExcept(productId ?? undefined);

      const payload: ProductFormData = {
        ...form,
        slug,
        status,
        gallery_images: form.gallery_images.filter(Boolean),
        meta_title: form.meta_title || form.title,
        meta_description: form.meta_description || form.short_description,
        og_image: form.og_image || form.cover_image,
      };

      if (productId) {
        await updateProduct(productId, payload);
      } else {
        const created = await createProduct(payload, defaultProductTypeSlug);
        if (created) setProductId(created.id);
      }

      showMsg('success', status === 'published' ? 'Product published!' : 'Draft saved.');
      if (overrideStatus === 'published') setTimeout(onSaved, 800);
    } catch (err: unknown) {
      showMsg('error', err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const isEditing = !!product || !!productId;

  return (
    <AdminLayout title={isEditing ? titleEdit : titleNew}>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {returnLabel}
        </button>

        {saveMsg && (
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
              saveMsg.type === 'success'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                : 'bg-red-500/15 text-red-400 border border-red-500/25'
            }`}
          >
            {saveMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {saveMsg.text}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => save('draft')} disabled={saving} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 text-gray-300 text-sm hover:text-white disabled:opacity-50">
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button type="button" onClick={() => save('published')} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-900 text-sm font-semibold disabled:opacity-50 shadow-lg shadow-gold-500/20">
            <Send className="w-4 h-4" /> Publish
          </button>
        </div>
      </div>

      {!categoriesLoading && categories.length === 0 && (
        <AdminWarning title="Categories missing" message='Run migration "006_create_books_schema.sql" to seed book_categories.' />
      )}

      <div className="grid xl:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-5 min-w-0">
          {/* General */}
          <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
            <SectionLabel>General</SectionLabel>
            <input type="text" value={form.title} onChange={(e) => setField('title', e.target.value)} placeholder="Product title..." className="w-full px-0 py-1 bg-transparent border-none text-white text-2xl font-bold placeholder-navy-600 focus:outline-none" />
            <input type="text" value={form.subtitle} onChange={(e) => setField('subtitle', e.target.value)} placeholder="Subtitle (optional)..." className="w-full px-0 py-1 bg-transparent border-none text-gold-300/70 text-base placeholder-navy-600 focus:outline-none" />
            <div className="flex gap-2 items-center pt-1 border-t border-navy-700">
              <span className="text-xs text-gray-500 font-mono flex-shrink-0">{slugPrefix}</span>
              <input type="text" value={form.slug} onChange={(e) => { setSlugManual(true); setField('slug', e.target.value); }} className="flex-1 px-2 py-1 rounded bg-navy-700 border border-navy-600 text-white text-xs font-mono focus:border-gold-400 focus:outline-none" placeholder="product-slug" />
              <button type="button" onClick={() => { setSlugManual(false); setField('slug', generateProductSlug(form.title)); }} className="text-xs text-gray-400 hover:text-gold-400 px-2 py-1 rounded hover:bg-navy-700">Auto-generate</button>
            </div>
            <Field label="Short Description">
              <textarea value={form.short_description} onChange={(e) => setField('short_description', e.target.value)} rows={3} className={`${inputCls} resize-none`} />
            </Field>
          </div>

          <div className="bg-navy-800 border border-navy-700 rounded-xl p-6">
            <SectionLabel>Full Description</SectionLabel>
            <div className="mt-3">
              <RichTextEditor content={form.full_description} onChange={(val) => setField('full_description', val)} />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
            <SectionLabel>Pricing</SectionLabel>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Regular Price"><input type="number" min={0} step="0.01" value={form.regular_price} onChange={(e) => setField('regular_price', e.target.value)} className={inputCls} placeholder="0.00" /></Field>
              <Field label="Sale Price"><input type="number" min={0} step="0.01" value={form.sale_price} onChange={(e) => setField('sale_price', e.target.value)} className={inputCls} placeholder="0.00" /></Field>
              <Field label="Cost Price"><input type="number" min={0} step="0.01" value={form.cost_price} onChange={(e) => setField('cost_price', e.target.value)} className={inputCls} placeholder="0.00" /></Field>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Currency">
                <select value={form.currency} onChange={(e) => setField('currency', e.target.value)} className={selectCls}>
                  {CURRENCY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Tax Class">
                <select value={form.tax_class} onChange={(e) => setField('tax_class', e.target.value)} className={selectCls}>
                  {TAX_CLASS_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </Field>
              <Field label="GST %"><input type="number" min={0} max={100} step="0.01" value={form.gst_percent} onChange={(e) => setField('gst_percent', e.target.value)} className={inputCls} /></Field>
            </div>
            <Field label="SKU"><input type="text" value={form.sku} onChange={(e) => setField('sku', e.target.value)} className={inputCls} placeholder="SKU-001" /></Field>
          </div>

          {/* Inventory */}
          <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
            <SectionLabel>Inventory</SectionLabel>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.track_inventory} onChange={(e) => setField('track_inventory', e.target.checked)} className="accent-gold-400" />
              <span className="text-sm text-gray-300">Track Inventory</span>
            </label>
            {form.track_inventory && (
              <Field label="Stock Quantity">
                <input type="number" min={0} value={form.stock_quantity} onChange={(e) => setField('stock_quantity', e.target.value)} className={inputCls} />
              </Field>
            )}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.allow_backorders} onChange={(e) => setField('allow_backorders', e.target.checked)} className="accent-gold-400" />
              <span className="text-sm text-gray-300">Allow Backorders</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.shipping_required} onChange={(e) => setField('shipping_required', e.target.checked)} className="accent-gold-400" />
              <span className="text-sm text-gray-300">Shipping Required</span>
            </label>
          </div>

          {/* Digital metadata */}
          <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
            <SectionLabel>Digital</SectionLabel>
            <p className="text-xs text-gray-500">Metadata only — download delivery is not enabled in this sprint.</p>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.downloadable} onChange={(e) => setField('downloadable', e.target.checked)} className="accent-gold-400" />
              <span className="text-sm text-gray-300">Downloadable</span>
            </label>
            {form.downloadable && (
              <>
                <Field label="Download File">
                  <MediaPicker value={form.download_file} onChange={(url) => setField('download_file', url)} acceptKinds={['pdf', 'epub']} uploadFolder={MEDIA_PATHS.pdfs} previewAspect="square" emptyLabel="Upload or select a downloadable file." />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Download Limit"><input type="number" min={0} value={form.download_limit} onChange={(e) => setField('download_limit', e.target.value)} className={inputCls} placeholder="Unlimited" /></Field>
                  <Field label="Download Expiry (days)"><input type="number" min={0} value={form.download_expiry_days} onChange={(e) => setField('download_expiry_days', e.target.value)} className={inputCls} placeholder="Never" /></Field>
                </div>
              </>
            )}
          </div>

          {/* Book fields */}
          <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
            <SectionLabel>Book Fields {isBookType ? '' : '(optional)'}</SectionLabel>
            <Field label="Author"><input type="text" value={form.author_name} onChange={(e) => setField('author_name', e.target.value)} className={inputCls} /></Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="ISBN"><input type="text" value={form.isbn} onChange={(e) => setField('isbn', e.target.value)} className={inputCls} placeholder="978-..." /></Field>
              <Field label="Total Pages"><input type="number" min={1} value={form.total_pages} onChange={(e) => setField('total_pages', e.target.value)} className={inputCls} /></Field>
            </div>
            <Field label="Sample PDF">
              <MediaPicker value={form.sample_pdf_url} onChange={(url) => setField('sample_pdf_url', url)} acceptKinds={['pdf']} uploadFolder={MEDIA_PATHS.pdfs} previewAspect="square" emptyLabel="Upload or select sample PDF." />
            </Field>
            <Field label="Amazon URL"><input type="url" value={form.amazon_url} onChange={(e) => setField('amazon_url', e.target.value)} className={inputCls} placeholder="https://www.amazon.in/..." /></Field>
          </div>

          {/* SEO */}
          <div className="bg-navy-800 border border-navy-700 rounded-xl p-6 space-y-4">
            <SectionLabel>SEO</SectionLabel>
            <Field label="Meta Title"><input type="text" value={form.meta_title} onChange={(e) => setField('meta_title', e.target.value)} className={inputCls} /><CharCount value={form.meta_title} limit={60} /></Field>
            <Field label="Meta Description"><textarea value={form.meta_description} onChange={(e) => setField('meta_description', e.target.value)} rows={2} className={`${inputCls} resize-none`} /><CharCount value={form.meta_description} limit={160} /></Field>
            <Field label="OG Image"><MediaPicker value={form.og_image} onChange={(url) => setField('og_image', url)} acceptKinds={['image']} uploadFolder={MEDIA_PATHS.images} previewAspect="square" emptyLabel="Open Graph image (defaults to cover)." /></Field>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 space-y-4">
            <SectionLabel>Publish</SectionLabel>
            <Field label="Status">
              <select value={form.status} onChange={(e) => setField('status', e.target.value as ProductFormData['status'])} className={selectCls}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </Field>
            <Field label="Publication Date"><input type="date" value={form.publication_date} onChange={(e) => setField('publication_date', e.target.value)} className={inputCls} /></Field>
            <Field label="Sort Order"><input type="number" value={form.sort_order} onChange={(e) => setField('sort_order', e.target.value)} className={inputCls} /></Field>
          </div>

          <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 space-y-3">
            <SectionLabel>Visibility</SectionLabel>
            <label className="flex items-center gap-2.5 cursor-pointer"><input type="checkbox" checked={form.is_featured} onChange={(e) => setField('is_featured', e.target.checked)} className="accent-gold-400" /><Star className="w-3.5 h-3.5 text-gold-400" /><span className="text-sm text-gray-300">Featured</span></label>
            <label className="flex items-center gap-2.5 cursor-pointer"><input type="checkbox" checked={form.is_new_release} onChange={(e) => setField('is_new_release', e.target.checked)} className="accent-gold-400" /><Sparkles className="w-3.5 h-3.5 text-gold-400" /><span className="text-sm text-gray-300">New Release</span></label>
            <label className="flex items-center gap-2.5 cursor-pointer"><input type="checkbox" checked={form.is_hidden} onChange={(e) => setField('is_hidden', e.target.checked)} className="accent-gold-400" /><EyeOff className="w-3.5 h-3.5 text-gray-400" /><span className="text-sm text-gray-300">Hidden</span></label>
            <label className="flex items-center gap-2.5 cursor-pointer"><input type="checkbox" checked={form.members_only} onChange={(e) => setField('members_only', e.target.checked)} className="accent-gold-400" /><Lock className="w-3.5 h-3.5 text-gray-400" /><span className="text-sm text-gray-300">Members Only</span></label>
          </div>

          <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 space-y-4">
            <SectionLabel>Product Type</SectionLabel>
            {productMetaLoading ? <p className="text-sm text-gray-500">Loading...</p> : (
              <select value={form.product_type_id} onChange={(e) => setField('product_type_id', e.target.value)} className={selectCls}>
                <option value="">-- Select type --</option>
                {productTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            )}
          </div>

          <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 space-y-4">
            <SectionLabel>Category</SectionLabel>
            <select value={form.category_id} onChange={(e) => setField('category_id', e.target.value)} className={selectCls} disabled={categoriesLoading}>
              <option value="">-- Select category --</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
            <SectionLabel>Language</SectionLabel>
            <select value={form.language} onChange={(e) => setField('language', e.target.value)} className={`${selectCls} mt-3`}>
              <option value="मराठी">मराठी</option>
              <option value="English">English</option>
            </select>
          </div>

          <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 space-y-3">
            <SectionLabel>Formats</SectionLabel>
            {!form.product_type_id ? <p className="text-sm text-gray-500">Select a product type first.</p> : availableFormats.length === 0 ? <p className="text-sm text-gray-500">No formats configured.</p> : (
              <div className="space-y-2">
                {availableFormats.map((format) => (
                  <label key={format.id} className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={form.format_ids.includes(format.id)} onChange={() => toggleFormat(format.id)} className="accent-gold-400" />
                    <span className="text-sm text-gray-300">{format.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
            <SectionLabel>Cover Image</SectionLabel>
            <div className="mt-3">
              <MediaPicker value={form.cover_image} onChange={(url) => setField('cover_image', url)} acceptKinds={['image']} uploadFolder={MEDIA_PATHS.covers} previewAspect="book" emptyLabel="Upload or choose cover." />
            </div>
          </div>

          <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <SectionLabel>Gallery Images</SectionLabel>
              <button type="button" onClick={addGalleryImage} className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
            </div>
            {form.gallery_images.length === 0 ? <p className="text-sm text-gray-500">No gallery images.</p> : (
              form.gallery_images.map((url, index) => (
                <div key={index} className="relative">
                  <MediaPicker value={url} onChange={(v) => updateGalleryImage(index, v)} acceptKinds={['image']} uploadFolder={MEDIA_PATHS.images} previewAspect="square" emptyLabel="Gallery image" />
                  <button type="button" onClick={() => removeGalleryImage(index)} className="absolute top-1 right-1 p-1 rounded bg-navy-900/80 text-gray-400 hover:text-red-400"><X className="w-3 h-3" /></button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ProductEditor;
