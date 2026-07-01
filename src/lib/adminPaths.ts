import type { AdminView } from '../types/blog';

const VIEW_TO_PATH: Partial<Record<AdminView, string>> = {
  dashboard: '/admin',
  articles: '/admin/articles',
  create: '/admin/articles/create',
  edit: '/admin/articles/edit',
  books: '/admin/books',
  'book-create': '/admin/books/create',
  'book-edit': '/admin/books/edit',
  products: '/admin/products',
  'product-create': '/admin/products/create',
  'product-edit': '/admin/products/edit',
  categories: '/admin/categories',
  tags: '/admin/tags',
  media: '/admin/media',
  comments: '/admin/comments',
  subscribers: '/admin/subscribers',
  settings: '/admin/settings',
  'product-types': '/admin/product-types',
  formats: '/admin/formats',
};

const PATH_TO_VIEW: Record<string, AdminView> = {
  '/admin': 'dashboard',
  '/admin/articles': 'articles',
  '/admin/articles/create': 'create',
  '/admin/articles/edit': 'edit',
  '/admin/books': 'books',
  '/admin/books/create': 'book-create',
  '/admin/books/edit': 'book-edit',
  '/admin/products': 'products',
  '/admin/products/create': 'product-create',
  '/admin/products/edit': 'product-edit',
  '/admin/categories': 'categories',
  '/admin/tags': 'tags',
  '/admin/media': 'media',
  '/admin/comments': 'comments',
  '/admin/subscribers': 'subscribers',
  '/admin/settings': 'settings',
  '/admin/product-types': 'product-types',
  '/admin/formats': 'formats',
};

export function adminPathFromView(view: AdminView): string {
  return VIEW_TO_PATH[view] ?? '/admin';
}

export function adminViewFromPath(pathname: string): AdminView {
  const normalized = pathname.replace(/\/+$/, '') || '/admin';
  if (PATH_TO_VIEW[normalized]) return PATH_TO_VIEW[normalized];

  if (normalized.startsWith('/admin/books')) return 'books';
  if (normalized.startsWith('/admin/products')) return 'products';
  if (normalized.startsWith('/admin/articles')) return 'articles';

  return 'dashboard';
}

export function navigateAdminView(
  view: AdminView,
  navigate: (path: string, options?: { replace?: boolean }) => void
): void {
  navigate(adminPathFromView(view), { replace: false });
}
