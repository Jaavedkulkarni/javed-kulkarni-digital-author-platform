import type { IOrganizationInvitationRepository } from '../repositories/organizationInvitationRepository';
import type { IAuditLogRepository } from '../repositories/auditLogRepository';
import type {
  OrganizationInvitation,
  CreateOrganizationInvitationInput,
  AcceptInvitationInput,
} from '../types/invitation.types';
import type { OrganizationOperationResult } from '../types/common';
import { validateCreateInvitation } from '../validators/invitationValidator';
import { canAcceptInvitation, canRevokeInvitation, isInvitationExpired } from '../workflow/invitationWorkflow';

export class InvitationService {
  constructor(
    private readonly invitationRepo: IOrganizationInvitationRepository,
    private readonly auditRepo: IAuditLogRepository
  ) {}

  async list(): Promise<OrganizationInvitation[]> {
    return this.invitationRepo.list();
  }

  async listForOrganization(organizationId: string): Promise<OrganizationInvitation[]> {
    return this.invitationRepo.findByOrganization(organizationId);
  }

  async create(
    input: CreateOrganizationInvitationInput
  ): Promise<OrganizationOperationResult<OrganizationInvitation>> {
    const validation = validateCreateInvitation(input);
    if (!validation.valid) return { success: false, errors: validation.errors };
    const invitation = await this.invitationRepo.create(input);
    await this.auditRepo.append({
      eventType: 'invitation_sent',
      actorId: input.invitedBy,
      organizationId: input.organizationId ?? null,
      metadata: { email: input.email, type: input.type },
    });
    return { success: true, data: invitation };
  }

  async accept(input: AcceptInvitationInput): Promise<OrganizationOperationResult<OrganizationInvitation>> {
    const invitation = await this.invitationRepo.findByToken(input.token);
    if (!invitation) return { success: false, errors: ['Invitation not found.'] };
    if (!canAcceptInvitation(invitation.status, invitation.expiresAt)) {
      if (isInvitationExpired(invitation.expiresAt)) {
        return { success: false, errors: ['Invitation has expired.'] };
      }
      return { success: false, errors: ['Invitation cannot be accepted.'] };
    }
    const accepted = await this.invitationRepo.accept(input.token);
    if (!accepted) return { success: false, errors: ['Failed to accept invitation.'] };
    await this.auditRepo.append({
      eventType: 'invitation_accepted',
      actorId: input.userId,
      organizationId: invitation.organizationId,
      metadata: { type: invitation.type },
    });
    return { success: true, data: accepted };
  }

  async revoke(id: string, actorId: string): Promise<OrganizationOperationResult<OrganizationInvitation>> {
    const invitations = await this.invitationRepo.list();
    const invitation = invitations.find((i) => i.id === id);
    if (!invitation) return { success: false, errors: ['Invitation not found.'] };
    if (!canRevokeInvitation(invitation.status)) {
      return { success: false, errors: ['Invitation cannot be revoked.'] };
    }
    const revoked = await this.invitationRepo.revoke(id);
    if (!revoked) return { success: false, errors: ['Failed to revoke invitation.'] };
    await this.auditRepo.append({
      eventType: 'organization_event',
      actorId,
      organizationId: invitation.organizationId,
      metadata: { action: 'invitation_revoked', invitationId: id },
    });
    return { success: true, data: revoked };
  }
}

export function createInvitationService(
  invitationRepo: IOrganizationInvitationRepository,
  auditRepo: IAuditLogRepository
): InvitationService {
  return new InvitationService(invitationRepo, auditRepo);
}
