import type { OrganizationType } from '../types/organization.types';

export const ORGANIZATION_TYPE_LABELS: Record<OrganizationType, string> = {
  platform: 'Platform',
  publisher_company: 'Publisher Company',
  enterprise: 'Enterprise',
};

export const DEFAULT_INVITATION_EXPIRY_DAYS = 7;
