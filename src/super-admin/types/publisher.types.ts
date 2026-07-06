export type PublisherApprovalStatus = 'pending' | 'document_verification' | 'review' | 'approved' | 'rejected' | 'suspended';

export interface PublisherApprovalRecord {
  id: string;
  companyName: string;
  contactEmail: string;
  status: PublisherApprovalStatus;
  documentsVerified: boolean;
  agreementSigned: boolean;
  completedJobs: number;
  submittedAt: string;
}
