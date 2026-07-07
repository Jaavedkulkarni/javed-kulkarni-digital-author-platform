import { ValidationError } from '../errors/app-error.ts';

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export interface SecurityUserActionRequest {
  userId: string;
  action: string;
  sessionId?: string;
  invitationId?: string;
  role?: string;
  notes?: string;
}

const RESET_PASSWORD_ACTIONS = new Set([
  'get_status',
  'reset_password',
  'generate_temporary_password',
  'force_password_change',
  'expire_temporary_password',
  'resend_verification',
  'mark_verified',
  'revoke_verification',
]);

const INVITATION_ACTIONS = new Set(['list', 'send', 'resend', 'cancel', 'regenerate']);
const SESSION_ACTIONS = new Set(['list', 'revoke_session', 'revoke_all']);
const MFA_ACTIONS = new Set(['get_status', 'reset', 'disable', 'require']);
const UNLOCK_ACTIONS = new Set(['get_status', 'unlock', 'reset_failed_attempts']);

function baseRequest(body: unknown): { userId: string; action: string; notes?: string } {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Request body is required');
  }
  const input = body as Record<string, unknown>;
  if (!isNonEmptyString(input.userId)) throw new ValidationError('userId is required');
  if (!isNonEmptyString(input.action)) throw new ValidationError('action is required');
  const notes = typeof input.notes === 'string' ? input.notes.trim() : undefined;
  return { userId: input.userId.trim(), action: input.action.trim(), notes: notes || undefined };
}

export function validateResetPasswordRequest(body: unknown): SecurityUserActionRequest {
  const base = baseRequest(body);
  if (!RESET_PASSWORD_ACTIONS.has(base.action)) {
    throw new ValidationError('Invalid password action');
  }
  return base;
}

export function validateManageInvitationRequest(body: unknown): SecurityUserActionRequest {
  const base = baseRequest(body);
  if (!INVITATION_ACTIONS.has(base.action)) {
    throw new ValidationError('Invalid invitation action');
  }
  const input = body as Record<string, unknown>;
  return {
    ...base,
    invitationId: typeof input.invitationId === 'string' ? input.invitationId.trim() : undefined,
    role: typeof input.role === 'string' ? input.role.trim() : undefined,
  };
}

export function validateManageSessionsRequest(body: unknown): SecurityUserActionRequest {
  const base = baseRequest(body);
  if (!SESSION_ACTIONS.has(base.action)) {
    throw new ValidationError('Invalid session action');
  }
  const input = body as Record<string, unknown>;
  return {
    ...base,
    sessionId: typeof input.sessionId === 'string' ? input.sessionId.trim() : undefined,
  };
}

export function validateManageMfaRequest(body: unknown): SecurityUserActionRequest {
  const base = baseRequest(body);
  if (!MFA_ACTIONS.has(base.action)) {
    throw new ValidationError('Invalid MFA action');
  }
  return base;
}

export function validateUnlockAccountRequest(body: unknown): SecurityUserActionRequest {
  const base = baseRequest(body);
  if (!UNLOCK_ACTIONS.has(base.action)) {
    throw new ValidationError('Invalid unlock action');
  }
  return base;
}
