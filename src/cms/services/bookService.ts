import type { TablesInsert, TablesUpdate } from '../../types/database';
import type { CmsBookRepository } from '../repositories/bookRepository';
import type {
  BookListFilters,
  BookWorkflowInput,
  CmsBook,
  CreateBookInput,
  UpdateBookInput,
} from '../types/book.types';
import { mapBookRowToCmsBook as mapBook } from '../types/book.types';
import { validateBookWorkflowAction } from '../workflow/bookWorkflow';
import { validateCreateBook, validateUpdateBook } from '../validators/bookValidator';
import { ensureUniqueSlug, slugifyText, buildSeoPayload, resolveBookCoverPath, resolveBookEditionPath } from '../utils';
import type { PaginationInput } from '../../lib/utils/pagination';
import type { CmsVersionSnapshot } from '../types/common';

export class BookService {
  constructor(private readonly repo: CmsBookRepository) {}

  async getById(id: string): Promise<CmsBook | null> {
    const row = await this.repo.findById(id);
    return row ? mapBook(row) : null;
  }

  async getBySlug(slug: string): Promise<CmsBook | null> {
    const row = await this.repo.findBySlug(slug);
    return row ? mapBook(row) : null;
  }

  async list(filters: BookListFilters = {}) {
    const rows = await this.repo.findByFilters(filters);
    return rows.map(mapBook);
  }

  async listPaginated(filters: BookListFilters, pagination: PaginationInput) {
    const result = await this.repo.findPaginated(filters, pagination);
    return { ...result, data: result.data.map(mapBook) };
  }

  async create(input: CreateBookInput): Promise<{ book?: CmsBook; errors?: string[] }> {
    const validation = validateCreateBook(input);
    if (!validation.valid) return { errors: validation.errors };

    const existingSlugs = await this.repo.getAllSlugs();
    const slug = input.slug
      ? slugifyText(input.slug)
      : ensureUniqueSlug(input.title, existingSlugs);

    const editions = input.editions ?? [];
    const epub = editions.find((e) => e.format === 'epub');
    const pdf = editions.find((e) => e.format === 'pdf');

    const payload: TablesInsert<'books'> = {
      title: input.title.trim(),
      subtitle: input.subtitle ?? null,
      slug,
      short_description: input.shortDescription ?? null,
      full_description: input.fullDescription ?? null,
      isbn: input.isbn ?? null,
      primary_language: input.primaryLanguage ?? 'mr',
      supported_languages: input.supportedLanguages ?? ['mr'],
      author_id: input.authorId ?? null,
      publisher_id: input.publisherId ?? null,
      series_id: input.seriesId ?? null,
      series_order: input.seriesOrder ?? null,
      category_id: input.primaryCategoryId ?? input.categoryIds?.[0] ?? null,
      workflow_status: 'draft',
      status: 'draft',
      is_featured: input.visibility?.isFeatured ?? false,
      is_hidden: input.visibility?.isHidden ?? false,
      members_only: input.visibility?.membersOnly ?? false,
      is_new_release: input.visibility?.isNewRelease ?? false,
      cover_image: input.coverImage ?? null,
      publication_date: input.scheduledPublishAt ?? input.publicationDate ?? null,
      amazon_url: input.amazonUrl ?? null,
      featured_highlights: input.tags?.tags ?? [],
      related_slugs: input.tags?.relatedSlugs ?? [],
      created_by: input.createdBy ?? null,
      epub_storage_path: epub?.storagePath ?? null,
      pdf_storage_path: pdf?.storagePath ?? null,
      epub_file_size_bytes: epub?.fileSizeBytes ?? null,
      pdf_file_size_bytes: pdf?.fileSizeBytes ?? null,
      ...buildSeoPayload(input.seo),
    };

    const row = await this.repo.insertBook(payload);

    if (input.categoryIds?.length) {
      await Promise.all(
        input.categoryIds.map((categoryId, index) =>
          this.repo.linkCategory(row.id, categoryId, categoryId === input.primaryCategoryId, index)
        )
      );
    }

    return { book: mapBook(row) };
  }

