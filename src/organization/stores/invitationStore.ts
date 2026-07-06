import type { OrganizationInvitation, CreateOrganizationInvitationInput } from '../types/invitation.types';
import { DEFAULT_INVITATION_EXPIRY_DAYS } from '../constants/organization.constants';
import { generateId } from '../utils/persistence';

const invitations = new Map<string, OrganizationInvitation>();

export function getInvitations(): OrganizationInvitation[] {
  return [...invitations.values()];
}

export function getInvitationByToken(token: string): OrganizationInvitation | null {
  return getInvitations().find((i) => i.token === token) ?? null;
}

export function getInvitationsForOrganization(organizationId: string): OrganizationInvitation[] {
  return getInvitations().filter((i) => i.organizationId === organizationId);
}

export function createInvitation(input: CreateOrganizationInvitationInput): OrganizationInvitation {
  const expires = new Date();
  expires.setDate(expires.getDate() + (input.expiresInDays ?? DEFAULT_INVITATION_EXPIRY_DAYS));
  const inv: OrganizationInvitation = {
    id: generateId('inv'),
    type: input.type,
    email: input.email.trim().toLowerCase(),
    organizationId: input.organizationId ?? null,
    roleName: input.roleName ?? null,
    token: generateId('token'),
    invitedBy: input.invitedBy,
    status: 'pending',
    expiresAt: expires.toISOString(),
    acceptedAt: null,
    createdAt: new Date().toISOString(),
  };
  invitations.set(inv.id, inv);
  return inv;
}

export function acceptInvitation(token: string): OrganizationInvitation | null {
  const inv = getInvitationByToken(token);
  if (!inv) return null;
  const updated: OrganizationInvitation = {
    ...inv,
    status: 'accepted',
    acceptedAt: new Date().toISOString(),
  };
  invitations.set(inv.id, updated);
  return updated;
}

export function revokeInvitation(id: string): OrganizationInvitation | null {
  const inv = invitations.get(id);
  if (!inv) return null;
  const updated: OrganizationInvitation = { ...inv, status: 'revoked' };
  invitations.set(id, updated);
  return updated;
}

export function resetInvitationStore(): void {
  invitations.clear();
}
