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
  signInWithPassword,
  supabaseLogin,
  supabaseRegister,
  supabaseLogout,
  supabaseForgotPassword,
  supabaseResetPassword,
  supabaseVerifyEmail,
  supabaseResendVerificationEmail,
  supabaseRestoreSession,
  supabaseRefreshSession,
} from './supabaseAuthService';
export type {
  SupabaseRegisterOptions,
  SupabaseForgotPasswordOptions,
} from './supabaseAuthService';

export { authService } from './auth.service';

export {
  mapSupabaseUserToAuthUser,
  mapSupabaseSessionToAuthSession,
  mapSupabaseTokens,
  getRememberMePreference,
  setRememberMePreference,
} from './supabaseSessionMapper';

export type { AuthService } from './authService.interface';
