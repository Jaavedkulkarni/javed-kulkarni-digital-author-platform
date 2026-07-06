import {
  getProofPackage,
  getProofPackages,
  uploadProof as storeUpload,
  addProductionNote,
  submitProofForApproval,
} from '../stores/proofStore';
import type { ProofPackage, ProofUpload } from '../types/proof.types';
import type { PublisherOperationResult } from '../types/common';
import { validateProofUpload } from '../validators/proofValidator';
import { assertPublisherOwnership } from '../utils/security';

export class ProofService {
  list(publisherId: string): ProofPackage[] {
    return getProofPackages(publisherId);
  }

  getByJobId(publisherId: string, jobId: string): ProofPackage {
    return getProofPackage(publisherId, jobId);
  }

  uploadProof(
    publisherId: string,
    jobId: string,
    type: ProofUpload['type'],
    filename: string
  ): PublisherOperationResult<ProofUpload> {
    const validation = validateProofUpload(type, filename);
    if (!validation.valid) return { success: false, errors: validation.errors };
    const upload = storeUpload(publisherId, jobId, type, filename);
    if (!upload || !assertPublisherOwnership(upload.publisherId, publisherId)) {
      return { success: false, errors: ['Failed to upload proof.'] };
    }
    return { success: true, data: upload };
  }

  addNote(publisherId: string, jobId: string, content: string) {
    return addProductionNote(publisherId, jobId, content);
  }

  submitForApproval(publisherId: string, jobId: string): PublisherOperationResult<ProofPackage> {
    const pkg = submitProofForApproval(publisherId, jobId);
    if (!pkg) {
      return { success: false, errors: ['Cover and interior proofs are required before submission.'] };
    }
    return { success: true, data: pkg };
  }
}

export function createProofService(): ProofService {
  return new ProofService();
}
