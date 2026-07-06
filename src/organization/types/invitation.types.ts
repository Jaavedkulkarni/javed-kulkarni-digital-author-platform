export type InvitationType = 'platform_admin' | 'organization' | 'publisher_team';

export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'revoked';

export interface OrganizationInvitation {
  id: string;
  type: InvitationType;
  email: string;
  organizationId: string | null;
  roleName: string | null;
  token: string;
  invitedBy: string;
  status: InvitationStatus;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
}

export interface CreateOrganizationInvitationInput {
  type: InvitationType;
  email: string;
  organizationId?: string | null;
  roleName?: string | null;
  invitedBy: string;
  expiresInDays?: number;
}

export interface AcceptInvitationInput {
  token: string;
  userId: string;
}
