import type { AuditLogEntry, CreateAuditLogInput } from '../types/audit.types';
import { generateId } from '../utils/persistence';

const logs: AuditLogEntry[] = [];

export function appendAuditLog(input: CreateAuditLogInput): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: generateId('audit'),
    eventType: input.eventType,
    actorId: input.actorId,
    targetId: input.targetId ?? null,
    organizationId: input.organizationId ?? null,
    metadata: input.metadata ?? {},
    createdAt: new Date().toISOString(),
  };
  logs.unshift(entry);
  return entry;
}

export function getAuditLogs(filters?: {
  actorId?: string;
  organizationId?: string;
  eventType?: AuditLogEntry['eventType'];
  limit?: number;
}): AuditLogEntry[] {
  let result = [...logs];
  if (filters?.actorId) result = result.filter((l) => l.actorId === filters.actorId);
  if (filters?.organizationId) result = result.filter((l) => l.organizationId === filters.organizationId);
  if (filters?.eventType) result = result.filter((l) => l.eventType === filters.eventType);
  if (filters?.limit) result = result.slice(0, filters.limit);
  return result;
}

export function resetAuditStore(): void {
  logs.length = 0;
}
