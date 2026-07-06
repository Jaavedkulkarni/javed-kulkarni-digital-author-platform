import type { KycTaxProfile, UpdateKycProfileInput } from '../types/kyc.types';
import { getKycProfile, saveKycProfile, submitKycForVerification } from '../stores/kycStore';
import { validateKycProfile } from '../validators/kycValidator';

export class KycTaxService {
  getProfile(authorId: string): KycTaxProfile {
    return getKycProfile(authorId);
  }

  updateProfile(authorId: string, input: UpdateKycProfileInput): { profile?: KycTaxProfile; errors?: string[] } {
    const validation = validateKycProfile(input);
    if (!validation.valid) return { errors: validation.errors };
    return { profile: saveKycProfile(authorId, input) };
  }

  submitForVerification(authorId: string): KycTaxProfile {
    return submitKycForVerification(authorId);
  }
}

export function createKycTaxService(): KycTaxService {
  return new KycTaxService();
}
