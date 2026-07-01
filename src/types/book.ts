export interface BookCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type BookStatus = 'draft' | 'published';

export interface Book {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  cover_image: string | null;
  category_id: string | null;
  language: string;
  isbn: string | null;
  total_pages: number | null;
  amazon_url: string | null;
  sample_pdf_url: string | null;
  publication_date: string | null;
  status: BookStatus;
  is_featured: boolean;
  is_new_release: boolean;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  author_name: string;
  why_read: string | null;
  authors_note: string | null;
  table_of_contents: string[];
  related_slugs: string[];
  featured_highlights: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
  category?: BookCategory | null;
}

export interface BookListItem {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  cover_image: string | null;
  category_id: string | null;
  language: string;
  status: BookStatus;
  is_featured: boolean;
  is_new_release: boolean;
  publication_date: string | null;
  created_at: string;
  category?: Pick<BookCategory, 'id' | 'name' | 'slug'> | null;
}

export interface BookFormData {
  title: string;
  subtitle: string;
  slug: string;
  short_description: string;
  full_description: string;
  cover_image: string;
  category_id: string;
  language: string;
  isbn: string;
  total_pages: string;
  amazon_url: string;
  sample_pdf_url: string;
  publication_date: string;
  status: BookStatus;
  is_featured: boolean;
  is_new_release: boolean;
  meta_title: string;
  meta_description: string;
  og_image: string;
  author_name: string;
}

export interface BookFilters {
  search?: string;
  status?: BookStatus | 'all';
  category_id?: string;
  language?: string;
  sort_by?: 'created_at' | 'publication_date';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedBooks {
  data: BookListItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
