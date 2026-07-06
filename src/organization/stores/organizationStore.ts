import type { Organization, OrganizationMember, CreateOrganizationInput, UpdateOrganizationInput } from '../types/organization.types';
import { generateId, slugify } from '../utils/persistence';

const organizations = new Map<string, Organization>();
const members = new Map<string, OrganizationMember[]>();

export function getOrganizations(): Organization[] {
  return [...organizations.values()];
}

export function getOrganizationById(id: string): Organization | null {
  return organizations.get(id) ?? null;
}

export function getOrganizationsForUser(userId: string): Organization[] {
  const memberOrgs = (members.get(userId) ?? []).map((m) => organizations.get(m.organizationId)).filter(Boolean) as Organization[];
  const owned = getOrganizations().filter((o) => o.ownerId === userId);
  const ids = new Set<string>();
  return [...owned, ...memberOrgs].filter((o) => {
    if (ids.has(o.id)) return false;
    ids.add(o.id);
    return true;
  });
}

export function createOrganization(input: CreateOrganizationInput): Organization {
  const now = new Date().toISOString();
  const org: Organization = {
    id: generateId('org'),
    name: input.name.trim(),
    slug: input.slug ?? slugify(input.name),
    type: input.type,
    ownerId: input.ownerId,
    status: 'active',
    branding: input.branding ?? {},
    settings: input.settings ?? {},
    createdAt: now,
    updatedAt: now,
  };
  organizations.set(org.id, org);
  addMember(org.id, input.ownerId, 'owner', true);
  return org;
}

export function updateOrganization(id: string, input: UpdateOrganizationInput): Organization | null {
  const existing = organizations.get(id);
  if (!existing) return null;
  const updated: Organization = {
    ...existing,
    name: input.name ?? existing.name,
    branding: input.branding ? { ...existing.branding, ...input.branding } : existing.branding,
    settings: input.settings ? { ...existing.settings, ...input.settings } : existing.settings,
    status: input.status ?? existing.status,
    updatedAt: new Date().toISOString(),
  };
  organizations.set(id, updated);
  return updated;
}

export function getMembers(organizationId: string): OrganizationMember[] {
  return [...members.values()].flat().filter((m) => m.organizationId === organizationId);
}

export function getMembersForUser(userId: string): OrganizationMember[] {
  return members.get(userId) ?? [];
}

export function hasPublisherMembership(userId: string): boolean {
  const userOrgs = getOrganizationsForUser(userId);
  return userOrgs.some((o) => o.type === 'publisher_company');
}

function addMember(
  organizationId: string,
  userId: string,
  role: OrganizationMember['role'],
  isOwner: boolean
): OrganizationMember {
  const member: OrganizationMember = {
    id: generateId('member'),
    organizationId,
    userId,
    role,
    isOwner,
    joinedAt: new Date().toISOString(),
  };
  const existing = members.get(userId) ?? [];
  members.set(userId, [...existing, member]);
  return member;
}

export function resetOrganizationStore(): void {
  organizations.clear();
  members.clear();
}
