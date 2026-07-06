import type { PublisherCompanyProfile } from '../types/company.types';

const profiles = new Map<string, PublisherCompanyProfile>();

export function getCompanyProfile(publisherId: string, companyName: string): PublisherCompanyProfile {
  const existing = profiles.get(publisherId);
  if (existing) return existing;
  const profile: PublisherCompanyProfile = {
    publisherId,
    companyName,
    legalName: companyName,
    gstin: null,
    pan: null,
    bank: null,
    upiId: null,
    address: {},
    printingCapacity: {
      maxBooksPerMonth: 5000,
      maxPagesPerDay: 50000,
      bindingTypes: ['Perfect Binding', 'Hardcover', 'Saddle Stitch'],
      coverTypes: ['300 GSM Art Paper', '250 GSM Matte'],
    },
    printingMachines: ['Heidelberg Speedmaster', 'Komori Lithrone'],
    specializations: ['Fiction', 'Academic', 'Children'],
    certificates: [],
    contactEmail: null,
    contactPhone: null,
    updatedAt: new Date().toISOString(),
  };
  profiles.set(publisherId, profile);
  return profile;
}

export function updateCompanyProfile(
  publisherId: string,
  updates: Partial<PublisherCompanyProfile>
): PublisherCompanyProfile | null {
  const existing = profiles.get(publisherId);
  if (!existing) return null;
  const updated: PublisherCompanyProfile = {
    ...existing,
    ...updates,
    printingCapacity: updates.printingCapacity
      ? { ...existing.printingCapacity, ...updates.printingCapacity }
      : existing.printingCapacity,
    updatedAt: new Date().toISOString(),
  };
  profiles.set(publisherId, updated);
  return updated;
}

export function resetCompanyProfileStore(): void {
  profiles.clear();
}
