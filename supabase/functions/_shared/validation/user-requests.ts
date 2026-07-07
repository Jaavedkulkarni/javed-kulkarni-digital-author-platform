import { ValidationError } from '../errors/app-error.ts';

const PHONE_PATTERN = /^\+?[0-9\s\-()]{7,20}$/;
const PASSWORD_SPECIAL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const VALID_ROLES = new Set(['reader', 'author', 'publisher', 'admin', 'super_admin']);
const VALID_STATUSES = new Set(['active', 'pending', 'suspended']);
const PASSWORD_MIN_LENGTH = 12;

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function optionalTrimmed(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function validatePassword(password: string): void {
  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new ValidationError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
  }
  if (!/[A-Z]/.test(password)) {
    throw new ValidationError('Password must include an uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    throw new ValidationError('Password must include a lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    throw new ValidationError('Password must include a number');
  }
  if (!new RegExp(`[${escapeRegex(PASSWORD_SPECIAL_CHARS)}]`).test(password)) {
    throw new ValidationError('Password must include a special character');
  }
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  displayName?: string;
  email: string;
  phone?: string;
  role: string;
  status: 'active' | 'pending' | 'suspended';
  emailVerificationRequired: boolean;
  password: string;
  language: string;
  timezone: string;
  internalNotes?: string;
}

export function validateCreateUserRequest(body: unknown): CreateUserRequest {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Request body is required');
  }

  const input = body as Record<string, unknown>;

  if (!isNonEmptyString(input.firstName)) {
    throw new ValidationError('First name is required');
  }
  if (!isNonEmptyString(input.lastName)) {
    throw new ValidationError('Last name is required');
  }
  if (!isNonEmptyString(input.email)) {
    throw new ValidationError('Email is required');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    throw new ValidationError('Enter a valid email address');
  }
  if (!isNonEmptyString(input.role) || !VALID_ROLES.has(input.role.trim())) {
    throw new ValidationError('A valid role is required');
  }
  if (typeof input.status !== 'string' || !VALID_STATUSES.has(input.status)) {
    throw new ValidationError('A valid status is required');
  }
  if (typeof input.emailVerificationRequired !== 'boolean') {
    throw new ValidationError('emailVerificationRequired must be a boolean');
  }
  if (!isNonEmptyString(input.password)) {
    throw new ValidationError('Password is required');
  }
  if (!isNonEmptyString(input.language)) {
    throw new ValidationError('Language is required');
  }
  if (!isNonEmptyString(input.timezone)) {
    throw new ValidationError('Timezone is required');
  }

  const phone = optionalTrimmed(input.phone);
  if (phone && !PHONE_PATTERN.test(phone)) {
    throw new ValidationError('Enter a valid phone number');
  }

  validatePassword(input.password);

  const displayName = optionalTrimmed(input.displayName);
  const internalNotes = optionalTrimmed(input.internalNotes);

  return {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    displayName,
    email: input.email.trim().toLowerCase(),
    phone,
    role: input.role.trim(),
    status: input.status as CreateUserRequest['status'],
    emailVerificationRequired: input.emailVerificationRequired,
    password: input.password,
    language: input.language.trim(),
    timezone: input.timezone.trim(),
    internalNotes,
  };
}

export interface UserIdRequest {
  userId: string;
  reason?: string;
}

export function validateUserIdRequest(body: unknown, requireReason = false): UserIdRequest {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Request body is required');
  }

  const input = body as Record<string, unknown>;
  if (!isNonEmptyString(input.userId)) {
    throw new ValidationError('userId is required');
  }

  const reason = optionalTrimmed(input.reason);
  if (requireReason && !reason) {
    throw new ValidationError('reason is required');
  }

  return { userId: input.userId.trim(), reason };
}

const SUSPEND_REASONS = new Set([
  'policy_violation',
  'spam',
  'security',
  'requested_by_user',
  'duplicate_account',
  'other',
]);

export interface SuspendUserRequest {
  userId: string;
  reason: string;
  notes?: string;
  effectiveImmediately: boolean;
}

export function validateSuspendUserRequest(body: unknown): SuspendUserRequest {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Request body is required');
  }

  const input = body as Record<string, unknown>;
  if (!isNonEmptyString(input.userId)) {
    throw new ValidationError('userId is required');
  }
  if (!isNonEmptyString(input.reason) || !SUSPEND_REASONS.has(input.reason.trim())) {
    throw new ValidationError('A valid suspension reason is required');
  }

  const notes = optionalTrimmed(input.notes);
  const effectiveImmediately = input.effectiveImmediately !== false;

  return {
    userId: input.userId.trim(),
    reason: input.reason.trim(),
    notes,
    effectiveImmediately,
  };
}

export interface RestoreUserRequest {
  userId: string;
  notes?: string;
}

export function validateRestoreUserRequest(body: unknown): RestoreUserRequest {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Request body is required');
  }

  const input = body as Record<string, unknown>;
  if (!isNonEmptyString(input.userId)) {
    throw new ValidationError('userId is required');
  }

  return {
    userId: input.userId.trim(),
    notes: optionalTrimmed(input.notes),
  };
}

