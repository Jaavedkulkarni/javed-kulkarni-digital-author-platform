import type { TaxRegion } from '../types/tax.types';

export const REGIONAL_TAX_RATES: Partial<Record<TaxRegion, number>> = {
  IN: 0.18,
  'IN-MH': 0.18,
  'IN-DL': 0.18,
  'IN-KA': 0.18,
  DEFAULT: 0.18,
};

export function getRegionalTaxRate(region: TaxRegion): number {
  return REGIONAL_TAX_RATES[region] ?? REGIONAL_TAX_RATES.DEFAULT ?? 0.18;
}
