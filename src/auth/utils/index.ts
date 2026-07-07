export {
  normalizeEmail,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validateFullName,
  validateLoginForm,
  validateRegisterForm,
  validateResetPasswordForm,
  getPasswordStrengthHints,
} from './validation';
export type { ValidationResult } from './validation';

export {
  getDashboardPathForAuthRole,
  getLoginPathForAuthRole,
  getPostLoginPath,
  roleAllowsPath,
} from './roleRouting';

export { AUTH_ERRORS, getAuthErrorMessage } from './errors';
export type { AuthErrorCode } from './errors';

export { resolveAuthPostLoginPath } from './postAuthNavigation';
