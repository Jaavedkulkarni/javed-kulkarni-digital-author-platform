import type { Book, BookWorkflowStatus } from '../../types/database';
import type { CmsBookEdition, CmsSeoMetadata, CmsVersionSnapshot } from './common';

export interface CmsBookTags {
  tags: string[];
  relatedSlugs: string[];
}

export interface CmsBookVisibility {
  isHidden: boolean;
  membersOnly: boolean;
  isFeatured: boolean;
  isNewRelease: boolean;
}

export interface CreateBookInput {
  title: string;
  subtitle?: string | null;
  slug?: string;
  shortDescription?: string | null;
  fullDescription?: string | null;
  isbn?: string | null;
  primaryLanguage?: string;
  supportedLanguages?: string[];
  authorId?: string | null;
  publisherId?: string | null;
  seriesId?: string | null;
  seriesOrder?: number | null;
  categoryIds?: string[];
  primaryCategoryId?: string | null;
  seo?: CmsSeoMetadata;
  tags?: CmsBookTags;
  visibility?: Partial<CmsBookVisibility>;
  editions?: CmsBookEdition[];
  coverImage?: string | null;
  coverStoragePath?: string | null;
  scheduledPublishAt?: string | null;
  publicationDate?: string | null;
  amazonUrl?: string | null;
  createdBy?: string | null;
}

export interface UpdateBookInput extends Partial<Omit<CreateBookInput, 'createdBy'>> {
  updatedBy?: string | null;
  wordCount?: number | null;
  pageCount?: number | null;
  readingTimeMinutes?: number | null;
}

export interface BookWorkflowInput {
  bookId: string;
  action: import('./workflow.types').BookWorkflowAction;
  actorId?: string | null;
}

export interface CmsBook extends Book {
  tags: string[];
  editions: CmsBookEdition[];
  scheduledPublishAt: string | null;
  readingTimeMinutes: number | null;
  versionHistoryPrepared: CmsVersionSnapshot[];
}

export interface BookListFilters {
  workflowStatus?: BookWorkflowStatus;
  authorId?: string;
  publisherId?: string;
  seriesId?: string;
  categoryId?: string;
  isFeatured?: boolean;
  search?: string;
  includeArchived?: boolean;
}

export function mapBookRowToCmsBook(row: Book): CmsBook {
  const highlights = Array.isArray(row.featured_highlights) ? (row.featured_highlights as string[]) : [];

  const editions: CmsBookEdition[] = [];
  if (row.epub_storage_path) {
    editions.push({ format: 'epub', storagePath: row.epub_storage_path, fileSizeBytes: row.epub_file_size_bytes });
  }
  if (row.pdf_storage_path) {
    editions.push({ format: 'pdf', storagePath: row.pdf_storage_path, fileSizeBytes: row.pdf_file_size_bytes });
  }

  return {
    ...row,
    tags: highlights,
    editions,
    scheduledPublishAt: row.publication_date,
    readingTimeMinutes: row.word_count ? Math.max(1, Math.ceil(row.word_count / 200)) : null,
    versionHistoryPrepared: [],
  };
}
