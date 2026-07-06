import type { AuthRole } from '../types/roles.types';
import type { AuthTokens, MockTokenPayload } from '../types/auth.types';

const ACCESS_TOKEN_TTL_MS = 60 * 60 * 1000;
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_REMEMBER_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function base64Encode(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function base64Decode(value: string): string {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodePayload(payload: MockTokenPayload): string {
  const json = JSON.stringify(payload);
  return `mock.${base64Encode(json)}.sig`;
}

function decodePayload(token: string): MockTokenPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'mock') return null;

  try {
    const json = base64Decode(parts[1]);
    return JSON.parse(json) as MockTokenPayload;
  } catch {
    return null;
  }
}

function createToken(
  userId: string,
  email: string,
  role: AuthRole,
  type: 'access' | 'refresh',
  ttlMs: number
): string {
  const now = Date.now();
  const payload: MockTokenPayload = {
    sub: userId,
    email,
    role,
    type,
    iat: now,
    exp: now + ttlMs,
  };

  return encodePayload(payload);
}

export function createAuthTokens(
  userId: string,
  email: string,
  role: AuthRole,
  rememberMe = false
): AuthTokens {
  const refreshTtl = rememberMe ? REFRESH_TOKEN_REMEMBER_TTL_MS : REFRESH_TOKEN_TTL_MS;
  const now = Date.now();

  return {
    accessToken: createToken(userId, email, role, 'access', ACCESS_TOKEN_TTL_MS),
    refreshToken: createToken(userId, email, role, 'refresh', refreshTtl),
    accessTokenExpiresAt: now + ACCESS_TOKEN_TTL_MS,
    refreshTokenExpiresAt: now + refreshTtl,
  };
}

export function parseToken(token: string): MockTokenPayload | null {
  return decodePayload(token);
}

export function isTokenExpired(payload: MockTokenPayload, skewMs = 30_000): boolean {
  return Date.now() >= payload.exp - skewMs;
}

export function isAccessTokenValid(accessToken: string): boolean {
  const payload = parseToken(accessToken);
  if (!payload || payload.type !== 'access') return false;
  return !isTokenExpired(payload);
}

export function isRefreshTokenValid(refreshToken: string): boolean {
  const payload = parseToken(refreshToken);
  if (!payload || payload.type !== 'refresh') return false;
  return !isTokenExpired(payload);
}

export function refreshTokensFromRefreshToken(
  refreshToken: string,
  rememberMe = false
): AuthTokens | null {
  const payload = parseToken(refreshToken);
  if (!payload || payload.type !== 'refresh' || isTokenExpired(payload)) {
    return null;
  }

  return createAuthTokens(payload.sub, payload.email, payload.role, rememberMe);
}

export function getAccessTokenTtlMs(): number {
  return ACCESS_TOKEN_TTL_MS;
}

export function shouldRefreshAccessToken(expiresAt: number, thresholdMs = 5 * 60 * 1000): boolean {
  return Date.now() >= expiresAt - thresholdMs;
}
