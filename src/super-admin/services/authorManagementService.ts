import { getAuthors, updateAuthorVerification, suspendAuthor, restoreAuthor } from '../stores/authorStore';
import type { AuthorVerificationStatus } from '../types/author.types';
import type { SuperAdminOperationResult } from '../types/common';

export class AuthorManagementService {
  list() { return getAuthors(); }
  getPremium() { return getAuthors().filter((a) => a.verificationStatus === 'premium'); }
  setVerification(id: string, status: AuthorVerificationStatus): SuperAdminOperationResult {
    const r = updateAuthorVerification(id, status);
    return r ? { success: true, data: r } : { success: false, errors: ['Not found'] };
  }
  suspend(id: string): SuperAdminOperationResult { const r = suspendAuthor(id); return r ? { success: true, data: r } : { success: false, errors: ['Not found'] }; }
  restore(id: string): SuperAdminOperationResult { const r = restoreAuthor(id); return r ? { success: true, data: r } : { success: false, errors: ['Not found'] }; }
}

export function createAuthorManagementService(): AuthorManagementService {
  return new AuthorManagementService();
}
