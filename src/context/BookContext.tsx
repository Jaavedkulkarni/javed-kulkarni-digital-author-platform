import { createContext, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import {
  Book,
  BookFilters,
  BookFormData,
  BookListItem,
  PaginatedBooks,
} from '../types/book';

interface BookContextType {
  getBooks: (filters?: BookFilters) => Promise<PaginatedBooks>;
  getBook: (id: string) => Promise<Book | null>;
  createBook: (data: Partial<BookFormData>) => Promise<Book | null>;
  updateBook: (id: string, data: Partial<BookFormData>) => Promise<Book | null>;
  deleteBook: (id: string) => Promise<boolean>;
  searchBooks: (query: string, page?: number, limit?: number) => Promise<PaginatedBooks>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

const LIST_SELECT =
  'id, title, slug, subtitle, cover_image, category_id, language, status, is_featured, is_new_release, publication_date, created_at, category:book_categories(id, name, slug)';

const FULL_SELECT = '*, category:book_categories(*)';

function formToRow(data: Partial<BookFormData>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (data.title !== undefined) row.title = data.title;
  if (data.subtitle !== undefined) row.subtitle = data.subtitle || null;
  if (data.slug !== undefined) row.slug = data.slug;
  if (data.short_description !== undefined) row.short_description = data.short_description || null;
  if (data.full_description !== undefined) row.full_description = data.full_description || null;
  if (data.cover_image !== undefined) row.cover_image = data.cover_image || null;
  if (data.category_id !== undefined) row.category_id = data.category_id || null;
  if (data.language !== undefined) row.language = data.language;
  if (data.isbn !== undefined) row.isbn = data.isbn || null;
  if (data.total_pages !== undefined) {
    row.total_pages = data.total_pages ? parseInt(data.total_pages, 10) : null;
  }
  if (data.amazon_url !== undefined) row.amazon_url = data.amazon_url || null;
  if (data.sample_pdf_url !== undefined) row.sample_pdf_url = data.sample_pdf_url || null;
  if (data.publication_date !== undefined) row.publication_date = data.publication_date || null;
  if (data.status !== undefined) row.status = data.status;
  if (data.is_featured !== undefined) row.is_featured = data.is_featured;
  if (data.is_new_release !== undefined) row.is_new_release = data.is_new_release;
  if (data.meta_title !== undefined) row.meta_title = data.meta_title || null;
  if (data.meta_description !== undefined) row.meta_description = data.meta_description || null;
  if (data.og_image !== undefined) row.og_image = data.og_image || null;
  if (data.author_name !== undefined) row.author_name = data.author_name;
  row.updated_at = new Date().toISOString();
  return row;
}

function normalizeCategory<T extends { category?: unknown }>(item: T): T {
  const category = item.category;
  if (Array.isArray(category)) {
    return { ...item, category: category[0] ?? null };
  }
  return item;
}

export function BookProvider({ children }: { children: ReactNode }) {
  const getBooks = async (filters?: BookFilters): Promise<PaginatedBooks> => {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 15;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('books')
      .select(LIST_SELECT, { count: 'exact' });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    if (filters?.language) {
      query = query.eq('language', filters.language);
    }
    if (filters?.search?.trim()) {
      const q = filters.search.trim();
      query = query.or(
        `title.ilike.%${q}%,slug.ilike.%${q}%,subtitle.ilike.%${q}%,short_description.ilike.%${q}%`
      );
    }

    const sortColumn = filters?.sort_by ?? 'created_at';
    const sortAscending = filters?.sort_order === 'asc';
    query = query.order(sortColumn, { ascending: sortAscending }).range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: (data ?? []).map((item) => normalizeCategory(item) as BookListItem),
      total: count ?? 0,
      page,
      limit,
      total_pages: Math.ceil((count ?? 0) / limit),
    };
  };

  const getBook = async (id: string): Promise<Book | null> => {
    const { data, error } = await supabase
      .from('books')
      .select(FULL_SELECT)
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return null;
    return normalizeCategory(data) as Book;
  };

  const createBook = async (data: Partial<BookFormData>): Promise<Book | null> => {
    const { data: created, error } = await supabase
      .from('books')
      .insert(formToRow(data))
      .select(FULL_SELECT)
      .single();

    if (error) throw error;
    return normalizeCategory(created) as Book;
  };

  const updateBook = async (id: string, data: Partial<BookFormData>): Promise<Book | null> => {
    const { data: updated, error } = await supabase
      .from('books')
      .update(formToRow(data))
      .eq('id', id)
      .select(FULL_SELECT)
      .single();

    if (error) throw error;
    return normalizeCategory(updated) as Book;
  };

  const deleteBook = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('books').delete().eq('id', id);
    return !error;
  };

  const searchBooks = async (
    query: string,
    page = 1,
    limit = 15
  ): Promise<PaginatedBooks> => {
    return getBooks({ search: query, page, limit });
  };

  return (
    <BookContext.Provider
      value={{ getBooks, getBook, createBook, updateBook, deleteBook, searchBooks }}
    >
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
}
