export * from './organizationStore';
export * from './invitationStore';
export * from './auditStore';
export * from './workspacePreferenceStore';
export * from './verificationStore';

import { resetOrganizationStore } from './organizationStore';
import { resetInvitationStore } from './invitationStore';
import { resetAuditStore } from './auditStore';
import { resetVerificationStore } from './verificationStore';

export function resetAllOrganizationStores(): void {
  resetOrganizationStore();
  resetInvitationStore();
  resetAuditStore();
  resetVerificationStore();
}
