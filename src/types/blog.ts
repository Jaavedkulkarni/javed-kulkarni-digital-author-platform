export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  color: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  category_id: string | null;
  author_name: string;
  author_image: string | null;
  status: 'draft' | 'published' | 'scheduled';
  published_at: string | null;
  scheduled_at: string | null;
  reading_time: number;
  views_count: number;
  likes_count: number;
  comments_count: number;
  is_featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  table_of_contents: TableOfContentsItem[];
  created_at: string;
  updated_at: string;
  category?: Category;
  tags?: Tag[];
}

export interface TableOfContentsItem {
  id: string;
  level: number;
  text: string;
}

export interface Comment {
  id: string;
  article_id: string;
  parent_id: string | null;
  author_name: string;
  author_email: string;
  content: string;
  status: 'pending' | 'approved' | 'spam' | 'trash';
  created_at: string;
  replies?: Comment[];
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

export interface ArticleFilters {
  category?: string;
  tag?: string;
  search?: string;
  status?: 'draft' | 'published' | 'scheduled';
  is_featured?: boolean;
  sort_by?: 'published_at' | 'views_count' | 'likes_count' | 'created_at';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export type AdminView = 'dashboard' | 'articles' | 'create' | 'edit' | 'categories' | 'tags' | 'media' | 'comments' | 'subscribers' | 'settings' | 'books' | 'book-create' | 'book-edit' | 'book-categories';
