import { supabase } from '../../lib/supabase';
import type {
  AuthResult,
  AuthSession,
  ForgotPasswordData,
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
  VerifyEmailData,
} from '../types/auth.types';
import { AUTH_ERRORS } from '../utils/errors';
import {
  normalizeEmail,
  validateEmail,
  validateLoginForm,
  validateRegisterForm,
  validateResetPasswordForm,
} from '../utils/validation';
import {
  getRememberMePreference,
  mapSupabaseSessionToAuthSession,
  setRememberMePreference,
} from './supabaseSessionMapper';

const SITE_URL = typeof window !== 'undefined' ? window.location.origin : '';

export interface SupabaseRegisterOptions {
  emailRedirectTo?: string;
  userMetadata?: Record<string, string | undefined>;
}

export interface SupabaseForgotPasswordOptions {
  redirectTo?: string;
}

function mapSupabaseAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('invalid login credentials') || lower.includes('invalid email or password')) {
    return AUTH_ERRORS.INVALID_CREDENTIALS;
  }
  if (lower.includes('email not confirmed') || lower.includes('email not verified')) {
    return AUTH_ERRORS.EMAIL_NOT_VERIFIED;
  }
  if (lower.includes('user already registered') || lower.includes('already been registered')) {
    return AUTH_ERRORS.EMAIL_EXISTS;
  }
  if (lower.includes('session') && lower.includes('expired')) {
    return AUTH_ERRORS.SESSION_EXPIRED;
  }
  if (lower.includes('otp') || lower.includes('token') || lower.includes('link')) {
    return AUTH_ERRORS.INVALID_TOKEN;
  }

  return message || AUTH_ERRORS.GENERIC_FAILURE;
}

/** Primary email/password sign-in — used by all login entry points. */
export async function signInWithPassword(credentials: LoginCredentials): Promise<AuthResult<AuthSession>> {
  return supabaseLogin(credentials);
}

export async function supabaseLogin(credentials: LoginCredentials): Promise<AuthResult<AuthSession>> {
  const validation = validateLoginForm(credentials.email, credentials.password);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const rememberMe = credentials.rememberMe ?? false;
  setRememberMePreference(rememberMe);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizeEmail(credentials.email),
      password: credentials.password,
    });

    if (error) {
      const mapped = mapSupabaseAuthError(error.message);
      if (mapped === AUTH_ERRORS.EMAIL_NOT_VERIFIED) {
        return { success: false, error: mapped, needsVerification: true };
      }
      return { success: false, error: mapped };
    }

    if (!data.session) {
      return { success: false, error: AUTH_ERRORS.GENERIC_FAILURE };
    }

    if (!data.user.email_confirmed_at) {
      await supabase.auth.signOut();
      return {
        success: false,
        error: AUTH_ERRORS.EMAIL_NOT_VERIFIED,
        needsVerification: true,
      };
    }

    return {
      success: true,
      data: mapSupabaseSessionToAuthSession(data.session, rememberMe),
    };
  } catch {
    return { success: false, error: AUTH_ERRORS.NETWORK_ERROR };
  }
}

export async function supabaseRegister(
  data: RegisterData,
  options?: SupabaseRegisterOptions,
): Promise<AuthResult<AuthSession>> {
  const validation = validateRegisterForm(data.email, data.password, data.confirmPassword, data.fullName);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const email = normalizeEmail(data.email);

  try {
    const { data: result, error } = await supabase.auth.signUp({
      email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName.trim(),
          display_name: data.fullName.trim(),
          ...options?.userMetadata,
        },
        emailRedirectTo: options?.emailRedirectTo ?? `${SITE_URL}/auth/verify-email`,
      },
    });

    if (error) {
      return { success: false, error: mapSupabaseAuthError(error.message) };
    }

    const needsVerification = !result.session || !result.user.email_confirmed_at;

    if (result.session && result.user.email_confirmed_at) {
      return {
        success: true,
        needsVerification: false,
        data: mapSupabaseSessionToAuthSession(result.session),
      };
    }

    return {
      success: true,
      needsVerification,
    };
  } catch {
    return { success: false, error: AUTH_ERRORS.NETWORK_ERROR };
  }
}