const DELETE_REASONS = new Set([
  'duplicate_account',
  'requested_by_user',
  'spam',
  'legal_request',
  'security',
  'other',
]);

export interface DeleteUserRequest {
  userId: string;
  reason: string;
  notes?: string;
}

export function validateDeleteUserRequest(body: unknown): DeleteUserRequest {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Request body is required');
  }

  const input = body as Record<string, unknown>;
  if (!isNonEmptyString(input.userId)) {
    throw new ValidationError('userId is required');
  }
  if (!isNonEmptyString(input.reason) || !DELETE_REASONS.has(input.reason.trim())) {
    throw new ValidationError('A valid deletion reason is required');
  }

  return {
    userId: input.userId.trim(),
    reason: input.reason.trim(),
    notes: optionalTrimmed(input.notes),
  };
}

export interface RecoverUserRequest {
  userId: string;
  notes?: string;
}

export function validateRecoverUserRequest(body: unknown): RecoverUserRequest {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Request body is required');
  }

  const input = body as Record<string, unknown>;
  if (!isNonEmptyString(input.userId)) {
    throw new ValidationError('userId is required');
  }

  return {
    userId: input.userId.trim(),
    notes: optionalTrimmed(input.notes),
  };
}

export interface UpdateUserRequest {
  userId: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string | null;
  status?: 'active' | 'pending' | 'suspended';
  language?: string;
  timezone?: string;
  internalNotes?: string;
  assignRoles?: string[];
  removeRoles?: string[];
  primaryRole?: string;
  reason?: string;
}

export function validateUpdateUserRequest(body: unknown): UpdateUserRequest {
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Request body is required');
  }

  const input = body as Record<string, unknown>;
  const base = validateUserIdRequest(body);

  const patch: UpdateUserRequest = { userId: base.userId, reason: base.reason };

  if (input.firstName !== undefined) {
    if (!isNonEmptyString(input.firstName)) throw new ValidationError('firstName cannot be empty');
    patch.firstName = input.firstName.trim();
  }
  if (input.lastName !== undefined) {
    if (!isNonEmptyString(input.lastName)) throw new ValidationError('lastName cannot be empty');
    patch.lastName = input.lastName.trim();
  }
  if (input.displayName !== undefined) {
    patch.displayName = optionalTrimmed(input.displayName);
  }
  if (input.phone !== undefined) {
    if (input.phone === null || input.phone === '') {
      patch.phone = null;
    } else if (typeof input.phone === 'string') {
      const phone = input.phone.trim();
      if (phone && !PHONE_PATTERN.test(phone)) {
        throw new ValidationError('Enter a valid phone number');
      }
      patch.phone = phone || null;
    } else {
      throw new ValidationError('phone must be a string or null');
    }
  }
  if (input.status !== undefined) {
    if (typeof input.status !== 'string' || !VALID_STATUSES.has(input.status)) {
      throw new ValidationError('Invalid status');
    }
    patch.status = input.status as UpdateUserRequest['status'];
  }
  if (input.language !== undefined) {
    if (!isNonEmptyString(input.language)) throw new ValidationError('language cannot be empty');
    patch.language = input.language.trim();
  }
  if (input.timezone !== undefined) {
    if (!isNonEmptyString(input.timezone)) throw new ValidationError('timezone cannot be empty');
    patch.timezone = input.timezone.trim();
  }
  if (input.internalNotes !== undefined) {
    patch.internalNotes = optionalTrimmed(input.internalNotes) ?? '';
  }
  if (input.assignRoles !== undefined) {
    if (!Array.isArray(input.assignRoles)) throw new ValidationError('assignRoles must be an array');
    patch.assignRoles = input.assignRoles.filter((r): r is string => typeof r === 'string' && VALID_ROLES.has(r.trim())).map((r) => r.trim());
  }
  if (input.removeRoles !== undefined) {
    if (!Array.isArray(input.removeRoles)) throw new ValidationError('removeRoles must be an array');
    patch.removeRoles = input.removeRoles.filter((r): r is string => typeof r === 'string' && VALID_ROLES.has(r.trim())).map((r) => r.trim());
  }
  if (input.primaryRole !== undefined) {
    if (!isNonEmptyString(input.primaryRole) || !VALID_ROLES.has(input.primaryRole.trim())) {
      throw new ValidationError('Invalid primary role');
    }
    patch.primaryRole = input.primaryRole.trim();
  }

  const hasPatch =
    patch.firstName !== undefined ||
    patch.lastName !== undefined ||
    patch.displayName !== undefined ||
    patch.phone !== undefined ||
    patch.status !== undefined ||
    patch.language !== undefined ||
    patch.timezone !== undefined ||
    patch.internalNotes !== undefined ||
    (patch.assignRoles && patch.assignRoles.length > 0) ||
    (patch.removeRoles && patch.removeRoles.length > 0) ||
    patch.primaryRole !== undefined;

  if (!hasPatch) {
    throw new ValidationError('At least one field to update is required');
  }

  return patch;
}

export function buildFullName(
  firstName: string,
  lastName: string,
  displayName?: string,
): string {
  return displayName?.trim() || `${firstName} ${lastName}`.trim();
}
