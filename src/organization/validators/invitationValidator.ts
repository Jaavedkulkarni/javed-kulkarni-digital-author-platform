import type { CreateOrganizationInvitationInput } from '../types/invitation.types';
import { invalidResult, validResult, validateRequired, type ValidationResult } from './common';

export function validateCreateInvitation(input: CreateOrganizationInvitationInput): ValidationResult {
  const emailCheck = validateRequired(input.email, 'Email');
  if (!emailCheck.valid) return emailCheck;
  if (!input.invitedBy?.trim()) return invalidResult(['Inviter is required.']);
  if (input.type === 'organization' && !input.organizationId) {
    return invalidResult(['Organization ID is required for organization invitations.']);
  }
  return validResult();
}
