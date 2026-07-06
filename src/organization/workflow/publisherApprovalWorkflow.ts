import type { PublisherApprovalStatus } from '../types/verification.types';

const TRANSITIONS: Record<PublisherApprovalStatus, PublisherApprovalStatus[]> = {
  pending: ['document_verification', 'rejected'],
  document_verification: ['review', 'rejected'],
  review: ['approved', 'rejected', 'suspended'],
  approved: ['suspended'],
  rejected: [],
  suspended: ['review', 'rejected'],
};

export function canTransitionPublisherApproval(
  current: PublisherApprovalStatus,
  next: PublisherApprovalStatus
): boolean {
  return TRANSITIONS[current]?.includes(next) ?? false;
}

export function getNextPublisherApprovalStatuses(
  current: PublisherApprovalStatus
): PublisherApprovalStatus[] {
  return TRANSITIONS[current] ?? [];
}

export const PUBLISHER_APPROVAL_PIPELINE: PublisherApprovalStatus[] = [
  'pending',
  'document_verification',
  'review',
  'approved',
];
