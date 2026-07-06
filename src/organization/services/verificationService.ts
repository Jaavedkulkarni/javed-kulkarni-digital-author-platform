import type { IAuditLogRepository } from '../repositories/auditLogRepository';
import type {
  PublisherApprovalRecord,
  AuthorVerificationRecord,
  PublisherApprovalStatus,
  AuthorVerificationStatus,
} from '../types/verification.types';
import type { OrganizationOperationResult } from '../types/common';
import {
  getPublisherApproval,
  createPublisherApproval,
  updatePublisherApprovalStatus,
  getAuthorVerification,
  updateAuthorVerification,
} from '../stores/verificationStore';
import { canTransitionPublisherApproval } from '../workflow/publisherApprovalWorkflow';
import { canTransitionAuthorVerification } from '../workflow/authorVerificationWorkflow';

export class VerificationService {
  constructor(private readonly auditRepo: IAuditLogRepository) {}

  getPublisherApproval(userId: string): PublisherApprovalRecord | null {
    return getPublisherApproval(userId);
  }

  async submitPublisherRegistration(
    userId: string,
    organizationId: string | null
  ): Promise<OrganizationOperationResult<PublisherApprovalRecord>> {
    const existing = getPublisherApproval(userId);
    if (existing && existing.status !== 'rejected') {
      return { success: false, errors: ['Publisher registration already submitted.'] };
    }
    const record = createPublisherApproval(userId, organizationId);
    await this.auditRepo.append({
      eventType: 'publisher_approval',
      actorId: userId,
      organizationId,
      metadata: { status: 'pending', action: 'submitted' },
    });
    return { success: true, data: record };
  }

  async transitionPublisherApproval(
    userId: string,
    nextStatus: PublisherApprovalStatus,
    reviewedBy: string
  ): Promise<OrganizationOperationResult<PublisherApprovalRecord>> {
    const existing = getPublisherApproval(userId);
    if (!existing) return { success: false, errors: ['Publisher approval record not found.'] };
    if (!canTransitionPublisherApproval(existing.status, nextStatus)) {
      return { success: false, errors: [`Cannot transition from ${existing.status} to ${nextStatus}.`] };
    }
    const updated = updatePublisherApprovalStatus(userId, nextStatus, reviewedBy);
    if (!updated) return { success: false, errors: ['Failed to update publisher approval.'] };
    await this.auditRepo.append({
      eventType: 'publisher_approval',
      actorId: reviewedBy,
      targetId: userId,
      organizationId: existing.organizationId,
      metadata: { status: nextStatus },
    });
    return { success: true, data: updated };
  }

  getAuthorVerification(userId: string): AuthorVerificationRecord {
    return getAuthorVerification(userId);
  }

  async transitionAuthorVerification(
    userId: string,
    nextStatus: AuthorVerificationStatus,
    actorId: string
  ): Promise<OrganizationOperationResult<AuthorVerificationRecord>> {
    const existing = getAuthorVerification(userId);
    if (!canTransitionAuthorVerification(existing.status, nextStatus)) {
      return { success: false, errors: [`Cannot transition from ${existing.status} to ${nextStatus}.`] };
    }
    const updated = updateAuthorVerification(userId, nextStatus);
    await this.auditRepo.append({
      eventType: 'author_verification',
      actorId,
      targetId: userId,
      metadata: { status: nextStatus },
    });
    return { success: true, data: updated };
  }
}

export function createVerificationService(auditRepo: IAuditLogRepository): VerificationService {
  return new VerificationService(auditRepo);
}
