import type { ContractStatus } from './common';

export interface AuthorContract {
  id: string;
  authorId: string;
  title: string;
  contractType: 'publishing' | 'distribution' | 'exclusive' | 'amendment';
  status: ContractStatus;
  signedAt: string | null;
  expiresAt: string | null;
  documentPath: string | null;
  terms: Record<string, unknown>;
  createdAt: string;
}

export interface AgreementSummary {
  activeContracts: number;
  expiringSoon: number;
  pendingSignature: number;
}
