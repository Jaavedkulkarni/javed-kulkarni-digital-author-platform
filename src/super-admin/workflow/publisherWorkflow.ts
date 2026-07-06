import type { PublisherApprovalStatus } from '../types/publisher.types';

const TRANSITIONS: Record<PublisherApprovalStatus, PublisherApprovalStatus[]> = {
  pending: ['document_verification', 'rejected'],
  document_verification: ['review', 'rejected'],
  review: ['approved', 'rejected', 'suspended'],
  approved: ['suspended'],
  rejected: [],
  suspended: ['review', 'rejected'],
};

export function canTransitionPublisherStatus(current: PublisherApprovalStatus, next: PublisherApprovalStatus): boolean {
  return TRANSITIONS[current]?.includes(next) ?? false;
}
