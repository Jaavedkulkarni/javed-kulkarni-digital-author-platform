import { TIMEZONE_COUNTRY_MAP } from '../constants/people.constants';
import type {
  EditUserDetail,
  PeopleEditRepositoryRow,
  PeopleRepositoryRow,
  PeopleUser,
  PeopleUserStatus,
} from '../types/people.types';

const ROLE_PRIORITY = [
  'super_admin',
  'admin',
  'publisher',
  'author',
  'reader',
] as const;

function normalizeStatus(status: string, deletedAt: string | null): PeopleUserStatus {
  if (deletedAt || status === 'deleted') return 'deleted';
  if (status === 'suspended' || status === 'pending') return status;
  return 'active';
}

function formatRoleLabel(slug: string): string {
  return slug
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function resolvePrimaryRole(
  roles: PeopleRepositoryRow['user_roles'],
): { slug: string; label: string } {
  const activeRoles = (roles ?? [])
    .filter((row) => row.is_active !== false && row.roles?.name)
    .map((row) => row.roles!.name);

  if (activeRoles.length === 0) {
    return { slug: 'reader', label: 'Reader' };
  }

  for (const priority of ROLE_PRIORITY) {
    if (activeRoles.includes(priority)) {
      return { slug: priority, label: formatRoleLabel(priority) };
    }
  }

  const fallback = activeRoles[0];
  return { slug: fallback, label: formatRoleLabel(fallback) };
}

function resolveLastLogin(): string | null {
  return null;
}

function resolveCountry(timezone: string | null): string | null {
  if (!timezone) return null;
  return TIMEZONE_COUNTRY_MAP[timezone] ?? null;
}

function isEmailVerified(status: PeopleUserStatus): boolean {
  return status === 'active' || status === 'suspended';
}

export function mapPeopleRepositoryRow(row: PeopleRepositoryRow): PeopleUser {
  const status = normalizeStatus(row.status, row.deleted_at);
  const primaryRole = resolvePrimaryRole(row.user_roles);

  return {
    id: row.id,
    avatarUrl: row.avatar,
    name: row.full_name?.trim() || row.email.split('@')[0] || 'Unknown User',
    email: row.email,
    phone: row.phone,
    primaryRole: primaryRole.label,
    primaryRoleSlug: primaryRole.slug,
    status,
    emailVerified: isEmailVerified(status),
    lastLogin: resolveLastLogin(),
    createdAt: row.created_at,
    country: resolveCountry(row.timezone),
    timezone: row.timezone,
  };
}

function splitFullName(fullName: string | null): { firstName: string; lastName: string } {
  const normalized = (fullName ?? '').trim();
  if (!normalized) return { firstName: '', lastName: '' };
  const parts = normalized.split(/\s+/);
  return { firstName: parts[0] ?? '', lastName: parts.slice(1).join(' ') };
}

function resolveActiveRoles(roles: PeopleRepositoryRow['user_roles']): string[] {
  return (roles ?? [])
    .filter((row) => row.is_active !== false && row.roles?.name)
    .map((row) => row.roles!.name);
}

export function mapEditUserDetail(row: PeopleEditRepositoryRow, internalNotes = ''): EditUserDetail {
  const status = normalizeStatus(row.status, row.deleted_at ?? null);
  const primaryRole = resolvePrimaryRole(row.user_roles);
  const { firstName, lastName } = splitFullName(row.full_name);

  return {
    id: row.id,
    email: row.email,
    firstName,
    lastName,
    displayName: row.full_name?.trim() ?? '',
    phone: row.phone,
    language: row.preferred_language?.trim() || 'mr',
    timezone: row.timezone,
    status,
    avatarUrl: row.avatar,
    avatarVersion: row.avatar_version,
    internalNotes,
    activeRoles: resolveActiveRoles(row.user_roles),
    primaryRoleSlug: primaryRole.slug,
    primaryRole: primaryRole.label,
    createdAt: row.created_at,
    lastLogin: row.updated_at ?? null,
    registrationMethod: 'Email',
  };
}
