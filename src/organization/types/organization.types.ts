import type { EntityStatus } from './common';

export type OrganizationType = 'platform' | 'publisher_company' | 'enterprise';

export interface OrganizationBranding {
  logoUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
}

export interface OrganizationSettings {
  timezone?: string;
  locale?: string;
  allowMemberInvites?: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  type: OrganizationType;
  ownerId: string;
  status: EntityStatus;
  branding: OrganizationBranding;
  settings: OrganizationSettings;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: OrganizationMemberRole;
  isOwner: boolean;
  joinedAt: string;
}

export type OrganizationMemberRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface CreateOrganizationInput {
  name: string;
  slug?: string;
  type: OrganizationType;
  ownerId: string;
  branding?: OrganizationBranding;
  settings?: OrganizationSettings;
}

export interface UpdateOrganizationInput {
  name?: string;
  branding?: Partial<OrganizationBranding>;
  settings?: Partial<OrganizationSettings>;
  status?: EntityStatus;
}
