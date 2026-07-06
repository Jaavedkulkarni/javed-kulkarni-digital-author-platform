import type { ChapterWorkflowStatus } from '../types/workflow.types';
import { CHAPTER_WORKFLOW_TRANSITIONS } from '../types/workflow.types';

export function canTransitionChapterWorkflow(
  from: ChapterWorkflowStatus,
  to: ChapterWorkflowStatus
): boolean {
  return CHAPTER_WORKFLOW_TRANSITIONS[from]?.includes(to) ?? false;
}

export function validateChapterWorkflowTransition(
  current: ChapterWorkflowStatus,
  target: ChapterWorkflowStatus
): { allowed: boolean; error?: string } {
  if (current === target) {
    return { allowed: false, error: 'Chapter is already in the target status.' };
  }

  if (!canTransitionChapterWorkflow(current, target)) {
    return {
      allowed: false,
      error: `Transition from "${current}" to "${target}" is not allowed.`,
    };
  }

  return { allowed: true };
}

export function getAllowedChapterTransitions(status: ChapterWorkflowStatus): ChapterWorkflowStatus[] {
  return CHAPTER_WORKFLOW_TRANSITIONS[status] ?? [];
}
