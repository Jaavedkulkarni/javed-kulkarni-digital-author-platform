import type { TypedSupabaseClient } from '../../lib/supabase/clients/browser';
import type { Article } from '../../types/blog';
import { withRetry } from '../../lib/utils/retry';
import type { AuthorBlogFilters } from '../types/blog.types';

export class AuthorBlogRepository {
  constructor(private readonly client: TypedSupabaseClient) {}

  async findByAuthorName(authorName: string, filters: AuthorBlogFilters = {}): Promise<Article[]> {
    return withRetry(async () => {
      let query = this.client
        .from('blog_articles')
        .select('*')
        .eq('author_name', authorName)
        .order('updated_at', { ascending: false });

      if (filters.status) query = query.eq('status', filters.status);
      if (filters.search) query = query.ilike('title', `%${filters.search}%`);

      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const result = await query;
      if (result.error) throw result.error;
      return (result.data ?? []) as Article[];
    }, { scope: 'author.blog.fetch' });
  }

  async createArticle(payload: Record<string, unknown>): Promise<Article> {
    const result = await this.client.from('blog_articles').insert(payload).select('*').single();
    if (result.error) throw result.error;
    return result.data as Article;
  }

  async updateArticle(id: string, payload: Record<string, unknown>): Promise<Article> {
    const result = await this.client.from('blog_articles').update(payload).eq('id', id).select('*').single();
    if (result.error) throw result.error;
    return result.data as Article;
  }
}

export function createAuthorBlogRepository(client: TypedSupabaseClient): AuthorBlogRepository {
  return new AuthorBlogRepository(client);
}
