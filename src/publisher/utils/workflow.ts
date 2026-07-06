import type { ProductionJobStatus } from '../types/common';

const TRANSITIONS: Record<ProductionJobStatus, ProductionJobStatus[]> = {
  waiting_files: ['files_received', 'cancelled'],
  files_received: ['prepress', 'cancelled'],
  prepress: ['proof_ready', 'cancelled'],
  proof_ready: ['printing', 'cancelled'],
  printing: ['binding', 'cancelled'],
  binding: ['packing', 'cancelled'],
  packing: ['ready_for_dispatch', 'cancelled'],
  ready_for_dispatch: ['dispatched', 'cancelled'],
  dispatched: ['delivered', 'cancelled'],
  delivered: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

export function canTransitionProductionStatus(
  current: ProductionJobStatus,
  next: ProductionJobStatus
): boolean {
  return TRANSITIONS[current]?.includes(next) ?? false;
}

export function getNextProductionStatuses(current: ProductionJobStatus): ProductionJobStatus[] {
  return TRANSITIONS[current] ?? [];
}

export const PRODUCTION_PIPELINE: ProductionJobStatus[] = [
  'waiting_files',
  'files_received',
  'prepress',
  'proof_ready',
  'printing',
  'binding',
  'packing',
  'ready_for_dispatch',
  'dispatched',
  'delivered',
  'completed',
];
