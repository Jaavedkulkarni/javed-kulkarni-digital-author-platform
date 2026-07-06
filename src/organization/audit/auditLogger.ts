import type { CreateAuditLogInput } from '../types/audit.types';
import { appendAuditLog } from '../stores/auditStore';

export function logAuditEvent(input: CreateAuditLogInput): void {
  appendAuditLog(input);
}
