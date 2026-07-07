import type { EditUserDetail } from '../types/people.types';
import type { EditUserFormValues, EditUserUpdatePayload, EditUserStatus } from './edit-user.types';

function toEditUserStatus(status: EditUserDetail['status']): EditUserStatus {
  if (status === 'active' || status === 'pending' || status === 'suspended') return status;
  return 'active';
}

export function mapEditDetailToFormValues(detail: EditUserDetail): EditUserFormValues {
  return {
    firstName: detail.firstName,
    lastName: detail.lastName,
    displayName: detail.displayName,
    phone: detail.phone ?? '',
    status: toEditUserStatus(detail.status),
    language: detail.language,
    timezone: detail.timezone ?? 'Asia/Kolkata',
    internalNotes: detail.internalNotes,
    primaryRoleSlug: detail.primaryRoleSlug,
    activeRoles: [...detail.activeRoles],
    avatarFile: null,
    removeAvatar: false,
  };
}

function normalizePhone(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function buildEditUserUpdatePayload(
  userId: string,
  initial: EditUserFormValues,
  current: EditUserFormValues,
): EditUserUpdatePayload | null {
  const payload: EditUserUpdatePayload = { userId };
  let hasChanges = false;

  if (current.firstName !== initial.firstName) {
    payload.firstName = current.firstName;
    hasChanges = true;
  }
  if (current.lastName !== initial.lastName) {
    payload.lastName = current.lastName;
    hasChanges = true;
  }
  if (current.displayName !== initial.displayName) {
    payload.displayName = current.displayName;
    hasChanges = true;
  }

  const initialPhone = normalizePhone(initial.phone ?? '');
  const currentPhone = normalizePhone(current.phone ?? '');
  if (currentPhone !== initialPhone) {
    payload.phone = currentPhone;
    hasChanges = true;
  }

  if (current.status !== initial.status) {
    payload.status = current.status;
    hasChanges = true;
  }
  if (current.language !== initial.language) {
    payload.language = current.language;
    hasChanges = true;
  }
  if (current.timezone !== initial.timezone) {
    payload.timezone = current.timezone;
    hasChanges = true;
  }
  if (current.internalNotes !== initial.internalNotes) {
    payload.internalNotes = current.internalNotes;
    hasChanges = true;
  }

  const initialRoles = new Set(initial.activeRoles);
  const currentRoles = new Set(current.activeRoles);
  const assignRoles = [...currentRoles].filter((role) => !initialRoles.has(role));
  const removeRoles = [...initialRoles].filter((role) => !currentRoles.has(role));

  if (assignRoles.length > 0) {
    payload.assignRoles = assignRoles;
    hasChanges = true;
  }
  if (removeRoles.length > 0) {
    payload.removeRoles = removeRoles;
    hasChanges = true;
  }
  if (current.primaryRoleSlug !== initial.primaryRoleSlug) {
    payload.primaryRole = current.primaryRoleSlug;
    hasChanges = true;
  }

  return hasChanges ? payload : null;
}

export function getChangedEditUserFieldKeys(
  initial: EditUserFormValues,
  current: EditUserFormValues,
): (keyof EditUserFormValues)[] {
  const keys: (keyof EditUserFormValues)[] = [];

  if (current.firstName !== initial.firstName) keys.push('firstName');
  if (current.lastName !== initial.lastName) keys.push('lastName');
  if (current.displayName !== initial.displayName) keys.push('displayName');
  if (normalizePhone(current.phone ?? '') !== normalizePhone(initial.phone ?? '')) keys.push('phone');
  if (current.status !== initial.status) keys.push('status');
  if (current.language !== initial.language) keys.push('language');
  if (current.timezone !== initial.timezone) keys.push('timezone');
  if (current.internalNotes !== initial.internalNotes) keys.push('internalNotes');
  if (current.primaryRoleSlug !== initial.primaryRoleSlug) keys.push('primaryRoleSlug');

  const initialRoles = [...initial.activeRoles].sort().join(',');
  const currentRoles = [...current.activeRoles].sort().join(',');
  if (initialRoles !== currentRoles) keys.push('activeRoles');

  if (current.avatarFile) keys.push('avatarFile');
  if (current.removeAvatar && !initial.removeAvatar) keys.push('removeAvatar');

  return keys;
}

export function hasEditUserChanges(
  initial: EditUserFormValues,
  current: EditUserFormValues,
): boolean {
  return getChangedEditUserFieldKeys(initial, current).length > 0;
}

export function formatEditUserDate(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
