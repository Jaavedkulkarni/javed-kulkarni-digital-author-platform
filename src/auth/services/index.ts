export {
  createAuthTokens,
  parseToken,
  isTokenExpired,
  isAccessTokenValid,
  isRefreshTokenValid,
  refreshTokensFromRefreshToken,
  getAccessTokenTtlMs,
  shouldRefreshAccessToken,
} from './tokenService';

export {
  saveAuthSession,
  loadAuthSession,
  clearAuthSession,
  storeAuthReturnTo,
  consumeAuthReturnTo,
  peekAuthReturnTo,
} from './sessionStorage';

export {
  findMockUserByEmail,
  findMockUserById,
  createMockUser,
  updateMockUserPassword,
  verifyMockUserEmail,
  toAuthUser,
  getMockUsersForDev,
} from './mockUsers';
export type { MockUserRecord } from './mockUsers';

export {
  mockLogin,
  mockRegister,
  mockForgotPassword,
  mockResetPassword,
  mockVerifyEmail,
  mockResendVerificationEmail,
  mockRestoreSession,
  mockRefreshSession,
  mockLogout,
  getPendingVerificationTokenForEmail,
  getPendingResetTokenForDev,
} from './mockAuthService';

export type { AuthService } from './authService.interface';
