import type { ProofPackage, ProofUpload, ProductionNote } from '../types/proof.types';
import { getProductionJobs } from './productionJobStore';
import { generateId } from '../utils/common';

const proofs = new Map<string, ProofPackage>();

function ensureProof(publisherId: string, jobId: string): ProofPackage {
  const key = `${publisherId}:${jobId}`;
  const existing = proofs.get(key);
  if (existing) return existing;
  const pkg: ProofPackage = {
    jobId,
    publisherId,
    coverProof: null,
    interiorProof: null,
    printSamplePhotos: [],
    notes: [],
    approvalStatus: 'awaiting_upload',
    submittedAt: null,
  };
  proofs.set(key, pkg);
  return pkg;
}

export function getProofPackage(publisherId: string, jobId: string): ProofPackage {
  return ensureProof(publisherId, jobId);
}

export function getProofPackages(publisherId: string): ProofPackage[] {
  const jobList = getProductionJobs(publisherId);
  return jobList.map((j) => getProofPackage(publisherId, j.id));
}

export function uploadProof(
  publisherId: string,
  jobId: string,
  type: ProofUpload['type'],
  filename: string
): ProofUpload | null {
  const pkg = ensureProof(publisherId, jobId);
  const upload: ProofUpload = {
    id: generateId('proof'),
    jobId,
    publisherId,
    type,
    storagePath: `proofs/${publisherId}/${jobId}/${filename}`,
    filename,
    uploadedAt: new Date().toISOString(),
  };
  if (type === 'cover') {
    proofs.set(`${publisherId}:${jobId}`, { ...pkg, coverProof: upload });
  } else if (type === 'interior') {
    proofs.set(`${publisherId}:${jobId}`, { ...pkg, interiorProof: upload });
  } else {
    proofs.set(`${publisherId}:${jobId}`, {
      ...pkg,
      printSamplePhotos: [...pkg.printSamplePhotos, upload],
    });
  }
  return upload;
}

export function addProductionNote(
  publisherId: string,
  jobId: string,
  content: string
): ProductionNote {
  const pkg = ensureProof(publisherId, jobId);
  const note: ProductionNote = {
    id: generateId('note'),
    jobId,
    publisherId,
    content,
    createdAt: new Date().toISOString(),
  };
  proofs.set(`${publisherId}:${jobId}`, { ...pkg, notes: [...pkg.notes, note] });
  return note;
}

export function submitProofForApproval(publisherId: string, jobId: string): ProofPackage | null {
  const pkg = ensureProof(publisherId, jobId);
  if (!pkg.coverProof || !pkg.interiorProof) return null;
  const updated: ProofPackage = {
    ...pkg,
    approvalStatus: 'awaiting_approval',
    submittedAt: new Date().toISOString(),
  };
  proofs.set(`${publisherId}:${jobId}`, updated);
  return updated;
}

export function resetProofStore(): void {
  proofs.clear();
}
