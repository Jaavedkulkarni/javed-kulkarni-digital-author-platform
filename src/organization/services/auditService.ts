import type { IAuditLogRepository } from '../repositories/auditLogRepository';
import type { AuditLogEntry, CreateAuditLogInput } from '../types/audit.types';

export class AuditService {
  constructor(private readonly auditRepo: IAuditLogRepository) {}

  async log(input: CreateAuditLogInput): Promise<AuditLogEntry> {
    return this.auditRepo.append(input);
  }

  async logLogin(userId: string): Promise<AuditLogEntry> {
    return this.auditRepo.append({ eventType: 'login', actorId: userId });
  }

  async logLogout(userId: string): Promise<AuditLogEntry> {
    return this.auditRepo.append({ eventType: 'logout', actorId: userId });
  }

  async list(filters?: {
    actorId?: string;
    organizationId?: string;
    eventType?: AuditLogEntry['eventType'];
    limit?: number;
  }): Promise<AuditLogEntry[]> {
    return this.auditRepo.list(filters);
  }
}

export function createAuditService(auditRepo: IAuditLogRepository): AuditService {
  return new AuditService(auditRepo);
}
