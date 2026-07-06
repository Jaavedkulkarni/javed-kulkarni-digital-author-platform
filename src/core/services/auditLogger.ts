import { logger } from '../../lib/utils/logger';
import { CORE_LOG_SCOPES } from '../constants/app.constants';
import { getConfigurationService } from '../config/configurationService';

export interface AuditEntry {
  action: string;
  actorId?: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export class AuditLogger {
  private entries: AuditEntry[] = [];
  private readonly maxEntries = 500;

  log(action: string, metadata?: Record<string, unknown>, actorId?: string): AuditEntry {
    const entry: AuditEntry = {
      action,
      actorId,
      metadata,
      timestamp: new Date().toISOString(),
    };

    if (getConfigurationService().isAuditLoggingEnabled()) {
      logger.info(CORE_LOG_SCOPES.audit, action, entry);
      this.entries.push(entry);
      if (this.entries.length > this.maxEntries) {
        this.entries.shift();
      }
    }

    return entry;
  }

  getRecentEntries(limit = 50): readonly AuditEntry[] {
    return this.entries.slice(-limit);
  }

  clear(): void {
    this.entries = [];
  }
}

export const auditLogger = new AuditLogger();
