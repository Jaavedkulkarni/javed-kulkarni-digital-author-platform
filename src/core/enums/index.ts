export { CORE_ROLES, type CoreRoleName } from '../constants/roles.constants';
export { USER_STATUSES, JOB_STATUSES, HEALTH_STATUSES, WEBHOOK_DELIVERY_STATUSES } from '../constants/statuses.constants';
export { DOMAIN_EVENT_NAMES, type DomainEventName } from '../constants/events.constants';
export { ENTERPRISE_PERMISSIONS, type EnterprisePermissionLevel } from '../constants/permissions.constants';
export { NOTIFICATION_CHANNELS, NOTIFICATION_CATEGORIES, EMAIL_TEMPLATE_IDS } from '../constants/notifications.constants';
export { JOB_TYPES, JOB_QUEUES } from '../constants/jobs.constants';
export { STORAGE_BUCKETS } from '../constants/storage.constants';
export { ENTERPRISE_FEATURE_FLAGS } from '../constants/feature-flags.constants';

export enum AuditActionEnum {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
  Suspend = 'suspend',
  Restore = 'restore',
  Assign = 'assign',
  Remove = 'remove',
}

export enum ActivityTypeEnum {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
  Suspend = 'suspend',
  Restore = 'restore',
  RoleChange = 'role_change',
  AvatarChange = 'avatar_change',
  PasswordChange = 'password_change',
  PasswordReset = 'password_reset',
  Invite = 'invite',
  Verification = 'verification',
}

export enum ErrorSeverityEnum {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Critical = 'critical',
}
