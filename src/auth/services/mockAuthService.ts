import type {
  AuthResult,
  AuthSession,
  ForgotPasswordData,
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
  VerifyEmailData,
} from '../types/auth.types';
import type { PendingResetRecord, PendingVerificationRecord } from '../types/auth.types';
import { DEFAULT_AUTH_ROLE } from '../types/roles.types';
import {
  normalizeEmail,
  validateLoginForm,
  validateRegisterForm,
  validateResetPasswordForm,
  validateEmail,
} from '../utils/validation';
import { AUTH_ERRORS } from '../utils/errors';
import { createAuthTokens, isAccessTokenValid, isRefreshTokenValid, refreshTokensFromRefreshToken } from './tokenService';
import { clearAuthSession, loadAuthSession, saveAuthSession } from './sessionStorage';
import {
  createMockUser,
  findMockUserByEmail,
  findMockUserById,
  toAuthUser,
  updateMockUserPassword,
  verifyMockUserEmail,
} from './mockUsers';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;
const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const MOCK_LATENCY_MS = 350;

const pendingResets = new Map<string, PendingResetRecord>();
const pendingVerifications = new Map<string, PendingVerificationRecord>();

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), MOCK_LATENCY_MS);
  });
}

function generateToken(): string {
  return `tok_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

function buildSession(userId: string, rememberMe: boolean): AuthSession | null {
  const record = findMockUserById(userId);
  if (!record) return null;

  const tokens = createAuthTokens(record.id, record.email, record.role, rememberMe);

  return {
    user: toAuthUser(record),
    tokens,
    rememberMe,
    lastRefreshedAt: Date.now(),
  };
}

function persistSession(session: AuthSession): void {
  saveAuthSession({
    user: session.user,
    tokens: session.tokens,
    rememberMe: session.rememberMe,
    lastRefreshedAt: session.lastRefreshedAt,
  });
}

export async function mockLogin(credentials: LoginCredentials): Promise<AuthResult<AuthSession>> {
  const validation = validateLoginForm(credentials.email, credentials.password);
  if (!validation.valid) {
    return delay({ success: false, error: validation.error });
  }

  const email = normalizeEmail(credentials.email);
  const user = findMockUserByEmail(email);

  if (!user || user.password !== credentials.password) {
    return delay({ success: false, error: AUTH_ERRORS.INVALID_CREDENTIALS });
  }

  if (!user.emailVerified) {
    return delay({ success: false, error: AUTH_ERRORS.EMAIL_NOT_VERIFIED, needsVerification: true });
  }

  const rememberMe = credentials.rememberMe ?? false;
  const session = buildSession(user.id, rememberMe);

  if (!session) {
    return delay({ success: false, error: AUTH_ERRORS.GENERIC_FAILURE });
  }

  persistSession(session);
  return delay({ success: true, data: session });
}

export async function mockRegister(data: RegisterData): Promise<AuthResult<AuthSession>> {
  const validation = validateRegisterForm(data.email, data.password, data.confirmPassword, data.fullName);
  if (!validation.valid) {
    return delay({ success: false, error: validation.error });
  }

  const email = normalizeEmail(data.email);

  if (findMockUserByEmail(email)) {
    return delay({ success: false, error: AUTH_ERRORS.EMAIL_EXISTS });
  }

  try {
    const record = createMockUser(email, data.password, data.fullName, data.role ?? DEFAULT_AUTH_ROLE);
    const token = generateToken();

    pendingVerifications.set(token, {
      email: record.email,
      token,
      expiresAt: Date.now() + VERIFICATION_TOKEN_TTL_MS,
    });

    return delay({
      success: true,
      needsVerification: true,
      data: undefined,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'EMAIL_EXISTS') {
      return delay({ success: false, error: AUTH_ERRORS.EMAIL_EXISTS });
    }

    return delay({ success: false, error: AUTH_ERRORS.GENERIC_FAILURE });
  }
}

export async function mockForgotPassword(data: ForgotPasswordData): Promise<AuthResult> {
  const validation = validateEmail(data.email);
  if (!validation.valid) {
    return delay({ success: false, error: validation.error });
  }

  const email = normalizeEmail(data.email);
  const user = findMockUserByEmail(email);

  if (user) {
    const token = generateToken();
    pendingResets.set(token, {
      email,
      token,
      expiresAt: Date.now() + RESET_TOKEN_TTL_MS,
    });
  }

  return delay({ success: true });
}

export async function mockResetPassword(data: ResetPasswordData): Promise<AuthResult> {
  const validation = validateResetPasswordForm(data.password, data.confirmPassword);
  if (!validation.valid) {
    return delay({ success: false, error: validation.error });
  }

  const record = pendingResets.get(data.token);
  if (!record || record.expiresAt < Date.now()) {
    pendingResets.delete(data.token);
    return delay({ success: false, error: AUTH_ERRORS.INVALID_TOKEN });
  }

  const updated = updateMockUserPassword(record.email, data.password);
  pendingResets.delete(data.token);

  if (!updated) {
    return delay({ success: false, error: AUTH_ERRORS.USER_NOT_FOUND });
  }

  return delay({ success: true });
}

export async function mockVerifyEmail(data: VerifyEmailData): Promise<AuthResult<AuthSession>> {
  const record = pendingVerifications.get(data.token);
  if (!record || record.expiresAt < Date.now()) {
    pendingVerifications.delete(data.token);
    return delay({ success: false, error: AUTH_ERRORS.INVALID_TOKEN });
  }

  const verified = verifyMockUserEmail(record.email);
  pendingVerifications.delete(data.token);

  if (!verified) {
    return delay({ success: false, error: AUTH_ERRORS.USER_NOT_FOUND });
  }

  const user = findMockUserByEmail(record.email);
  if (!user) {
    return delay({ success: false, error: AUTH_ERRORS.USER_NOT_FOUND });
  }

  const session = buildSession(user.id, false);
  if (!session) {
    return delay({ success: false, error: AUTH_ERRORS.GENERIC_FAILURE });
  }

  persistSession(session);
  return delay({ success: true, data: session });
}

export async function mockResendVerificationEmail(email: string): Promise<AuthResult> {
  const validation = validateEmail(email);
  if (!validation.valid) {
    return delay({ success: false, error: validation.error });
  }

  const normalized = normalizeEmail(email);
  const user = findMockUserByEmail(normalized);

  if (!user) {
    return delay({ success: true });
  }

  if (user.emailVerified) {
    return delay({ success: true });
  }

  const token = generateToken();
  pendingVerifications.set(token, {
    email: normalized,
    token,
    expiresAt: Date.now() + VERIFICATION_TOKEN_TTL_MS,
  });

  return delay({ success: true });
}

export async function mockRestoreSession(): Promise<AuthResult<AuthSession>> {
  const stored = loadAuthSession();
  if (!stored) {
    return { success: false, error: AUTH_ERRORS.SESSION_EXPIRED };
  }

  if (isAccessTokenValid(stored.tokens.accessToken)) {
    const session: AuthSession = {
      user: stored.user,
      tokens: stored.tokens,
      rememberMe: stored.rememberMe,
      lastRefreshedAt: stored.lastRefreshedAt,
    };

    return { success: true, data: session };
  }

  if (!isRefreshTokenValid(stored.tokens.refreshToken)) {
    clearAuthSession();
    return { success: false, error: AUTH_ERRORS.SESSION_EXPIRED };
  }

  return mockRefreshSession(stored);
}

export async function mockRefreshSession(stored = loadAuthSession()): Promise<AuthResult<AuthSession>> {
  if (!stored) {
    return { success: false, error: AUTH_ERRORS.REFRESH_FAILED };
  }

  const refreshedTokens = refreshTokensFromRefreshToken(stored.tokens.refreshToken, stored.rememberMe);
  if (!refreshedTokens) {
    clearAuthSession();
    return { success: false, error: AUTH_ERRORS.REFRESH_FAILED };
  }

  const user = findMockUserById(stored.user.id);
  if (!user) {
    clearAuthSession();
    return { success: false, error: AUTH_ERRORS.USER_NOT_FOUND };
  }

  const session: AuthSession = {
    user: toAuthUser(user),
    tokens: refreshedTokens,
    rememberMe: stored.rememberMe,
    lastRefreshedAt: Date.now(),
  };

  persistSession(session);
  return delay({ success: true, data: session });
}

export async function mockLogout(): Promise<void> {
  clearAuthSession();
  await delay(undefined);
}

export function getPendingVerificationTokenForEmail(email: string): string | null {
  const normalized = normalizeEmail(email);
  for (const [token, record] of pendingVerifications.entries()) {
    if (record.email === normalized && record.expiresAt >= Date.now()) {
      return token;
    }
  }
  return null;
}

export function getPendingResetTokenForDev(): string | null {
  const first = pendingResets.entries().next();
  if (first.done) return null;
  const [, record] = first.value;
  if (record.expiresAt < Date.now()) return null;
  return record.token;
}
