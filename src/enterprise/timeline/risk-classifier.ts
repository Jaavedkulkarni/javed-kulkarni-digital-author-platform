import type { TimelineSeverity } from './timeline.types';

const CRITICAL_ACTIONS = new Set([
  'delete',
  'bulk_operation',
  'bulk_delete',
  'role_escalation',
  'protected_action',
  'unlock',
  'reset_failed_attempts',
]);

const WARNING_ACTIONS = new Set([
  'suspend',
  'password_reset',
  'force_password_change',
  'revoke_verification',
  'reset_mfa',
  'disable_mfa',
  'revoke_all',
  'failed_login',
  'account_locked',
]);

export function classifyAuditSeverity(action: string, metadata: Record<string, unknown>): TimelineSeverity {
  const normalized = action.toLowerCase();
  if (CRITICAL_ACTIONS.has(normalized)) return 'critical';
  if (metadata.protectedAccount === true || metadata.bulkOperation) return 'critical';
  if (WARNING_ACTIONS.has(normalized)) return 'warning';
  if (typeof metadata.failedAttempts === 'number' && metadata.failedAttempts >= 3) return 'warning';
  return 'normal';
}

export function classifySecuritySeverity(eventType: string, metadata: Record<string, unknown>): TimelineSeverity {
  const normalized = eventType.toLowerCase();
  if (
    normalized.includes('protected') ||
    normalized.includes('role_escalation') ||
    normalized.includes('bulk') ||
    normalized.includes('threshold')
  ) {
    return 'critical';
  }
  if (
    normalized.includes('failed') ||
    normalized.includes('revoked') ||
    normalized.includes('reset') ||
    normalized.includes('locked') ||
    metadata.newCountry === true ||
    metadata.newDevice === true
  ) {
    return 'warning';
  }
  return 'normal';
}

export function classifyLoginSeverity(eventType: string, metadata: Record<string, unknown>): TimelineSeverity {
  if (eventType === 'failed_login') {
    const attempts = typeof metadata.failedAttempts === 'number' ? metadata.failedAttempts : 0;
    return attempts >= 5 ? 'critical' : 'warning';
  }
  if (metadata.newCountry === true || metadata.impossibleTravel === true) return 'critical';
  if (metadata.newDevice === true || metadata.newBrowser === true) return 'warning';
  return 'normal';
}

export const SEVERITY_STYLES: Record<TimelineSeverity, string> = {
  normal: 'bg-navy-700/60 text-gray-300 border-navy-600',
  warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  critical: 'bg-red-500/15 text-red-300 border-red-500/30',
};

export const SEVERITY_DOT_STYLES: Record<TimelineSeverity, string> = {
  normal: 'bg-gray-400',
  warning: 'bg-amber-400',
  critical: 'bg-red-500',
};
