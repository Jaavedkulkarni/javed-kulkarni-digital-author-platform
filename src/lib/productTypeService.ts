import { supabase } from './supabase';
import type { ProductType, ProductTypeFormData, ProductTypeWithFormats } from '../types/product';

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

async function loadFormatIdsByProductType(): Promise<Map<string, string[]>> {
  const { data, error } = await supabase
    .from('product_type_formats')
    .select('product_type_id, format_id');

  if (error) throw error;

  const map = new Map<string, string[]>();
  for (const row of data ?? []) {
    const ids = map.get(row.product_type_id) ?? [];
    ids.push(row.format_id);
    map.set(row.product_type_id, ids);
  }
  return map;
}

async function countBooksByProductType(): Promise<Map<string, number>> {
  const { data, error } = await supabase.from('books').select('product_type_id');
  if (error) throw error;

  const map = new Map<string, number>();
  for (const row of data ?? []) {
    if (!row.product_type_id) continue;
    map.set(row.product_type_id, (map.get(row.product_type_id) ?? 0) + 1);
  }
  return map;
}

export async function listProductTypes(options?: {
  includeInactive?: boolean;
  search?: string;
}): Promise<ProductTypeWithFormats[]> {
  let query = supabase
    .from('product_types')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (!options?.includeInactive) {
    query = query.eq('active', true);
  }

  const { data, error } = await query;
  if (error) throw error;

  const formatMap = await loadFormatIdsByProductType();
  const bookCounts = options?.includeInactive ? await countBooksByProductType() : new Map();

  let items: ProductTypeWithFormats[] = (data ?? []).map((row) => ({
    ...(row as ProductType),
    format_ids: formatMap.get(row.id) ?? [],
    book_count: bookCounts.get(row.id) ?? 0,
  }));

  const search = options?.search?.trim().toLowerCase();
  if (search) {
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(search) || item.slug.toLowerCase().includes(search)
    );
  }

  return items;
}

export async function getProductTypeBySlug(slug: string): Promise<ProductType | null> {
  const { data, error } = await supabase
    .from('product_types')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle();

  if (error) throw error;
  return data as ProductType | null;
}

export async function getFormatIdsForProductType(productTypeId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('product_type_formats')
    .select('format_id')
    .eq('product_type_id', productTypeId);

  if (error) throw error;
  return (data ?? []).map((row) => row.format_id);
}

export async function createProductType(form: ProductTypeFormData): Promise<ProductType> {
  const payload = {
    name: form.name.trim(),
    slug: form.slug.trim() || toSlug(form.name),
    icon: form.icon.trim() || null,
    sort_order: parseInt(form.sort_order, 10) || 0,
    active: true,
  };

  const { data, error } = await supabase.from('product_types').insert(payload).select('*').single();
  if (error) throw error;

  await syncProductTypeFormats(data.id, form.format_ids);
  return data as ProductType;
}

export async function updateProductType(
  id: string,
  form: ProductTypeFormData
): Promise<ProductType> {
  const payload = {
    name: form.name.trim(),
    slug: form.slug.trim() || toSlug(form.name),
    icon: form.icon.trim() || null,
    sort_order: parseInt(form.sort_order, 10) || 0,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('product_types')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;

  await syncProductTypeFormats(id, form.format_ids);
  return data as ProductType;
}

export async function setProductTypeActive(id: string, active: boolean): Promise<void> {
  const { error } = await supabase
    .from('product_types')
    .update({ active, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteProductType(id: string): Promise<{ ok: boolean; reason?: string }> {
  const { count, error: countError } = await supabase
    .from('books')
    .select('id', { count: 'exact', head: true })
    .eq('product_type_id', id);

  if (countError) throw countError;
  if ((count ?? 0) > 0) {
    return { ok: false, reason: 'This product type is used by existing books.' };
  }

  const { error } = await supabase.from('product_types').delete().eq('id', id);
  if (error) throw error;
  return { ok: true };
}

export async function syncProductTypeFormats(
  productTypeId: string,
  formatIds: string[]
): Promise<void> {
  const { error: deleteError } = await supabase
    .from('product_type_formats')
    .delete()
    .eq('product_type_id', productTypeId);

  if (deleteError) throw deleteError;

  if (!formatIds.length) return;

  const { error: insertError } = await supabase.from('product_type_formats').insert(
    formatIds.map((format_id) => ({ product_type_id: productTypeId, format_id }))
  );

  if (insertError) throw insertError;
}

export { toSlug as productTypeToSlug };
