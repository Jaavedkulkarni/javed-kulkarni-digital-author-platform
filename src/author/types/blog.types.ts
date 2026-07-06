import type { Article } from '../../types/blog';

export type AuthorArticle = Article;

export interface AuthorBlogFilters {
  status?: 'draft' | 'published' | 'scheduled';
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateArticleInput {
  title: string;
  subtitle?: string | null;
  content: string;
  excerpt?: string | null;
  authorName: string;
  status?: 'draft' | 'published' | 'scheduled';
  scheduledAt?: string | null;
  categoryId?: string | null;
}

export interface UpdateArticleInput extends Partial<CreateArticleInput> {
  id: string;
}
