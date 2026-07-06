import type { ProductionJobStatus, JobPriority } from './common';
import type { PrintSpecifications } from './rfq.types';

export interface ProductionJob {
  id: string;
  jobNumber: string;
  publisherId: string;
  rfqId: string | null;
  quoteId: string | null;
  bookTitle: string;
  referenceAuthorName: string;
  quantity: number;
  specifications: PrintSpecifications;
  assignedDate: string;
  expectedCompletion: string;
  priority: JobPriority;
  status: ProductionJobStatus;
  assignedBy: 'authoros';
  createdAt: string;
  updatedAt: string;
}
