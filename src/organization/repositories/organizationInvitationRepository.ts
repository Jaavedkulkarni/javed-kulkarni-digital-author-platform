import type { OrganizationInvitation, CreateOrganizationInvitationInput } from '../types/invitation.types';
import {
  getInvitations,
  getInvitationByToken,
  getInvitationsForOrganization,
  createInvitation,
  acceptInvitation,
  revokeInvitation,
} from '../stores/invitationStore';

export interface IOrganizationInvitationRepository {
  list(): Promise<OrganizationInvitation[]>;
  findByToken(token: string): Promise<OrganizationInvitation | null>;
  findByOrganization(organizationId: string): Promise<OrganizationInvitation[]>;
  create(input: CreateOrganizationInvitationInput): Promise<OrganizationInvitation>;
  accept(token: string): Promise<OrganizationInvitation | null>;
  revoke(id: string): Promise<OrganizationInvitation | null>;
}

export class InMemoryOrganizationInvitationRepository implements IOrganizationInvitationRepository {
  async list(): Promise<OrganizationInvitation[]> {
    return getInvitations();
  }

  async findByToken(token: string): Promise<OrganizationInvitation | null> {
    return getInvitationByToken(token);
  }

  async findByOrganization(organizationId: string): Promise<OrganizationInvitation[]> {
    return getInvitationsForOrganization(organizationId);
  }

  async create(input: CreateOrganizationInvitationInput): Promise<OrganizationInvitation> {
    return createInvitation(input);
  }

  async accept(token: string): Promise<OrganizationInvitation | null> {
    return acceptInvitation(token);
  }

  async revoke(id: string): Promise<OrganizationInvitation | null> {
    return revokeInvitation(id);
  }
}

export function createOrganizationInvitationRepository(): InMemoryOrganizationInvitationRepository {
  return new InMemoryOrganizationInvitationRepository();
}
