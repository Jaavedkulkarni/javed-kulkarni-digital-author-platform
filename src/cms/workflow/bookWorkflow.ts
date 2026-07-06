import type { BookWorkflowStatus } from '../../types/database';
import type { BookWorkflowAction, WorkflowTransitionResult } from '../types/workflow.types';
import { BOOK_WORKFLOW_ACTION_MAP, BOOK_WORKFLOW_TRANSITIONS } from '../types/workflow.types';

export function canTransitionBookWorkflow(
  from: BookWorkflowStatus,
  to: BookWorkflowStatus
): boolean {
  return BOOK_WORKFLOW_TRANSITIONS[from]?.includes(to) ?? false;
}

export function validateBookWorkflowAction(
  currentStatus: BookWorkflowStatus,
  action: BookWorkflowAction
): WorkflowTransitionResult {
  const rule = BOOK_WORKFLOW_ACTION_MAP[action];

  if (!rule.from.includes(currentStatus)) {
    return {
      allowed: false,
      from: currentStatus,
      to: rule.to,
      error: `Cannot perform "${action}" while book is in "${currentStatus}" status.`,
    };
  }

  if (!canTransitionBookWorkflow(currentStatus, rule.to)) {
    return {
      allowed: false,
      from: currentStatus,
      to: rule.to,
      error: `Transition from "${currentStatus}" to "${rule.to}" is not allowed.`,
    };
  }

  return { allowed: true, from: currentStatus, to: rule.to };
}

export function getAllowedBookTransitions(status: BookWorkflowStatus): BookWorkflowStatus[] {
  return BOOK_WORKFLOW_TRANSITIONS[status] ?? [];
}

export function getAllowedBookActions(status: BookWorkflowStatus): BookWorkflowAction[] {
  return (Object.entries(BOOK_WORKFLOW_ACTION_MAP) as [BookWorkflowAction, typeof BOOK_WORKFLOW_ACTION_MAP[BookWorkflowAction]][])
    .filter(([, rule]) => rule.from.includes(status))
    .map(([action]) => action);
}
