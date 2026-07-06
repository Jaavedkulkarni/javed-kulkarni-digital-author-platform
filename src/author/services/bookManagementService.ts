import type { BookService } from '../../cms/services/bookService';
import type { AuthorBookRepository } from '../repositories/bookRepository';
import type {
  AuthorBook,
  AuthorBookListFilters,
  AuthorBookWorkflowInput,
  AuthorCreateBookInput,
  AuthorUpdateBookInput,
  DuplicateBookInput,
  BookVersionHistory,
} from '../types/book.types';
import { mapBookRowToCmsBook } from '../../cms/types/book.types';
import { validateAuthorCreateBook } from '../validators/bookValidator';
import { ensureAuthorOwnership, generateDuplicateTitle } from '../utils/ownership';

export class AuthorBookManagementService {
  constructor(
    private readonly bookRepo: AuthorBookRepository,
    private readonly cmsBooks: BookService
  ) {}

  async list(authorId: string, filters: AuthorBookListFilters = {}): Promise<AuthorBook[]> {
    const rows = await this.bookRepo.findByAuthor(authorId, filters);
    return rows.map(mapBookRowToCmsBook);
  }

  async getDrafts(authorId: string): Promise<AuthorBook[]> {
    return this.list(authorId, { workflowStatus: 'draft' });
  }

  async getPublished(authorId: string): Promise<AuthorBook[]> {
    return this.list(authorId, { workflowStatus: 'published' });
  }

  async getById(authorId: string, bookId: string): Promise<AuthorBook | null> {
    const book = await this.cmsBooks.getById(bookId);
    if (!book || !ensureAuthorOwnership(book.author_id, authorId)) return null;
    return book;
  }

  async create(input: AuthorCreateBookInput) {
    const validation = validateAuthorCreateBook(input);
    if (!validation.valid) return { success: false as const, errors: validation.errors };
    return this.cmsBooks.create({ ...input, authorId: input.authorId, createdBy: input.createdBy });
  }

  async update(authorId: string, bookId: string, input: AuthorUpdateBookInput) {
    const book = await this.getById(authorId, bookId);
    if (!book) return { errors: ['Book not found or access denied.'] };
    return this.cmsBooks.update(bookId, input);
  }

  async archive(authorId: string, bookId: string, actorId: string) {
    return this.applyWorkflow({ bookId, authorId, action: 'archive', actorId });
  }

  async submitForReview(authorId: string, bookId: string, actorId: string) {
    return this.applyWorkflow({ bookId, authorId, action: 'submit_for_review', actorId });
  }

  async publish(authorId: string, bookId: string, actorId: string) {
    return this.applyWorkflow({ bookId, authorId, action: 'publish', actorId });
  }

  async revertToDraft(authorId: string, bookId: string, actorId: string) {
    const book = await this.getById(authorId, bookId);
    if (!book) return { errors: ['Book not found or access denied.'] };
    const action = book.workflow_status === 'archived' ? 'restore' : 'reject';
    return this.applyWorkflow({ bookId, authorId, action, actorId });
  }

  private async applyWorkflow(input: AuthorBookWorkflowInput) {
    const book = await this.getById(input.authorId, input.bookId);
    if (!book) return { errors: ['Book not found or access denied.'] };
    return this.cmsBooks.transitionWorkflow({
      bookId: input.bookId,
      action: input.action,
      actorId: input.actorId,
    });
  }

  async duplicate(input: DuplicateBookInput) {
    const source = await this.getById(input.authorId, input.sourceBookId);
    if (!source) return { errors: ['Source book not found.'] };

    return this.cmsBooks.create({
      title: input.newTitle ?? generateDuplicateTitle(source.title),
      subtitle: source.subtitle,
      shortDescription: source.short_description,
      fullDescription: source.full_description,
      primaryLanguage: source.primary_language ?? 'mr',
      authorId: input.authorId,
      createdBy: input.actorId,
      seriesId: source.series_id,
      visibility: {
        isFeatured: false,
        isHidden: source.is_hidden ?? false,
        membersOnly: source.members_only ?? false,
        isNewRelease: false,
      },
    });
  }

  async getVersionHistoryAsync(authorId: string, bookId: string): Promise<BookVersionHistory | null> {
    const book = await this.getById(authorId, bookId);
    if (!book) return null;
    return { bookId, versions: book.versionHistoryPrepared ?? [] };
  }
}

export function createAuthorBookManagementService(
  bookRepo: AuthorBookRepository,
  cmsBooks: BookService
): AuthorBookManagementService {
  return new AuthorBookManagementService(bookRepo, cmsBooks);
}
