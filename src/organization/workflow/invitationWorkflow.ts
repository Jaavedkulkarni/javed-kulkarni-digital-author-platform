import type { InvitationStatus } from '../types/invitation.types';

export function isInvitationExpired(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() < Date.now();
}

export function canAcceptInvitation(status: InvitationStatus, expiresAt: string): boolean {
  return status === 'pending' && !isInvitationExpired(expiresAt);
}

export function canRevokeInvitation(status: InvitationStatus): boolean {
  return status === 'pending';
}
