import type {
  AuthResult,
  AuthSession,
  ForgotPasswordData,
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
  VerifyEmailData,
} from '../types/auth.types';

export interface AuthService {
  login(credentials: LoginCredentials): Promise<AuthResult<AuthSession>>;
  logout(): Promise<void>;
  register(data: RegisterData): Promise<AuthResult>;
  forgotPassword(data: ForgotPasswordData): Promise<AuthResult>;
  resetPassword(data: ResetPasswordData): Promise<AuthResult>;
  verifyEmail(data: VerifyEmailData): Promise<AuthResult<AuthSession>>;
  resendVerificationEmail(email: string): Promise<AuthResult>;
  restoreSession(): Promise<AuthResult<AuthSession>>;
  refreshSession(): Promise<AuthResult<AuthSession>>;
}
