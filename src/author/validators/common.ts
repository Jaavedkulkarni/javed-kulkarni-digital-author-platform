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
  const errors = results.flatMap((r) => r.errors);
  return { valid: errors.length === 0, errors };
}

export function validateRequired(value: string | null | undefined, field: string): ValidationResult {
  if (!value?.trim()) return { valid: false, errors: [`${field} is required.`] };
  return validResult();
}
