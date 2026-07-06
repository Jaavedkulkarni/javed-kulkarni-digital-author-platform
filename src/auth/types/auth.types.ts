import type { AuthRole } from './roles.types';

export interface AuthUser {
  id: string;
  email: string;
  role: AuthRole;
  fullName: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;
}

export interface AuthSession {
  user: AuthUser;
  tokens: AuthTokens;
  rememberMe: boolean;
  lastRefreshedAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  role?: AuthRole;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailData {
  token: string;
}

export interface AuthResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  needsVerification?: boolean;
}

export interface MockTokenPayload {
  sub: string;
  email: string;
  role: AuthRole;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
}

export interface StoredAuthSession {
  user: AuthUser;
  tokens: AuthTokens;
  rememberMe: boolean;
  lastRefreshedAt: number;
}

export interface PendingResetRecord {
  email: string;
  token: string;
  expiresAt: number;
}

export interface PendingVerificationRecord {
  email: string;
  token: string;
  expiresAt: number;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  session: AuthSession | null;
  error: string | null;
  pendingVerificationEmail: string | null;
  isInitialized: boolean;
}

export type AuthAction =
  | { type: 'AUTH_INITIALIZE_START' }
  | { type: 'AUTH_INITIALIZE_SUCCESS'; payload: AuthSession | null }
  | { type: 'AUTH_INITIALIZE_FAILURE'; payload?: string }
  | { type: 'AUTH_LOGIN_START' }
  | { type: 'AUTH_LOGIN_SUCCESS'; payload: AuthSession }
  | { type: 'AUTH_LOGIN_FAILURE'; payload: string }
  | { type: 'AUTH_REGISTER_START' }
  | { type: 'AUTH_REGISTER_SUCCESS'; payload: { session: AuthSession | null; needsVerification: boolean; email: string } }
  | { type: 'AUTH_REGISTER_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_REFRESH_SUCCESS'; payload: AuthSession }
  | { type: 'AUTH_SESSION_EXPIRED' }
  | { type: 'AUTH_CLEAR_ERROR' }
  | { type: 'AUTH_SET_PENDING_VERIFICATION'; payload: string | null };

export interface AuthContextValue {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<AuthResult<AuthSession>>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<AuthResult>;
  forgotPassword: (data: ForgotPasswordData) => Promise<AuthResult>;
  resetPassword: (data: ResetPasswordData) => Promise<AuthResult>;
  verifyEmail: (data: VerifyEmailData) => Promise<AuthResult<AuthSession>>;
  resendVerificationEmail: (email: string) => Promise<AuthResult>;
  refreshSession: () => Promise<AuthResult<AuthSession>>;
  restoreSession: () => Promise<AuthResult<AuthSession>>;
  clearError: () => void;
}
