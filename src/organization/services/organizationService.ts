import type { IOrganizationRepository } from '../repositories/organizationRepository';
import type {
  Organization,
  OrganizationMember,
  CreateOrganizationInput,
  UpdateOrganizationInput,
} from '../types/organization.types';
import type { OrganizationOperationResult } from '../types/common';
import { validateCreateOrganization, validateOrganizationAccess } from '../validators/organizationValidator';

export class OrganizationService {
  constructor(private readonly orgRepo: IOrganizationRepository) {}

  async list(): Promise<Organization[]> {
    return this.orgRepo.list();
  }

  async getById(id: string): Promise<Organization | null> {
    return this.orgRepo.findById(id);
  }

  async listForUser(userId: string): Promise<Organization[]> {
    return this.orgRepo.findByUserId(userId);
  }

  async create(input: CreateOrganizationInput): Promise<OrganizationOperationResult<Organization>> {
    const validation = validateCreateOrganization(input);
    if (!validation.valid) return { success: false, errors: validation.errors };
    const org = await this.orgRepo.create(input);
    return { success: true, data: org };
  }

  async update(
    id: string,
    actorId: string,
    input: UpdateOrganizationInput,
    isSuperAdmin: boolean
  ): Promise<OrganizationOperationResult<Organization>> {
    const org = await this.orgRepo.findById(id);
    if (!org) return { success: false, errors: ['Organization not found.'] };
    const access = validateOrganizationAccess(actorId, org.ownerId, isSuperAdmin);
    if (!access.valid) return { success: false, errors: access.errors };
    const updated = await this.orgRepo.update(id, input);
    if (!updated) return { success: false, errors: ['Failed to update organization.'] };
    return { success: true, data: updated };
  }

  async getMembers(organizationId: string): Promise<OrganizationMember[]> {
    return this.orgRepo.getMembers(organizationId);
  }
}

export function createOrganizationService(repo: IOrganizationRepository): OrganizationService {
  return new OrganizationService(repo);
}
