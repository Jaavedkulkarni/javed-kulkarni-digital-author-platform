import type { ProductionJobStatus } from '../types/common';
import { canTransitionProductionStatus, getNextProductionStatuses } from '../utils/workflow';

export class ProductionWorkflow {
  canAdvance(current: ProductionJobStatus, next: ProductionJobStatus): boolean {
    return canTransitionProductionStatus(current, next);
  }

  getAllowedTransitions(current: ProductionJobStatus): ProductionJobStatus[] {
    return getNextProductionStatuses(current);
  }

  isTerminal(status: ProductionJobStatus): boolean {
    return status === 'completed' || status === 'cancelled';
  }

  isDispatchPhase(status: ProductionJobStatus): boolean {
    return ['ready_for_dispatch', 'dispatched', 'delivered', 'completed'].includes(status);
  }
}

export const productionWorkflow = new ProductionWorkflow();
