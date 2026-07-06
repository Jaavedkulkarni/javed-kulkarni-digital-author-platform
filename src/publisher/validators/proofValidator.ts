import { invalidResult, validResult } from './common';

export function validateProofUpload(
  type: string,
  filename: string
): { valid: boolean; errors: string[] } {
  if (!['cover', 'interior', 'print_sample'].includes(type)) {
    return invalidResult(['Invalid proof type.']);
  }
  if (!filename.trim()) return invalidResult(['Filename is required.']);
  return validResult();
}