  async update(id: string, input: UpdateBookInput): Promise<{ book?: CmsBook; errors?: string[] }> {
    const validation = validateUpdateBook(input);
    if (!validation.valid) return { errors: validation.errors };

    const existing = await this.repo.findById(id);
    if (!existing) return { errors: ['Book not found.'] };

    const payload: TablesUpdate<'books'> = {};

    if (input.title !== undefined) payload.title = input.title.trim();
    if (input.subtitle !== undefined) payload.subtitle = input.subtitle;
    if (input.slug !== undefined) payload.slug = slugifyText(input.slug);
    if (input.shortDescription !== undefined) payload.short_description = input.shortDescription;
    if (input.fullDescription !== undefined) payload.full_description = input.fullDescription;
    if (input.isbn !== undefined) payload.isbn = input.isbn;
    if (input.primaryLanguage !== undefined) payload.primary_language = input.primaryLanguage;
    if (input.supportedLanguages !== undefined) payload.supported_languages = input.supportedLanguages;
    if (input.authorId !== undefined) payload.author_id = input.authorId;
    if (input.publisherId !== undefined) payload.publisher_id = input.publisherId;
    if (input.seriesId !== undefined) payload.series_id = input.seriesId;
    if (input.seriesOrder !== undefined) payload.series_order = input.seriesOrder;
    if (input.wordCount !== undefined) payload.word_count = input.wordCount;
    if (input.pageCount !== undefined) payload.page_count = input.pageCount;
    if (input.updatedBy !== undefined) payload.updated_by = input.updatedBy;
    if (input.visibility?.isFeatured !== undefined) payload.is_featured = input.visibility.isFeatured;
    if (input.visibility?.isHidden !== undefined) payload.is_hidden = input.visibility.isHidden;
    if (input.visibility?.membersOnly !== undefined) payload.members_only = input.visibility.membersOnly;
    if (input.scheduledPublishAt !== undefined) payload.publication_date = input.scheduledPublishAt;
    if (input.seo) Object.assign(payload, buildSeoPayload(input.seo));
    if (input.tags?.tags) payload.featured_highlights = input.tags.tags;
    if (input.tags?.relatedSlugs) payload.related_slugs = input.tags.relatedSlugs;

    if (input.editions) {
      const epub = input.editions.find((e) => e.format === 'epub');
      const pdf = input.editions.find((e) => e.format === 'pdf');
      if (epub) {
        payload.epub_storage_path = epub.storagePath ?? resolveBookEditionPath(id, 'epub');
        payload.epub_file_size_bytes = epub.fileSizeBytes ?? null;
      }
      if (pdf) {
        payload.pdf_storage_path = pdf.storagePath ?? resolveBookEditionPath(id, 'pdf');
        payload.pdf_file_size_bytes = pdf.fileSizeBytes ?? null;
      }
    }

    if (input.coverStoragePath) {
      payload.cover_image = resolveBookCoverPath(id, 'cover.webp');
    }

    const row = await this.repo.patchBook(id, payload);

    if (input.categoryIds) {
      const current = await this.repo.getCategoryIds(id);
      const toRemove = current.filter((c) => !input.categoryIds!.includes(c));
      await Promise.all(toRemove.map((c) => this.repo.unlinkCategory(id, c)));
      await Promise.all(
        input.categoryIds.map((categoryId, index) =>
          this.repo.linkCategory(id, categoryId, categoryId === input.primaryCategoryId, index)
        )
      );
    }

    return { book: mapBook(row) };
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async transitionWorkflow(input: BookWorkflowInput): Promise<{ book?: CmsBook; errors?: string[] }> {
    const existing = await this.repo.findById(input.bookId);
    if (!existing) return { errors: ['Book not found.'] };

    const guard = validateBookWorkflowAction(existing.workflow_status, input.action);
    if (!guard.allowed) return { errors: [guard.error ?? 'Invalid workflow transition.'] };

    const now = new Date().toISOString();
    const payload: TablesUpdate<'books'> = {
      workflow_status: guard.to,
      status: guard.to,
      updated_by: input.actorId ?? null,
    };

    if (guard.to === 'published') {
      payload.published_at = now;
      payload.reviewed_at = now;
      payload.reviewed_by = input.actorId ?? null;
    }
    if (guard.to === 'archived') payload.archived_at = now;
    if (guard.to === 'draft' && existing.workflow_status === 'archived') {
      payload.archived_at = null;
    }

    const row = await this.repo.patchBook(input.bookId, payload);
    return { book: mapBook(row) };
  }

  prepareVersionSnapshot(book: CmsBook): CmsVersionSnapshot {
    return {
      entityType: 'book',
      entityId: book.id,
      version: 1,
      capturedAt: new Date().toISOString(),
      payload: { ...book },
    };
  }
}

export function createBookService(repo: CmsBookRepository): BookService {
  return new BookService(repo);
}
