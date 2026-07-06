export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

export interface PrintingCapacity {
  maxBooksPerMonth: number;
  maxPagesPerDay: number;
  bindingTypes: string[];
  coverTypes: string[];
}

export interface PublisherCompanyProfile {
  publisherId: string;
  companyName: string;
  legalName: string | null;
  gstin: string | null;
  pan: string | null;
  bank: BankDetails | null;
  upiId: string | null;
  address: {
    line1?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  printingCapacity: PrintingCapacity;
  printingMachines: string[];
  specializations: string[];
  certificates: string[];
  contactEmail: string | null;
  contactPhone: string | null;
  updatedAt: string;
}

export interface UpdateCompanyProfileInput {
  legalName?: string | null;
  gstin?: string | null;
  pan?: string | null;
  bank?: BankDetails | null;
  upiId?: string | null;
  address?: PublisherCompanyProfile['address'];
  printingCapacity?: Partial<PrintingCapacity>;
  printingMachines?: string[];
  specializations?: string[];
  certificates?: string[];
  contactEmail?: string | null;
  contactPhone?: string | null;
}
