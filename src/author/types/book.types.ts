import type { CmsBook } from '../../cms/types/book.types';
import type { CreateBookInput, UpdateBookInput } from '../../cms/types/book.types';
import type { BookWorkflowAction } from '../../cms/types/workflow.types';
import type { CmsVersionSnapshot } from '../../cms/types/common';

export type AuthorBook = CmsBook;

export interface AuthorCreateBookInput extends Omit<CreateBookInput, 'authorId' | 'createdBy'> {
  authorId: string;
  createdBy: string;
}

export interface AuthorUpdateBookInput extends UpdateBookInput {
  updatedBy: string;
}

export interface AuthorBookWorkflowInput {
  bookId: string;
  authorId: string;
  action: BookWorkflowAction;
  actorId: string;
}

export interface AuthorBookListFilters {
  workflowStatus?: 'draft' | 'review' | 'published' | 'archived';
  search?: string;
  seriesId?: string;
  categoryId?: string;
}

export interface BookVersionHistory {
  bookId: string;
  versions: CmsVersionSnapshot[];
}

export interface DuplicateBookInput {
  sourceBookId: string;
  authorId: string;
  actorId: string;
  newTitle?: string;
}
