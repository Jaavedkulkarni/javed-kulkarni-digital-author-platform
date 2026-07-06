export type PublisherApprovalStatus =
  | 'pending'
  | 'document_verification'
  | 'review'
  | 'approved'
  | 'rejected'
  | 'suspended';

export type AuthorVerificationStatus = 'unverified' | 'verified' | 'premium' | 'suspended';

export interface PublisherApprovalRecord {
  id: string;
  userId: string;
  organizationId: string | null;
  status: PublisherApprovalStatus;
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  notes: string | null;
}

export interface AuthorVerificationRecord {
  userId: string;
  status: AuthorVerificationStatus;
  verifiedAt: string | null;
  updatedAt: string;
}
