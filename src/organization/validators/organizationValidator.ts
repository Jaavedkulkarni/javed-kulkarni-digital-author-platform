import type { CreateOrganizationInput } from '../types/organization.types';
import { invalidResult, validResult, validateRequired, type ValidationResult } from './common';

export function validateCreateOrganization(input: CreateOrganizationInput): ValidationResult {
  const nameCheck = validateRequired(input.name, 'Organization name');
  if (!nameCheck.valid) return nameCheck;
  if (!input.ownerId?.trim()) return invalidResult(['Owner is required.']);
  return validResult();
}

export function validateOrganizationAccess(
  actorId: string,
  ownerId: string,
  isSuperAdmin: boolean
): ValidationResult {
  if (actorId === ownerId || isSuperAdmin) return validResult();
  return invalidResult(['You do not have permission to manage this organization.']);
}
