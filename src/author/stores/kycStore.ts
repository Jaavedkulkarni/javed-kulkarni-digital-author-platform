import type { KycTaxProfile } from '../types/kyc.types';

const profiles = new Map<string, KycTaxProfile>();

export function getKycProfile(authorId: string): KycTaxProfile {
  return (
    profiles.get(authorId) ?? {
      authorId,
      pan: null,
      gstin: null,
      legalName: null,
      bank: null,
      upi: null,
      verificationStatus: 'unverified',
      verifiedAt: null,
      rejectionReason: null,
      updatedAt: new Date().toISOString(),
    }
  );
}

export function saveKycProfile(authorId: string, patch: Partial<KycTaxProfile>): KycTaxProfile {
  const current = getKycProfile(authorId);
  const updated: KycTaxProfile = {
    ...current,
    ...patch,
    authorId,
    updatedAt: new Date().toISOString(),
  };
  profiles.set(authorId, updated);
  return updated;
}

export function submitKycForVerification(authorId: string): KycTaxProfile {
  return saveKycProfile(authorId, { verificationStatus: 'pending' });
}

export function resetKycStore(): void {
  profiles.clear();
}
