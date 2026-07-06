import type { AuthorServiceRequest } from '../types/authorServices.types';
import { generateId } from '../utils/permissions';

const requests: AuthorServiceRequest[] = [
  { id: generateId('asr'), requestNumber: 'ASR-001', authorName: 'Neha Desai', type: 'cover_design', status: 'queued', priority: 'normal', createdAt: new Date().toISOString() },
  { id: generateId('asr'), requestNumber: 'ASR-002', authorName: 'Ravi Patel', type: 'formatting', status: 'assigned', priority: 'high', createdAt: new Date().toISOString() },
  { id: generateId('asr'), requestNumber: 'ASR-003', authorName: 'Anita Rao', type: 'editing', status: 'in_progress', priority: 'normal', createdAt: new Date().toISOString() },
];

export function getAuthorServiceRequests() { return requests; }

export function assignServiceRequest(id: string): AuthorServiceRequest | null {
  const r = requests.find((x) => x.id === id);
  if (!r || r.status !== 'queued') return null;
  r.status = 'assigned';
  return r;
}
