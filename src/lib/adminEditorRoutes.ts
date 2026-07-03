import type { AdminView } from '../types/blog';
import { adminPathFromView } from './adminPaths';

export type ArticleEditorMode = 'create' | 'edit' | null;
export type BookEditorMode = 'create' | 'edit' | null;
export type ProductEditorMode = 'create' | 'edit' | null;

export function getArticleEditorMode(pathname: string): ArticleEditorMode {
  if (pathname.endsWith('/admin/articles/create')) return 'create';
  if (pathname.startsWith('/admin/articles/edit')) return 'edit';
  return null;
}

export function getBookEditorMode(pathname: string): BookEditorMode {
  if (pathname.endsWith('/admin/books/create')) return 'create';
  if (pathname.startsWith('/admin/books/edit')) return 'edit';
  return null;
}

export function getProductEditorMode(pathname: string): ProductEditorMode {
  if (pathname.endsWith('/admin/products/create')) return 'create';
  if (pathname.startsWith('/admin/products/edit')) return 'edit';
  return null;
}

export function articleEditorPath(mode: 'create' | 'edit', id?: string): string {
  if (mode === 'create') return adminPathFromView('create');
  return id ? `${adminPathFromView('edit')}?id=${encodeURIComponent(id)}` : adminPathFromView('articles');
}

export function bookEditorPath(mode: 'create' | 'edit', id?: string): string {
  if (mode === 'create') return adminPathFromView('book-create');
  return id ? `${adminPathFromView('book-edit')}?id=${encodeURIComponent(id)}` : adminPathFromView('books');
}

export function productEditorPath(mode: 'create' | 'edit', id?: string): string {
  if (mode === 'create') return adminPathFromView('product-create');
  return id ? `${adminPathFromView('product-edit')}?id=${encodeURIComponent(id)}` : adminPathFromView('products');
}

export function listPathForView(view: AdminView): string {
  return adminPathFromView(view);
}
