import type { AuditEventType } from '../types/audit.types';

export const AUDIT_EVENT_LABELS: Record<AuditEventType, string> = {
  role_assignment: 'Role Assignment',
  workspace_switch: 'Workspace Switch',
  permission_change: 'Permission Change',
  organization_event: 'Organization Event',
  publisher_approval: 'Publisher Approval',
  author_verification: 'Author Verification',
  login: 'Login',
  logout: 'Logout',
  invitation_sent: 'Invitation Sent',
  invitation_accepted: 'Invitation Accepted',
};
