import type { KycVerificationStatus } from './common';

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

export interface UpiDetails {
  upiId: string;
  verifiedName: string | null;
}

export interface KycTaxProfile {
  authorId: string;
  pan: string | null;
  gstin: string | null;
  legalName: string | null;
  bank: BankDetails | null;
  upi: UpiDetails | null;
  verificationStatus: KycVerificationStatus;
  verifiedAt: string | null;
  rejectionReason: string | null;
  updatedAt: string;
}

export interface UpdateKycProfileInput {
  pan?: string | null;
  gstin?: string | null;
  legalName?: string | null;
  bank?: BankDetails | null;
  upi?: UpiDetails | null;
}
