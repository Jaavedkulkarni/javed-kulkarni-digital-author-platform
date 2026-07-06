export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password.',
  EMAIL_EXISTS: 'An account with this email already exists.',
  EMAIL_NOT_FOUND: 'If an account exists for this email, instructions have been sent.',
  EMAIL_NOT_VERIFIED: 'Please verify your email before signing in.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  INVALID_TOKEN: 'This link is invalid or has expired.',
  REFRESH_FAILED: 'Unable to refresh your session. Please sign in again.',
  NETWORK_ERROR: 'Something went wrong. Please try again.',
  UNAUTHORIZED: 'You are not authorized to access this page.',
  ROLE_REQUIRED: 'You do not have permission to access this area.',
  USER_NOT_FOUND: 'Account not found.',
  GENERIC_FAILURE: 'Authentication failed. Please try again.',
} as const;

export type AuthErrorCode = keyof typeof AUTH_ERRORS;

export function getAuthErrorMessage(code: AuthErrorCode): string {
  return AUTH_ERRORS[code];
}
