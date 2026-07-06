import type { DispatchRecord } from '../types/dispatch.types';
import { getProductionJobs } from './productionJobStore';
import { addDays, generateId } from '../utils/common';

const dispatches = new Map<string, DispatchRecord[]>();

function seedDispatches(publisherId: string): void {
  if (dispatches.has(publisherId)) return;
  const jobs = getProductionJobs(publisherId).filter((j) =>
    ['dispatched', 'delivered', 'ready_for_dispatch', 'completed'].includes(j.status)
  );
  const records: DispatchRecord[] = jobs
    .filter((j) => j.status !== 'ready_for_dispatch')
    .map((j, i) => ({
      id: generateId('dispatch'),
      jobId: j.id,
      publisherId,
      courier: i % 2 === 0 ? 'BlueDart' : 'DTDC',
      trackingNumber: `TRK${100000 + i}`,
      dispatchDate: addDays(-5 + i),
      expectedDelivery: addDays(2 + i),
      deliveredAt: j.status === 'delivered' || j.status === 'completed' ? addDays(1 + i) : null,
      deliveryConfirmed: j.status === 'completed',
      returnStatus: 'none' as const,
    }));
  dispatches.set(publisherId, records);
}

export function getDispatches(publisherId: string): DispatchRecord[] {
  seedDispatches(publisherId);
  return dispatches.get(publisherId) ?? [];
}

export function getDispatchByJobId(publisherId: string, jobId: string): DispatchRecord | null {
  return getDispatches(publisherId).find((d) => d.jobId === jobId) ?? null;
}

export function createDispatch(
  publisherId: string,
  input: Omit<DispatchRecord, 'id' | 'publisherId' | 'deliveredAt' | 'deliveryConfirmed' | 'returnStatus'>
): DispatchRecord {
  const record: DispatchRecord = {
    id: generateId('dispatch'),
    publisherId,
    ...input,
    deliveredAt: null,
    deliveryConfirmed: false,
    returnStatus: 'none',
  };
  dispatches.set(publisherId, [...getDispatches(publisherId), record]);
  return record;
}

export function confirmDelivery(publisherId: string, dispatchId: string): DispatchRecord | null {
  const list = getDispatches(publisherId);
  const idx = list.findIndex((d) => d.id === dispatchId);
  if (idx < 0) return null;
  const updated: DispatchRecord = {
    ...list[idx],
    deliveredAt: new Date().toISOString(),
    deliveryConfirmed: true,
  };
  const next = [...list];
  next[idx] = updated;
  dispatches.set(publisherId, next);
  return updated;
}

export function resetDispatchStore(): void {
  dispatches.clear();
}
