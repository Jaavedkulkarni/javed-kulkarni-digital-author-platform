import { getAuditLog, getActiveSessions, appendAudit } from '../stores/securityStore';
import { canAccessSuperAdmin } from '../security/accessControl';
import { validateDestructiveAction } from '../validators/securityValidator';
import type { SystemRole } from '../../types/roles';
import type { SuperAdminOperationResult } from '../types/common';
import type { SecurityAuditEntry } from '../types/security.types';

export class SecurityService {
  getAuditLog() { return getAuditLog(); }
  getActiveSessions() { return getActiveSessions(); }

  assertAccess(roles: SystemRole[]): boolean {
    return canAccessSuperAdmin(roles);
  }

  executeDestructive(action: string, confirmed: boolean, actorId: string): SuperAdminOperationResult {
    const v = validateDestructiveAction(action, confirmed);
    if (!v.valid) return { success: false, errors: v.errors };
    appendAudit({ eventType: 'destructive_action', actorId, description: action, ipAddress: null });
    return { success: true };
  }
}

export class AuditService {
  list() { return getAuditLog(); }
  log(entry: Omit<SecurityAuditEntry, 'id' | 'createdAt'>) { return appendAudit(entry); }
}

export function createSecurityService(): SecurityService {
  return new SecurityService();
}

export function createAuditService(): AuditService {
  return new AuditService();
}
