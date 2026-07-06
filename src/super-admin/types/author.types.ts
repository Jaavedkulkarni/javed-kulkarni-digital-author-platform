export type AuthorVerificationStatus = 'unverified' | 'verified' | 'premium' | 'suspended';

export interface AuthorManagementRecord {
  id: string;
  displayName: string;
  email: string;
  verificationStatus: AuthorVerificationStatus;
  trustScore: number;
  booksPublished: number;
  totalRevenue: number;
  activeServices: number;
  status: 'active' | 'suspended';
}
