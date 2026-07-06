export interface ValidationResult { valid: boolean; errors: string[] }
export function validResult(): ValidationResult { return { valid: true, errors: [] }; }
export function invalidResult(errors: string[]): ValidationResult { return { valid: false, errors }; }
