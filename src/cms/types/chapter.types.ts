import type { Tables } from '../../types/database';
import type { ChapterWorkflowStatus } from './workflow.types';

export interface CreateChapterInput {
  bookId: string;
  title: string;
  slug?: string | null;
  chapterNumber: number;
  summary?: string | null;
  content?: string | null;
  contentStoragePath?: string | null;
  languageCode?: string;
  parentChapterId?: string | null;
  isPreview?: boolean;
  sortOrder?: number;
}

export interface UpdateChapterInput extends Partial<Omit<CreateChapterInput, 'bookId'>> {
  wordCount?: number | null;
  estimatedReadMinutes?: number | null;
}

export interface ChapterListFilters {
  bookId: string;
  languageCode?: string;
  workflowStatus?: ChapterWorkflowStatus;
  includeArchived?: boolean;
}

export interface CmsChapter extends Tables<'chapters'> {
  workflowStatus: ChapterWorkflowStatus;
}

export function resolveChapterWorkflowStatus(chapter: Tables<'chapters'>): ChapterWorkflowStatus {
  if (chapter.deleted_at) return 'archived';
  if (chapter.is_published) return 'published';
  return 'draft';
}

export function mapChapterRow(row: Tables<'chapters'>): CmsChapter {
  return {
    ...row,
    workflowStatus: resolveChapterWorkflowStatus(row),
  };
}
