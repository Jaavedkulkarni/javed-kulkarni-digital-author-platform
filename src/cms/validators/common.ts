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

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISBN_PATTERN = /^(?:\d{9}[\dX]|\d{13})$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRequired(value: string | null | undefined, field: string): ValidationResult {
  if (!value || !value.trim()) {
    return invalidResult([`${field} is required.`]);
  }
  return validResult();
}

export function validateSlug(slug: string): ValidationResult {
  if (!slug.trim()) return invalidResult(['Slug is required.']);
  if (!SLUG_PATTERN.test(slug)) {
    return invalidResult(['Slug must contain only lowercase letters, numbers, and hyphens.']);
  }
  return validResult();
}

export function validateIsbn(isbn: string | null | undefined): ValidationResult {
  if (!isbn) return validResult();
  const normalized = isbn.replace(/[-\s]/g, '');
  if (!ISBN_PATTERN.test(normalized)) {
    return invalidResult(['ISBN must be a valid 10 or 13 digit ISBN.']);
  }
  return validResult();
}

export function validateEmail(email: string | null | undefined): ValidationResult {
  if (!email) return validResult();
  if (!EMAIL_PATTERN.test(email.trim())) {
    return invalidResult(['Contact email must be valid.']);
  }
  return validResult();
}

export function validateLanguageCode(code: string | null | undefined): ValidationResult {
  if (!code) return validResult();
  if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(code)) {
    return invalidResult(['Language code must be ISO 639-1 format (e.g. mr, en, hi).']);
  }
  return validResult();
}

export function validatePositiveNumber(value: number | null | undefined, field: string): ValidationResult {
  if (value === null || value === undefined) return validResult();
  if (value < 0) return invalidResult([`${field} cannot be negative.`]);
  return validResult();
}
