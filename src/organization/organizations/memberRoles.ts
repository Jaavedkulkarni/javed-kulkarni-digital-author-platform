import type { OrganizationMemberRole } from '../types/organization.types';

export const MEMBER_ROLE_HIERARCHY: OrganizationMemberRole[] = ['viewer', 'member', 'admin', 'owner'];

export function canManageMembers(role: OrganizationMemberRole): boolean {
  return role === 'owner' || role === 'admin';
}

export function isOrganizationOwner(role: OrganizationMemberRole, isOwner: boolean): boolean {
  return isOwner || role === 'owner';
}
