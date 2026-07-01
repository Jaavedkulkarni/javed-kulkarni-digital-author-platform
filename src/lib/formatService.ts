import { supabase } from './supabase';
import type { Format, FormatFormData, FormatWithUsage } from '../types/product';

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

async function countProductTypeLinks(): Promise<Map<string, number>> {
  const { data, error } = await supabase
    .from('product_type_formats')
    .select('format_id');

  if (error) throw error;

  const map = new Map<string, number>();
  for (const row of data ?? []) {
    map.set(row.format_id, (map.get(row.format_id) ?? 0) + 1);
  }
  return map;
}

async function countBookLinks(): Promise<Map<string, number>> {
  const { data, error } = await supabase.from('book_formats').select('format_id');
  if (error) throw error;

  const map = new Map<string, number>();
  for (const row of data ?? []) {
    map.set(row.format_id, (map.get(row.format_id) ?? 0) + 1);
  }
  return map;
}

export async function listFormats(options?: {
  includeInactive?: boolean;
  search?: string;
  productTypeId?: string;
}): Promise<FormatWithUsage[]> {
  let formatIdsFilter: string[] | null = null;

  if (options?.productTypeId) {
    const { data, error } = await supabase
      .from('product_type_formats')
      .select('format_id')
      .eq('product_type_id', options.productTypeId);

    if (error) throw error;
    formatIdsFilter = (data ?? []).map((row) => row.format_id);
    if (!formatIdsFilter.length) return [];
  }

  let query = supabase
    .from('formats')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (!options?.includeInactive) {
    query = query.eq('active', true);
  }

  if (formatIdsFilter) {
    query = query.in('id', formatIdsFilter);
  }

  const { data, error } = await query;
  if (error) throw error;

  const typeCounts = options?.includeInactive ? await countProductTypeLinks() : new Map();
  const bookCounts = options?.includeInactive ? await countBookLinks() : new Map();

  let items: FormatWithUsage[] = (data ?? []).map((row) => ({
    ...(row as Format),
    product_type_count: typeCounts.get(row.id) ?? 0,
    book_count: bookCounts.get(row.id) ?? 0,
  }));

  const search = options?.search?.trim().toLowerCase();
  if (search) {
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        item.slug.toLowerCase().includes(search) ||
        item.format_type.toLowerCase().includes(search)
    );
  }

  return items;
}

export async function createFormat(form: FormatFormData): Promise<Format> {
  const payload = {
    name: form.name.trim(),
    slug: form.slug.trim() || toSlug(form.name),
    format_type: form.format_type.trim() || 'digital',
    downloadable: form.downloadable,
    shipping_required: form.shipping_required,
    sort_order: parseInt(form.sort_order, 10) || 0,
    active: true,
  };

  const { data, error } = await supabase.from('formats').insert(payload).select('*').single();
  if (error) throw error;
  return data as Format;
}

export async function updateFormat(id: string, form: FormatFormData): Promise<Format> {
  const payload = {
    name: form.name.trim(),
    slug: form.slug.trim() || toSlug(form.name),
    format_type: form.format_type.trim() || 'digital',
    downloadable: form.downloadable,
    shipping_required: form.shipping_required,
    sort_order: parseInt(form.sort_order, 10) || 0,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('formats')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as Format;
}

export async function setFormatActive(id: string, active: boolean): Promise<void> {
  const { error } = await supabase
    .from('formats')
    .update({ active, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteFormat(id: string): Promise<{ ok: boolean; reason?: string }> {
  const [{ count: bookCount, error: bookError }, { count: typeCount, error: typeError }] =
    await Promise.all([
      supabase.from('book_formats').select('format_id', { count: 'exact', head: true }).eq('format_id', id),
      supabase
        .from('product_type_formats')
        .select('format_id', { count: 'exact', head: true })
        .eq('format_id', id),
    ]);

  if (bookError) throw bookError;
  if (typeError) throw typeError;

  if ((bookCount ?? 0) > 0 || (typeCount ?? 0) > 0) {
    return { ok: false, reason: 'This format is linked to product types or books.' };
  }

  const { error } = await supabase.from('formats').delete().eq('id', id);
  if (error) throw error;
  return { ok: true };
}

export async function getBookFormatIds(bookId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('book_formats')
    .select('format_id')
    .eq('book_id', bookId);

  if (error) throw error;
  return (data ?? []).map((row) => row.format_id);
}

export async function syncBookFormats(bookId: string, formatIds: string[]): Promise<void> {
  const { error: deleteError } = await supabase.from('book_formats').delete().eq('book_id', bookId);
  if (deleteError) throw deleteError;

  if (!formatIds.length) return;

  const { error: insertError } = await supabase.from('book_formats').insert(
    formatIds.map((format_id) => ({ book_id: bookId, format_id }))
  );

  if (insertError) throw insertError;
}

export { toSlug as formatToSlug };
