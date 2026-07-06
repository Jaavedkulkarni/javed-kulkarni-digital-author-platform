import type {
  Organization,
  OrganizationMember,
  CreateOrganizationInput,
  UpdateOrganizationInput,
} from '../types/organization.types';
import {
  getOrganizations,
  getOrganizationById,
  getOrganizationsForUser,
  createOrganization,
  updateOrganization,
  getMembers,
  hasPublisherMembership,
} from '../stores/organizationStore';

/**
 * In-memory repository abstraction.
 * Replace with SupabaseOrganizationRepository when organizations migration lands.
 */
export interface IOrganizationRepository {
  list(): Promise<Organization[]>;
  findById(id: string): Promise<Organization | null>;
  findByUserId(userId: string): Promise<Organization[]>;
  create(input: CreateOrganizationInput): Promise<Organization>;
  update(id: string, input: UpdateOrganizationInput): Promise<Organization | null>;
  getMembers(organizationId: string): Promise<OrganizationMember[]>;
  userHasPublisherMembership(userId: string): Promise<boolean>;
}

export class InMemoryOrganizationRepository implements IOrganizationRepository {
  async list(): Promise<Organization[]> {
    return getOrganizations();
  }

  async findById(id: string): Promise<Organization | null> {
    return getOrganizationById(id);
  }

  async findByUserId(userId: string): Promise<Organization[]> {
    return getOrganizationsForUser(userId);
  }

  async create(input: CreateOrganizationInput): Promise<Organization> {
    return createOrganization(input);
  }

  async update(id: string, input: UpdateOrganizationInput): Promise<Organization | null> {
    return updateOrganization(id, input);
  }

  async getMembers(organizationId: string): Promise<OrganizationMember[]> {
    return getMembers(organizationId);
  }

  async userHasPublisherMembership(userId: string): Promise<boolean> {
    return hasPublisherMembership(userId);
  }
}

export function createOrganizationRepository(): InMemoryOrganizationRepository {
  return new InMemoryOrganizationRepository();
}
