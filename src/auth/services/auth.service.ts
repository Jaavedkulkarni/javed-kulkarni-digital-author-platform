import type { AuthService } from './authService.interface';
import {
  signInWithPassword,
  supabaseForgotPassword,
  supabaseLogin,
  supabaseLogout,
  supabaseRefreshSession,
  supabaseRegister,
  supabaseResendVerificationEmail,
  supabaseResetPassword,
  supabaseRestoreSession,
  supabaseVerifyEmail,
} from './supabaseAuthService';

/** Single authentication service — all login entry points must use this. */
export const authService: AuthService & {
  signInWithPassword: typeof signInWithPassword;
} = {
  login: supabaseLogin,
  signInWithPassword,
  logout: supabaseLogout,
  register: supabaseRegister,
  forgotPassword: supabaseForgotPassword,
  resetPassword: supabaseResetPassword,
  verifyEmail: supabaseVerifyEmail,
  resendVerificationEmail: supabaseResendVerificationEmail,
  restoreSession: supabaseRestoreSession,
  refreshSession: supabaseRefreshSession,
};

export default authService;
