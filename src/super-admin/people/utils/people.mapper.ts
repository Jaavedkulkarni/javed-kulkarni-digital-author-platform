import { TIMEZONE_COUNTRY_MAP } from '../constants/people.constants';
import type {
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

function normalizeStatus(status: string): PeopleUserStatus {
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

function resolveLastLogin(_row: PeopleRepositoryRow): string | null {
  return null;
}

function resolveCountry(timezone: string | null): string | null {
  if (!timezone) return null;
  return TIMEZONE_COUNTRY_MAP[timezone] ?? null;
}

function isEmailVerified(status: PeopleUserStatus): boolean {
  return status !== 'pending';
}

export function mapPeopleRepositoryRow(row: PeopleRepositoryRow): PeopleUser {
  const status = normalizeStatus(row.status);
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
    lastLogin: resolveLastLogin(row),
    createdAt: row.created_at,
    country: resolveCountry(row.timezone),
    timezone: row.timezone,
  };
}
