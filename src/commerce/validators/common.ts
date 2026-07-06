export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validResult(): ValidationResult {
  return { valid: true, errors: [] };
}

export function invalidResult(errors: string[]): ValidationResult {
  return { valid: false, errors };
}

export function mergeResults(...results: ValidationResult[]): ValidationResult {
  const errors = results.flatMap((result) => result.errors);
  return { valid: errors.length === 0, errors };
}

export function validateRequired(value: string | null | undefined, field: string): ValidationResult {
  if (!value || !value.trim()) return invalidResult([`${field} is required.`]);
  return validResult();
}

export function validateEmail(email: string | null | undefined): ValidationResult {
  if (!email) return invalidResult(['Email is required.']);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return invalidResult(['A valid email is required.']);
  }
  return validResult();
}

export function validatePositiveNumber(value: number, field: string): ValidationResult {
  if (value < 0) return invalidResult([`${field} cannot be negative.`]);
  return validResult();
}
