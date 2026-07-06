import type { BookWorkflowStatus } from '../../types/database';

export type BookWorkflowAction =
  | 'submit_for_review'
  | 'approve'
  | 'reject'
  | 'publish'
  | 'archive'
  | 'restore';

export const BOOK_WORKFLOW_LABELS: Record<BookWorkflowStatus, string> = {
  draft: 'Draft',
  review: 'In Review',
  published: 'Published',
  archived: 'Archived',
};

export const BOOK_WORKFLOW_TRANSITIONS: Record<BookWorkflowStatus, BookWorkflowStatus[]> = {
  draft: ['review'],
  review: ['published', 'draft'],
  published: ['archived'],
  archived: ['draft'],
};

export const BOOK_WORKFLOW_ACTION_MAP: Record<BookWorkflowAction, { from: BookWorkflowStatus[]; to: BookWorkflowStatus }> = {
  submit_for_review: { from: ['draft'], to: 'review' },
  approve: { from: ['review'], to: 'published' },
  reject: { from: ['review'], to: 'draft' },
  publish: { from: ['review'], to: 'published' },
  archive: { from: ['published'], to: 'archived' },
  restore: { from: ['archived'], to: 'draft' },
};

export interface WorkflowTransitionResult {
  allowed: boolean;
  from: BookWorkflowStatus;
  to: BookWorkflowStatus;
  error?: string;
}

export type ChapterWorkflowStatus = 'draft' | 'published' | 'archived';

export const CHAPTER_WORKFLOW_TRANSITIONS: Record<ChapterWorkflowStatus, ChapterWorkflowStatus[]> = {
  draft: ['published'],
  published: ['archived', 'draft'],
  archived: ['draft'],
};
