export type CommerceCurrency = 'INR' | 'USD' | 'EUR' | 'GBP';

export type PricingModel = 'free' | 'paid' | 'membership';

export interface MoneyAmount {
  amount: number;
  currency: CommerceCurrency;
}

export interface CommerceAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface CommerceBuyerDetails {
  userId: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  billingAddress?: CommerceAddress;
}

export interface CommerceSellerDetails {
  legalName: string;
  tradeName: string;
  gstin: string;
  address: CommerceAddress;
  email: string;
  phone: string;
}

export interface CommerceOperationResult<T = void> {
  success: boolean;
  data?: T;
  errors?: string[];
}
