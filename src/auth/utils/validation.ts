export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_RULES = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
} as const;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateEmail(email: string): ValidationResult {
  const normalized = normalizeEmail(email);

  if (!normalized) {
    return { valid: false, error: 'Email is required.' };
  }

  if (!EMAIL_PATTERN.test(normalized)) {
    return { valid: false, error: 'Enter a valid email address.' };
  }

  return { valid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { valid: false, error: 'Password is required.' };
  }

  if (password.length < PASSWORD_RULES.minLength) {
    return { valid: false, error: `Password must be at least ${PASSWORD_RULES.minLength} characters.` };
  }

  if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must include at least one uppercase letter.' };
  }

  if (PASSWORD_RULES.requireLowercase && !/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must include at least one lowercase letter.' };
  }

  if (PASSWORD_RULES.requireNumber && !/\d/.test(password)) {
    return { valid: false, error: 'Password must include at least one number.' };
  }

  return { valid: true };
}

export function validatePasswordConfirmation(password: string, confirmPassword: string): ValidationResult {
  if (!confirmPassword) {
    return { valid: false, error: 'Please confirm your password.' };
  }

  if (password !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match.' };
  }

  return { valid: true };
}

export function validateFullName(fullName: string): ValidationResult {
  const trimmed = fullName.trim();

  if (!trimmed) {
    return { valid: false, error: 'Full name is required.' };
  }

  if (trimmed.length < 2) {
    return { valid: false, error: 'Full name must be at least 2 characters.' };
  }

  return { valid: true };
}

export function validateLoginForm(email: string, password: string): ValidationResult {
  const emailResult = validateEmail(email);
  if (!emailResult.valid) return emailResult;

  if (!password) {
    return { valid: false, error: 'Password is required.' };
  }

  return { valid: true };
}

export function validateRegisterForm(
  email: string,
  password: string,
  confirmPassword: string,
  fullName: string
): ValidationResult {
  const nameResult = validateFullName(fullName);
  if (!nameResult.valid) return nameResult;

  const emailResult = validateEmail(email);
  if (!emailResult.valid) return emailResult;

  const passwordResult = validatePassword(password);
  if (!passwordResult.valid) return passwordResult;

  return validatePasswordConfirmation(password, confirmPassword);
}

export function validateResetPasswordForm(
  password: string,
  confirmPassword: string
): ValidationResult {
  const passwordResult = validatePassword(password);
  if (!passwordResult.valid) return passwordResult;

  return validatePasswordConfirmation(password, confirmPassword);
}

export function getPasswordStrengthHints(): string[] {
  return [
    `At least ${PASSWORD_RULES.minLength} characters`,
    'One uppercase letter',
    'One lowercase letter',
    'One number',
  ];
}
