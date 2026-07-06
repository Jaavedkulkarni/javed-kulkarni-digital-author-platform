import type {
  PublisherApprovalRecord,
  AuthorVerificationRecord,
  PublisherApprovalStatus,
  AuthorVerificationStatus,
} from '../types/verification.types';
import { generateId } from '../utils/persistence';

const publisherApprovals = new Map<string, PublisherApprovalRecord>();
const authorVerifications = new Map<string, AuthorVerificationRecord>();

export function getPublisherApproval(userId: string): PublisherApprovalRecord | null {
  return publisherApprovals.get(userId) ?? null;
}

export function createPublisherApproval(userId: string, organizationId: string | null): PublisherApprovalRecord {
  const record: PublisherApprovalRecord = {
    id: generateId('pub_approval'),
    userId,
    organizationId,
    status: 'pending',
    submittedAt: new Date().toISOString(),
    reviewedAt: null,
    reviewedBy: null,
    notes: null,
  };
  publisherApprovals.set(userId, record);
  return record;
}

export function updatePublisherApprovalStatus(
  userId: string,
  status: PublisherApprovalStatus,
  reviewedBy?: string
): PublisherApprovalRecord | null {
  const existing = publisherApprovals.get(userId);
  if (!existing) return null;
  const updated: PublisherApprovalRecord = {
    ...existing,
    status,
    reviewedAt: new Date().toISOString(),
    reviewedBy: reviewedBy ?? existing.reviewedBy,
  };
  publisherApprovals.set(userId, updated);
  return updated;
}

export function getAuthorVerification(userId: string): AuthorVerificationRecord {
  const existing = authorVerifications.get(userId);
  if (existing) return existing;
  const record: AuthorVerificationRecord = {
    userId,
    status: 'unverified',
    verifiedAt: null,
    updatedAt: new Date().toISOString(),
  };
  authorVerifications.set(userId, record);
  return record;
}

export function updateAuthorVerification(
  userId: string,
  status: AuthorVerificationStatus
): AuthorVerificationRecord {
  const record: AuthorVerificationRecord = {
    userId,
    status,
    verifiedAt: status === 'verified' || status === 'premium' ? new Date().toISOString() : null,
    updatedAt: new Date().toISOString(),
  };
  authorVerifications.set(userId, record);
  return record;
}

export function resetVerificationStore(): void {
  publisherApprovals.clear();
  authorVerifications.clear();
}
