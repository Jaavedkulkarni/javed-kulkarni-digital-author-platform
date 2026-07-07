export interface PasswordSecurityStatus {
  temporaryPasswordActive: boolean;
  temporaryPasswordExpiresAt: string | null;
  forcePasswordChange: boolean;
  firstLoginRequired: boolean;
  passwordRotationDueAt: string | null;
  lastPasswordChange: string | null;
}

export interface EmailSecurityStatus {
  verified: boolean;
  verificationDate: string | null;
  pending: boolean;
}

export interface UserSessionInfo {
  id: string;
  browser: string;
  operatingSystem: string;
  device: string;
  ipAddress: string | null;
  country: string | null;
  lastActivity: string | null;
  current: boolean;
}

export interface MfaSecurityStatus {
  enabled: boolean;
  method: string | null;
  recoveryCodesStatus: 'none' | 'available' | 'depleted';
  required: boolean;
}

export interface AccountLockStatus {
  locked: boolean;
  failedAttempts: number;
  lastFailedLogin: string | null;
}

export interface UserInvitationInfo {
  id: string;
  email: string;
  status: string;
  sentDate: string;
  acceptedDate: string | null;
  expiresAt: string;
  role: string | null;
}

export interface AccountSecuritySnapshot {
  password: PasswordSecurityStatus;
  email: EmailSecurityStatus;
  sessions: UserSessionInfo[];
  mfa: MfaSecurityStatus;
  accountLock: AccountLockStatus;
  invitations: UserInvitationInfo[];
}

export interface GenerateTemporaryPasswordResult {
  temporaryPassword?: string;
}

export type ResetPasswordAction =
  | 'get_status'
  | 'reset_password'
  | 'generate_temporary_password'
  | 'force_password_change'
  | 'expire_temporary_password'
  | 'resend_verification'
  | 'mark_verified'
  | 'revoke_verification';

export type InvitationAction = 'list' | 'send' | 'resend' | 'cancel' | 'regenerate';
export type SessionAction = 'list' | 'revoke_session' | 'revoke_all';
export type MfaAction = 'get_status' | 'reset' | 'disable' | 'require';
export type UnlockAction = 'get_status' | 'unlock' | 'reset_failed_attempts';
