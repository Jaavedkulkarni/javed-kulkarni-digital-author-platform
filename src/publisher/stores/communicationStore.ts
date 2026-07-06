import type { JobComment, JobAttachment, ProductionUpdate } from '../types/communication.types';
import { getProductionJobs } from './productionJobStore';
import { generateId } from '../utils/common';

const comments = new Map<string, JobComment[]>();
const attachments = new Map<string, JobAttachment[]>();
const updates = new Map<string, ProductionUpdate[]>();

function seedCommunication(publisherId: string): void {
  if (comments.has(publisherId)) return;
  const jobs = getProductionJobs(publisherId).slice(0, 2);
  const now = new Date().toISOString();
  const seededComments: JobComment[] = jobs.flatMap((j) => [
    {
      id: generateId('comment'),
      jobId: j.id,
      publisherId,
      author: 'AuthorOS Production Team',
      content: 'Please confirm prepress files received.',
      isInternal: false,
      createdAt: now,
    },
    {
      id: generateId('comment'),
      jobId: j.id,
      publisherId,
      author: 'Internal',
      content: 'Rush binding scheduled for Friday.',
      isInternal: true,
      createdAt: now,
    },
  ]);
  comments.set(publisherId, seededComments);
  updates.set(publisherId, [
    {
      id: generateId('update'),
      jobId: jobs[0]?.id ?? '',
      publisherId,
      message: 'Printing commenced on Heidelberg press.',
      createdAt: now,
    },
  ]);
}

export function getJobComments(publisherId: string, jobId?: string): JobComment[] {
  seedCommunication(publisherId);
  const all = comments.get(publisherId) ?? [];
  return jobId ? all.filter((c) => c.jobId === jobId) : all;
}

export function addJobComment(
  publisherId: string,
  jobId: string,
  content: string,
  isInternal: boolean
): JobComment {
  const comment: JobComment = {
    id: generateId('comment'),
    jobId,
    publisherId,
    author: isInternal ? 'Internal' : 'Publisher',
    content,
    isInternal,
    createdAt: new Date().toISOString(),
  };
  comments.set(publisherId, [...getJobComments(publisherId), comment]);
  return comment;
}

export function getJobAttachments(publisherId: string, jobId: string): JobAttachment[] {
  return (attachments.get(publisherId) ?? []).filter((a) => a.jobId === jobId);
}

export function addJobAttachment(
  publisherId: string,
  jobId: string,
  filename: string
): JobAttachment {
  const attachment: JobAttachment = {
    id: generateId('attach'),
    jobId,
    publisherId,
    filename,
    storagePath: `attachments/${publisherId}/${jobId}/${filename}`,
    uploadedAt: new Date().toISOString(),
  };
  attachments.set(publisherId, [...(attachments.get(publisherId) ?? []), attachment]);
  return attachment;
}

export function getProductionUpdates(publisherId: string, jobId?: string): ProductionUpdate[] {
  seedCommunication(publisherId);
  const all = updates.get(publisherId) ?? [];
  return jobId ? all.filter((u) => u.jobId === jobId) : all;
}

export function addProductionUpdate(
  publisherId: string,
  jobId: string,
  message: string
): ProductionUpdate {
  const update: ProductionUpdate = {
    id: generateId('update'),
    jobId,
    publisherId,
    message,
    createdAt: new Date().toISOString(),
  };
  updates.set(publisherId, [...getProductionUpdates(publisherId), update]);
  return update;
}

export function resetCommunicationStore(): void {
  comments.clear();
  attachments.clear();
  updates.clear();
}
