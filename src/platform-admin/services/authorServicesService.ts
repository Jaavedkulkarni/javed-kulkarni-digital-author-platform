import { getAuthorServiceRequests, assignServiceRequest } from '../stores/authorServicesStore';
import type { PlatformAdminOperationResult } from '../types/common';

export class AuthorServicesService {
  getQueue() { return getAuthorServiceRequests(); }

  assign(id: string): PlatformAdminOperationResult {
    const r = assignServiceRequest(id);
    return r ? { success: true, data: r } : { success: false, errors: ['Cannot assign request.'] };
  }
}

export function createAuthorServicesService(): AuthorServicesService {
  return new AuthorServicesService();
}
