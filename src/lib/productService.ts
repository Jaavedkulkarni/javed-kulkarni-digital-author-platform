import { supabase } from './supabase';
import { getBookFormatIds, syncBookFormats } from './formatService';
import { getProductTypeBySlug } from './productTypeService';
import type {
  PaginatedProducts,
  Product,
  ProductFilters,
  ProductFormData,
  ProductListItem,
} from '../types/productEntity';

const LIST_SELECT =
  'id, title, slug, subtitle, cover_image, category_id, product_type_id, language, status, is_featured, is_new_release, is_hidden, sku, regular_price, sale_price, publication_date, created_at, category:book_categories(id, name, slug), product_type:product_types(id, name, slug)';

const FULL_SELECT = '*, category:book_categories(*), product_type:product_types(id, name, slug)';

function parseOptionalNumber(value: string | undefined): number | null {
  if (value === undefined || value.trim() === '') return null;
  const n = parseFloat(value);
  return Number.isNaN(n) ? null : n;
}

function parseOptionalInt(value: string | undefined): number | null {
  if (value === undefined || value.trim() === '') return null;
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? null : n;
}

function normalizeJoins<T extends { category?: unknown; product_type?: unknown }>(item: T): T {
  const category = item.category;
  const product_type = item.product_type;
  return {
    ...item,
    category: Array.isArray(category) ? category[0] ?? null : category,
    product_type: Array.isArray(product_type) ? product_type[0] ?? null : product_type,
  };
}

function normalizeGallery(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string');
  }
  return [];
}

function formToRow(data: Partial<ProductFormData>): Record<string, unknown> {
  const row: Record<string, unknown> = {};

  if (data.title !== undefined) row.title = data.title;
  if (data.subtitle !== undefined) row.subtitle = data.subtitle || null;
  if (data.slug !== undefined) row.slug = data.slug;
  if (data.short_description !== undefined) row.short_description = data.short_description || null;
  if (data.full_description !== undefined) row.full_description = data.full_description || null;
  if (data.cover_image !== undefined) row.cover_image = data.cover_image || null;
  if (data.gallery_images !== undefined) row.gallery_images = data.gallery_images;
  if (data.category_id !== undefined) row.category_id = data.category_id || null;
  if (data.product_type_id !== undefined) row.product_type_id = data.product_type_id || null;
  if (data.language !== undefined) row.language = data.language;
  if (data.status !== undefined) row.status = data.status;
  if (data.sort_order !== undefined) row.sort_order = parseInt(data.sort_order, 10) || 0;
  if (data.is_featured !== undefined) row.is_featured = data.is_featured;
  if (data.is_new_release !== undefined) row.is_new_release = data.is_new_release;
  if (data.is_hidden !== undefined) row.is_hidden = data.is_hidden;
  if (data.members_only !== undefined) row.members_only = data.members_only;
  if (data.regular_price !== undefined) row.regular_price = parseOptionalNumber(data.regular_price);
  if (data.sale_price !== undefined) row.sale_price = parseOptionalNumber(data.sale_price);
  if (data.cost_price !== undefined) row.cost_price = parseOptionalNumber(data.cost_price);
  if (data.currency !== undefined) row.currency = data.currency || 'INR';
  if (data.tax_class !== undefined) row.tax_class = data.tax_class || 'standard';
  if (data.gst_percent !== undefined) row.gst_percent = parseOptionalNumber(data.gst_percent);
  if (data.sku !== undefined) row.sku = data.sku.trim() || null;
  if (data.track_inventory !== undefined) row.track_inventory = data.track_inventory;
  if (data.stock_quantity !== undefined) row.stock_quantity = parseInt(data.stock_quantity, 10) || 0;
  if (data.allow_backorders !== undefined) row.allow_backorders = data.allow_backorders;
  if (data.shipping_required !== undefined) row.shipping_required = data.shipping_required;
  if (data.downloadable !== undefined) row.downloadable = data.downloadable;
  if (data.download_file !== undefined) row.download_file = data.download_file || null;
  if (data.download_limit !== undefined) row.download_limit = parseOptionalInt(data.download_limit);
  if (data.download_expiry_days !== undefined) {
    row.download_expiry_days = parseOptionalInt(data.download_expiry_days);
  }
  if (data.isbn !== undefined) row.isbn = data.isbn || null;
  if (data.total_pages !== undefined) row.total_pages = parseOptionalInt(data.total_pages);
  if (data.author_name !== undefined) row.author_name = data.author_name;
  if (data.sample_pdf_url !== undefined) row.sample_pdf_url = data.sample_pdf_url || null;
  if (data.amazon_url !== undefined) row.amazon_url = data.amazon_url || null;
  if (data.publication_date !== undefined) row.publication_date = data.publication_date || null;
  if (data.meta_title !== undefined) row.meta_title = data.meta_title || null;
  if (data.meta_description !== undefined) row.meta_description = data.meta_description || null;
  if (data.og_image !== undefined) row.og_image = data.og_image || null;

  row.updated_at = new Date().toISOString();
  return row;
}

