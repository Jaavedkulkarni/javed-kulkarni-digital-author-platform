import { getPublisherApprovals, transitionPublisher, suspendPublisher } from '../stores/publisherStore';
import type { PublisherApprovalStatus } from '../types/publisher.types';
import type { SuperAdminOperationResult } from '../types/common';

export class PublisherManagementService {
  list(status?: PublisherApprovalStatus) { return getPublisherApprovals(status); }
  getPending() { return getPublisherApprovals('pending'); }
  approve(id: string): SuperAdminOperationResult { const r = transitionPublisher(id, 'approved'); return r ? { success: true, data: r } : { success: false, errors: ['Invalid transition'] }; }
  reject(id: string): SuperAdminOperationResult { const r = transitionPublisher(id, 'rejected'); return r ? { success: true, data: r } : { success: false, errors: ['Invalid transition'] }; }
  suspend(id: string): SuperAdminOperationResult { const r = suspendPublisher(id); return r ? { success: true, data: r } : { success: false, errors: ['Failed'] }; }
}

export function createPublisherManagementService(): PublisherManagementService {
  return new PublisherManagementService();
}
