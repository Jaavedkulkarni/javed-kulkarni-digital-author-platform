import type { SecurityAuditEntry, ActiveSession } from '../types/security.types';
import { generateId } from '../utils/common';

const audits: SecurityAuditEntry[] = [
  { id: generateId('aud'), eventType: 'permission_change', actorId: 'super', description: 'Platform admin departments updated', ipAddress: '192.168.1.1', createdAt: new Date().toISOString() },
  { id: generateId('aud'), eventType: 'failed_login', actorId: null, description: 'Failed login attempt', ipAddress: '10.0.0.55', createdAt: new Date().toISOString() },
  { id: generateId('aud'), eventType: 'role_change', actorId: 'super', description: 'Author verification upgraded to premium', ipAddress: '192.168.1.1', createdAt: new Date().toISOString() },
];
const sessions: ActiveSession[] = [
  { id: generateId('sess'), userId: 'user1', device: 'Chrome / Windows', location: 'Mumbai, IN', lastActiveAt: new Date().toISOString() },
  { id: generateId('sess'), userId: 'user2', device: 'Safari / iOS', location: 'Delhi, IN', lastActiveAt: new Date().toISOString() },
];

export function getAuditLog() { return audits; }
export function getActiveSessions() { return sessions; }

export function appendAudit(entry: Omit<SecurityAuditEntry, 'id' | 'createdAt'>): SecurityAuditEntry {
  const e: SecurityAuditEntry = { ...entry, id: generateId('aud'), createdAt: new Date().toISOString() };
  audits.unshift(e);
  return e;
}
