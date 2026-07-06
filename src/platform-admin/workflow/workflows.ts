import type { ReviewDecision } from '../types/common';
import type { TicketStatus } from '../types/common';

const REVIEW_TRANSITIONS: Record<string, ReviewDecision[]> = {
  pending: ['approve', 'reject', 'request_changes'],
};

const TICKET_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  open: ['assigned', 'in_progress'],
  assigned: ['in_progress', 'resolved'],
  in_progress: ['resolved', 'closed'],
  resolved: ['closed'],
  closed: [],
};

export function canReviewItem(currentStatus: string, decision: ReviewDecision): boolean {
  return currentStatus === 'pending' && REVIEW_TRANSITIONS.pending.includes(decision);
}

export function canTransitionTicket(current: TicketStatus, next: TicketStatus): boolean {
  return TICKET_TRANSITIONS[current]?.includes(next) ?? false;
}

export function canEscalateTicket(priority: string): boolean {
  return priority === 'high' || priority === 'urgent';
}
