import type { BookCategory } from './book';
import type { ProductType } from './product';

export type ProductStatus = 'draft' | 'published';

export type TaxClass = 'standard' | 'reduced' | 'zero' | 'exempt';

export interface Product {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  cover_image: string | null;
  gallery_images: string[];
  category_id: string | null;
  product_type_id: string | null;
  language: string;
  status: ProductStatus;
  sort_order: number;
  is_featured: boolean;
  is_new_release: boolean;
  is_hidden: boolean;
  members_only: boolean;
  regular_price: number | null;
  sale_price: number | null;
  cost_price: number | null;
  currency: string;
  tax_class: string;
  gst_percent: number | null;
  sku: string | null;
  track_inventory: boolean;
  stock_quantity: number;
  allow_backorders: boolean;
  shipping_required: boolean;
  downloadable: boolean;
  download_file: string | null;
  download_limit: number | null;
  download_expiry_days: number | null;
  isbn: string | null;
  total_pages: number | null;
  author_name: string;
  sample_pdf_url: string | null;
  amazon_url: string | null;
  publication_date: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  why_read: string | null;
  authors_note: string | null;
  table_of_contents: string[];
  related_slugs: string[];
  featured_highlights: string[];
  format_ids?: string[];
  created_at: string;
  updated_at: string;
  category?: BookCategory | null;
  product_type?: Pick<ProductType, 'id' | 'name' | 'slug'> | null;
}

export interface ProductListItem {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  cover_image: string | null;
  category_id: string | null;
  product_type_id: string | null;
  language: string;
  status: ProductStatus;
  is_featured: boolean;
  is_new_release: boolean;
  is_hidden: boolean;
  sku: string | null;
  regular_price: number | null;
  sale_price: number | null;
  publication_date: string | null;
  created_at: string;
  category?: Pick<BookCategory, 'id' | 'name' | 'slug'> | null;
  product_type?: Pick<ProductType, 'id' | 'name' | 'slug'> | null;
}

export interface ProductFormData {
  title: string;
  subtitle: string;
  slug: string;
  short_description: string;
  full_description: string;
  cover_image: string;
  gallery_images: string[];
  category_id: string;
  product_type_id: string;
  language: string;
  status: ProductStatus;
  sort_order: string;
  is_featured: boolean;
  is_new_release: boolean;
  is_hidden: boolean;
  members_only: boolean;
  regular_price: string;
  sale_price: string;
  cost_price: string;
  currency: string;
  tax_class: string;
  gst_percent: string;
  sku: string;
  track_inventory: boolean;
  stock_quantity: string;
  allow_backorders: boolean;
  shipping_required: boolean;
  downloadable: boolean;
  download_file: string;
  download_limit: string;
  download_expiry_days: string;
  isbn: string;
  total_pages: string;
  author_name: string;
  sample_pdf_url: string;
  amazon_url: string;
  publication_date: string;
  meta_title: string;
  meta_description: string;
  og_image: string;
  format_ids: string[];
}

export interface ProductFilters {
  search?: string;
  status?: ProductStatus | 'all';
  category_id?: string;
  product_type_id?: string;
  language?: string;
  sort_by?: 'created_at' | 'publication_date' | 'sort_order' | 'title';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  data: ProductListItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export const TAX_CLASS_OPTIONS: { value: TaxClass; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'reduced', label: 'Reduced' },
  { value: 'zero', label: 'Zero' },
  { value: 'exempt', label: 'Exempt' },
];

export const CURRENCY_OPTIONS = ['INR', 'USD', 'EUR'] as const;

export function emptyProductForm(defaults?: Partial<ProductFormData>): ProductFormData {
  return {
    title: '',
    subtitle: '',
    slug: '',
    short_description: '',
    full_description: '',
    cover_image: '',
    gallery_images: [],
    category_id: '',
    product_type_id: '',
    language: 'मराठी',
    status: 'draft',
    sort_order: '0',
    is_featured: false,
    is_new_release: false,
    is_hidden: false,
    members_only: false,
    regular_price: '',
    sale_price: '',
    cost_price: '',
    currency: 'INR',
    tax_class: 'standard',
    gst_percent: '18',
    sku: '',
    track_inventory: false,
    stock_quantity: '0',
    allow_backorders: false,
    shipping_required: false,
    downloadable: false,
    download_file: '',
    download_limit: '',
    download_expiry_days: '',
    isbn: '',
    total_pages: '',
    author_name: 'जावेद कुलकर्णी',
    sample_pdf_url: '',
    amazon_url: '',
    publication_date: '',
    meta_title: '',
    meta_description: '',
    og_image: '',
    format_ids: [],
    ...defaults,
  };
}

export function productToForm(product: Product): ProductFormData {
  return {
    title: product.title,
    subtitle: product.subtitle ?? '',
    slug: product.slug,
    short_description: product.short_description ?? '',
    full_description: product.full_description ?? '',
    cover_image: product.cover_image ?? '',
    gallery_images: product.gallery_images ?? [],
    category_id: product.category_id ?? '',
    product_type_id: product.product_type_id ?? '',
    language: product.language,
    status: product.status,
    sort_order: String(product.sort_order ?? 0),
    is_featured: product.is_featured,
    is_new_release: product.is_new_release,
    is_hidden: product.is_hidden ?? false,
    members_only: product.members_only ?? false,
    regular_price: product.regular_price != null ? String(product.regular_price) : '',
    sale_price: product.sale_price != null ? String(product.sale_price) : '',
    cost_price: product.cost_price != null ? String(product.cost_price) : '',
    currency: product.currency ?? 'INR',
    tax_class: product.tax_class ?? 'standard',
    gst_percent: product.gst_percent != null ? String(product.gst_percent) : '18',
    sku: product.sku ?? '',
    track_inventory: product.track_inventory ?? false,
    stock_quantity: String(product.stock_quantity ?? 0),
    allow_backorders: product.allow_backorders ?? false,
    shipping_required: product.shipping_required ?? false,
    downloadable: product.downloadable ?? false,
    download_file: product.download_file ?? '',
    download_limit: product.download_limit != null ? String(product.download_limit) : '',
    download_expiry_days:
      product.download_expiry_days != null ? String(product.download_expiry_days) : '',
    isbn: product.isbn ?? '',
    total_pages: product.total_pages != null ? String(product.total_pages) : '',
    author_name: product.author_name,
    sample_pdf_url: product.sample_pdf_url ?? '',
    amazon_url: product.amazon_url ?? '',
    publication_date: product.publication_date ?? '',
    meta_title: product.meta_title ?? '',
    meta_description: product.meta_description ?? '',
    og_image: product.og_image ?? '',
    format_ids: product.format_ids ?? [],
  };
}

export function generateProductSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\u0900-\u097F\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}
