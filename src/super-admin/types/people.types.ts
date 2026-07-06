import type { EntityStatus } from './common';

export type PeopleType = 'reader' | 'author' | 'publisher' | 'platform_admin' | 'organization';

export interface PeopleRecord {
  id: string;
  type: PeopleType;
  name: string;
  email: string;
  status: EntityStatus;
  verified: boolean;
  createdAt: string;
}

export interface PeopleFilters {
  type?: PeopleType;
  status?: EntityStatus;
  search?: string;
  verified?: boolean;
}
