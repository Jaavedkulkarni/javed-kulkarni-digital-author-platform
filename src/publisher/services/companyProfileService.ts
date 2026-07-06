import { getCompanyProfile, updateCompanyProfile } from '../stores/companyProfileStore';
import type { PublisherCompanyProfile, UpdateCompanyProfileInput } from '../types/company.types';
import type { PublisherOperationResult } from '../types/common';
import { validateCompanyProfileUpdate } from '../validators/companyValidator';

export class CompanyProfileService {
  get(publisherId: string, companyName: string): PublisherCompanyProfile {
    return getCompanyProfile(publisherId, companyName);
  }

  update(
    publisherId: string,
    input: UpdateCompanyProfileInput
  ): PublisherOperationResult<PublisherCompanyProfile> {
    const validation = validateCompanyProfileUpdate(input);
    if (!validation.valid) return { success: false, errors: validation.errors };
    const updated = updateCompanyProfile(publisherId, input);
    if (!updated) return { success: false, errors: ['Company profile not found.'] };
    return { success: true, data: updated };
  }
}

export function createCompanyProfileService(): CompanyProfileService {
  return new CompanyProfileService();
}
