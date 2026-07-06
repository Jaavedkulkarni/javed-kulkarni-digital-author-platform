export type TaxRegion = 'IN' | 'IN-MH' | 'IN-DL' | 'IN-KA' | 'DEFAULT';

export interface GstComponent {
  label: 'CGST' | 'SGST' | 'IGST' | 'GST';
  rate: number;
  amount: number;
}

export interface TaxBreakdown {
  region: TaxRegion;
  taxableAmount: number;
  taxAmount: number;
  effectiveRate: number;
  components: GstComponent[];
  isInterState: boolean;
}

export interface GstCalculationInput {
  taxableAmount: number;
  sellerStateCode: string;
  buyerStateCode: string;
  gstRate?: number;
}