function mapRowToProduct(row: Record<string, unknown>, format_ids: string[] = []): Product {
  const normalized = normalizeJoins(row as Product);
  return {
    ...normalized,
    gallery_images: normalizeGallery(row.gallery_images),
    table_of_contents: Array.isArray(row.table_of_contents) ? (row.table_of_contents as string[]) : [],
    related_slugs: Array.isArray(row.related_slugs) ? (row.related_slugs as string[]) : [],
    featured_highlights: Array.isArray(row.featured_highlights)
      ? (row.featured_highlights as string[])
      : [],
    format_ids,
  } as Product;
}

async function resolveDefaultProductTypeId(slug = 'book'): Promise<string | null> {
  const type = await getProductTypeBySlug(slug);
  return type?.id ?? null;
}

export async function getProducts(filters?: ProductFilters): Promise<PaginatedProducts> {
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 15;
  const offset = (page - 1) * limit;

  let query = supabase.from('books').select(LIST_SELECT, { count: 'exact' });

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters?.category_id) {
    query = query.eq('category_id', filters.category_id);
  }
  if (filters?.product_type_id) {
    query = query.eq('product_type_id', filters.product_type_id);
  }
  if (filters?.language) {
    query = query.eq('language', filters.language);
  }
  if (filters?.search?.trim()) {
    const q = filters.search.trim();
    query = query.or(
      `title.ilike.%${q}%,slug.ilike.%${q}%,subtitle.ilike.%${q}%,short_description.ilike.%${q}%,sku.ilike.%${q}%`
    );
  }

  const sortColumn = filters?.sort_by ?? 'created_at';
  const sortAscending = filters?.sort_order === 'asc';
  query = query.order(sortColumn, { ascending: sortAscending }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: (data ?? []).map((item) => normalizeJoins(item) as ProductListItem),
    total: count ?? 0,
    page,
    limit,
    total_pages: Math.ceil((count ?? 0) / limit),
  };
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase.from('books').select(FULL_SELECT).eq('id', id).maybeSingle();
  if (error || !data) return null;
  const format_ids = await getBookFormatIds(id);
  return mapRowToProduct(data as Record<string, unknown>, format_ids);
}

export async function createProduct(
  data: Partial<ProductFormData>,
  defaultTypeSlug = 'book'
): Promise<Product | null> {
  const row = formToRow(data);
  if (!row.product_type_id) {
    row.product_type_id = await resolveDefaultProductTypeId(defaultTypeSlug);
  }

  const { data: created, error } = await supabase.from('books').insert(row).select(FULL_SELECT).single();
  if (error) throw error;

  if (data.format_ids !== undefined) {
    await syncBookFormats(created.id, data.format_ids);
  }

  return mapRowToProduct(created as Record<string, unknown>, data.format_ids ?? []);
}

export async function updateProduct(id: string, data: Partial<ProductFormData>): Promise<Product | null> {
  const { data: updated, error } = await supabase
    .from('books')
    .update(formToRow(data))
    .eq('id', id)
    .select(FULL_SELECT)
    .single();

  if (error) throw error;

  if (data.format_ids !== undefined) {
    await syncBookFormats(id, data.format_ids);
  }

  const format_ids =
    data.format_ids !== undefined ? data.format_ids : await getBookFormatIds(id);
  return mapRowToProduct(updated as Record<string, unknown>, format_ids);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase.from('books').delete().eq('id', id);
  return !error;
}

export async function searchProducts(
  query: string,
  page = 1,
  limit = 15,
  filters?: Omit<ProductFilters, 'search' | 'page' | 'limit'>
): Promise<PaginatedProducts> {
  return getProducts({ ...filters, search: query, page, limit });
}

export async function clearFeaturedExcept(exceptId?: string): Promise<void> {
  let query = supabase.from('books').update({ is_featured: false });
  if (exceptId) query = query.neq('id', exceptId);
  await query;
}

export { generateProductSlug as productToSlug } from '../types/productEntity';
