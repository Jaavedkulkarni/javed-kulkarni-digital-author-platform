import type { AuthorBlogRepository } from '../repositories/blogRepository';
import type { AuthorBlogFilters, CreateArticleInput, UpdateArticleInput } from '../types/blog.types';
import { slugifyText } from '../../cms/utils/slug';

export class AuthorBlogService {
  constructor(private readonly blogRepo: AuthorBlogRepository) {}

  async list(authorName: string, filters?: AuthorBlogFilters) {
    return this.blogRepo.findByAuthorName(authorName, filters);
  }

  async create(input: CreateArticleInput) {
    const slug = slugifyText(input.title);
    return this.blogRepo.createArticle({
      title: input.title,
      subtitle: input.subtitle ?? null,
      slug,
      excerpt: input.excerpt ?? null,
      content: input.content,
      author_name: input.authorName,
      status: input.status ?? 'draft',
      scheduled_at: input.scheduledAt ?? null,
      category_id: input.categoryId ?? null,
      reading_time: Math.ceil(input.content.split(/\s+/).length / 200),
    });
  }

  async update(input: UpdateArticleInput) {
    const payload: Record<string, unknown> = {};
    if (input.title) payload.title = input.title;
    if (input.content) payload.content = input.content;
    if (input.status) payload.status = input.status;
    if (input.scheduledAt !== undefined) payload.scheduled_at = input.scheduledAt;
    return this.blogRepo.updateArticle(input.id, payload);
  }
}

export function createAuthorBlogService(repo: AuthorBlogRepository): AuthorBlogService {
  return new AuthorBlogService(repo);
}
