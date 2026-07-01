export interface ProductType {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Format {
  id: string;
  name: string;
  slug: string;
  format_type: string;
  downloadable: boolean;
  shipping_required: boolean;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductTypeWithFormats extends ProductType {
  format_ids: string[];
  book_count?: number;
}

export interface FormatWithUsage extends Format {
  product_type_count: number;
  book_count: number;
}

export interface ProductTypeFormData {
  name: string;
  slug: string;
  icon: string;
  sort_order: string;
  format_ids: string[];
}

export interface FormatFormData {
  name: string;
  slug: string;
  format_type: string;
  downloadable: boolean;
  shipping_required: boolean;
  sort_order: string;
}
