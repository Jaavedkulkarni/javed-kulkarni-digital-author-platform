import type { ProofApprovalStatus } from './common';

export interface ProofUpload {
  id: string;
  jobId: string;
  publisherId: string;
  type: 'cover' | 'interior' | 'print_sample';
  storagePath: string;
  filename: string;
  uploadedAt: string;
}

export interface ProductionNote {
  id: string;
  jobId: string;
  publisherId: string;
  content: string;
  createdAt: string;
}

export interface ProofPackage {
  jobId: string;
  publisherId: string;
  coverProof: ProofUpload | null;
  interiorProof: ProofUpload | null;
  printSamplePhotos: ProofUpload[];
  notes: ProductionNote[];
  approvalStatus: ProofApprovalStatus;
  submittedAt: string | null;
}
