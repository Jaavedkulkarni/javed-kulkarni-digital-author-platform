import type { ProductionJob } from '../types/production.types';
import type { ProductionJobStatus } from '../types/common';
import { getRfqs } from './rfqStore';
import { SAMPLE_SPECS, addDays, generateId, todayIso } from '../utils/common';

const jobs = new Map<string, ProductionJob[]>();
const jobSeeded = new Set<string>();

function seedJobs(publisherId: string): void {
  if (jobSeeded.has(publisherId)) return;
  const rfqList = getRfqs(publisherId);
  const wonRfq = rfqList[0];
  const now = new Date().toISOString();
  const today = todayIso();
  const seeded: ProductionJob[] = [
    {
      id: generateId('job'),
      jobNumber: 'PJ-2026-0101',
      publisherId,
      rfqId: wonRfq?.id ?? null,
      quoteId: null,
      bookTitle: 'Echoes of the Monsoon',
      referenceAuthorName: 'Javed Kulkarni',
      quantity: 500,
      specifications: SAMPLE_SPECS,
      assignedDate: addDays(-5),
      expectedCompletion: addDays(20),
      priority: 'high',
      status: 'printing',
      assignedBy: 'authoros',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId('job'),
      jobNumber: 'PJ-2026-0102',
      publisherId,
      rfqId: null,
      quoteId: null,
      bookTitle: 'Whispers in Ink',
      referenceAuthorName: 'Neha Desai',
      quantity: 300,
      specifications: { ...SAMPLE_SPECS, pageCount: 220 },
      assignedDate: today,
      expectedCompletion: addDays(25),
      priority: 'normal',
      status: 'prepress',
      assignedBy: 'authoros',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId('job'),
      jobNumber: 'PJ-2026-0098',
      publisherId,
      rfqId: null,
      quoteId: null,
      bookTitle: 'Canvas of Stars',
      referenceAuthorName: 'Ravi Patel',
      quantity: 150,
      specifications: SAMPLE_SPECS,
      assignedDate: addDays(-20),
      expectedCompletion: addDays(-2),
      priority: 'normal',
      status: 'ready_for_dispatch',
      assignedBy: 'authoros',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId('job'),
      jobNumber: 'PJ-2026-0085',
      publisherId,
      rfqId: null,
      quoteId: null,
      bookTitle: 'Silent Verses',
      referenceAuthorName: 'Anita Rao',
      quantity: 400,
      specifications: SAMPLE_SPECS,
      assignedDate: addDays(-40),
      expectedCompletion: addDays(-15),
      priority: 'low',
      status: 'completed',
      assignedBy: 'authoros',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateId('job'),
      jobNumber: 'PJ-2026-0070',
      publisherId,
      rfqId: null,
      quoteId: null,
      bookTitle: 'Faded Margins',
      referenceAuthorName: 'Karan Singh',
      quantity: 100,
      specifications: SAMPLE_SPECS,
      assignedDate: addDays(-30),
      expectedCompletion: addDays(-10),
      priority: 'normal',
      status: 'cancelled',
      assignedBy: 'authoros',
      createdAt: now,
      updatedAt: now,
    },
  ];
  jobs.set(publisherId, seeded);
  jobSeeded.add(publisherId);
}

export function getProductionJobs(publisherId: string): ProductionJob[] {
  seedJobs(publisherId);
  return jobs.get(publisherId) ?? [];
}

export function getProductionJobById(publisherId: string, jobId: string): ProductionJob | null {
  return getProductionJobs(publisherId).find((j) => j.id === jobId) ?? null;
}

export function updateJobStatus(
  publisherId: string,
  jobId: string,
  status: ProductionJobStatus
): ProductionJob | null {
  const job = getProductionJobById(publisherId, jobId);
  if (!job) return null;
  const updated: ProductionJob = { ...job, status, updatedAt: new Date().toISOString() };
  const list = getProductionJobs(publisherId).map((j) => (j.id === jobId ? updated : j));
  jobs.set(publisherId, list);
  return updated;
}

export function resetProductionJobStore(): void {
  jobs.clear();
  jobSeeded.clear();
}
