import type { PublisherApprovalRecord, PublisherApprovalStatus } from '../types/publisher.types';
import { generateId } from '../utils/common';
import { canTransitionPublisherStatus } from '../workflow/publisherWorkflow';

const publishers: PublisherApprovalRecord[] = [
  { id: generateId('pub'), companyName: 'PrintCo India', contactEmail: 'ops@printco.in', status: 'pending', documentsVerified: false, agreementSigned: false, completedJobs: 0, submittedAt: new Date().toISOString() },
  { id: generateId('pub'), companyName: 'Nova Press', contactEmail: 'hello@novapress.com', status: 'review', documentsVerified: true, agreementSigned: false, completedJobs: 12, submittedAt: new Date().toISOString() },
  { id: generateId('pub'), companyName: 'InkWorks', contactEmail: 'contact@inkworks.in', status: 'approved', documentsVerified: true, agreementSigned: true, completedJobs: 45, submittedAt: new Date().toISOString() },
];

export function getPublisherApprovals(status?: PublisherApprovalStatus) {
  return status ? publishers.filter((p) => p.status === status) : publishers;
}

export function transitionPublisher(id: string, status: PublisherApprovalStatus): PublisherApprovalRecord | null {
  const p = publishers.find((x) => x.id === id);
  if (!p || !canTransitionPublisherStatus(p.status, status)) return null;
  p.status = status;
  if (status === 'approved') { p.documentsVerified = true; p.agreementSigned = true; }
  return p;
}

export function suspendPublisher(id: string): PublisherApprovalRecord | null {
  return transitionPublisher(id, 'suspended');
}
