import { getBusinessPolicies, updatePolicy } from '../stores/businessStore';
import type { SuperAdminOperationResult } from '../types/common';

export class BusinessService {
  list() { return getBusinessPolicies(); }
  getByCategory(category: Parameters<typeof getBusinessPolicies>[0]) { return getBusinessPolicies(category); }
  updatePolicy(id: string, value: string): SuperAdminOperationResult {
    const r = updatePolicy(id, value);
    return r ? { success: true, data: r } : { success: false, errors: ['Not found'] };
  }
}

export function createBusinessService(): BusinessService {
  return new BusinessService();
}