export async function supabaseLogout(): Promise<void> {
  await supabase.auth.signOut();
  setRememberMePreference(false);
}

export async function supabaseForgotPassword(
  data: ForgotPasswordData,
  options?: SupabaseForgotPasswordOptions,
): Promise<AuthResult> {
  const validation = validateEmail(data.email);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(normalizeEmail(data.email), {
      redirectTo: options?.redirectTo ?? `${SITE_URL}/auth/reset-password`,
    });

    if (error) {
      return { success: false, error: mapSupabaseAuthError(error.message) };
    }

    return { success: true };
  } catch {
    return { success: false, error: AUTH_ERRORS.NETWORK_ERROR };
  }
}

export async function supabaseResetPassword(data: ResetPasswordData): Promise<AuthResult> {
  const validation = validateResetPasswordForm(data.password, data.confirmPassword);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    let session = (await supabase.auth.getSession()).data.session;

    if (!session && data.token && data.token !== 'recovery') {
      const otpResult = await supabase.auth.verifyOtp({
        token_hash: data.token,
        type: 'recovery',
      });
      if (otpResult.error) {
        return { success: false, error: mapSupabaseAuthError(otpResult.error.message) };
      }
      session = otpResult.data.session ?? null;
    }

    if (!session) {
      session = (await supabase.auth.getSession()).data.session;
    }

    if (!session) {
      return { success: false, error: AUTH_ERRORS.INVALID_TOKEN };
    }

    const { error } = await supabase.auth.updateUser({ password: data.password });
    if (error) {
      return { success: false, error: mapSupabaseAuthError(error.message) };
    }

    return { success: true };
  } catch {
    return { success: false, error: AUTH_ERRORS.NETWORK_ERROR };
  }
}

export async function supabaseVerifyEmail(data: VerifyEmailData): Promise<AuthResult<AuthSession>> {
  try {
    if (data.token) {
      const { data: result, error } = await supabase.auth.verifyOtp({
        token_hash: data.token,
        type: 'email',
      });

      if (error) {
        return { success: false, error: mapSupabaseAuthError(error.message) };
      }

      if (result.session) {
        return {
          success: true,
          data: mapSupabaseSessionToAuthSession(result.session),
        };
      }
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;

    if (session?.user.email_confirmed_at) {
      return {
        success: true,
        data: mapSupabaseSessionToAuthSession(session),
      };
    }

    return { success: false, error: AUTH_ERRORS.INVALID_TOKEN };
  } catch {
    return { success: false, error: AUTH_ERRORS.NETWORK_ERROR };
  }
}

export async function supabaseResendVerificationEmail(email: string): Promise<AuthResult> {
  const validation = validateEmail(email);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: normalizeEmail(email),
      options: { emailRedirectTo: `${SITE_URL}/auth/verify-email` },
    });

    if (error) {
      return { success: false, error: mapSupabaseAuthError(error.message) };
    }

    return { success: true };
  } catch {
    return { success: false, error: AUTH_ERRORS.NETWORK_ERROR };
  }
}

export async function supabaseRestoreSession(): Promise<AuthResult<AuthSession>> {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return { success: false, error: mapSupabaseAuthError(error.message) };
    }

    if (!data.session) {
      return { success: false, error: AUTH_ERRORS.SESSION_EXPIRED };
    }

    return {
      success: true,
      data: mapSupabaseSessionToAuthSession(data.session, getRememberMePreference()),
    };
  } catch {
    return { success: false, error: AUTH_ERRORS.NETWORK_ERROR };
  }
}

export async function supabaseRefreshSession(): Promise<AuthResult<AuthSession>> {
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error || !data.session) {
      return { success: false, error: AUTH_ERRORS.REFRESH_FAILED };
    }

    return {
      success: true,
      data: mapSupabaseSessionToAuthSession(data.session, getRememberMePreference()),
    };
  } catch {
    return { success: false, error: AUTH_ERRORS.REFRESH_FAILED };
  }
}
