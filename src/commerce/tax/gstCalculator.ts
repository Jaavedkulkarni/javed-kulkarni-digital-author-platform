import type { GstCalculationInput, TaxBreakdown, TaxRegion, GstComponent } from '../types/tax.types';
import { DEFAULT_GST_RATE, SELLER_STATE_CODE } from '../constants/commerce.constants';
import { roundMoney } from '../utils/money';

function normalizeStateCode(code: string): string {
  return code.trim().toUpperCase().slice(0, 2);
}

export function calculateGst(input: GstCalculationInput): TaxBreakdown {
  const rate = input.gstRate ?? DEFAULT_GST_RATE;
  const sellerState = normalizeStateCode(input.sellerStateCode || SELLER_STATE_CODE);
  const buyerState = normalizeStateCode(input.buyerStateCode || sellerState);
  const isInterState = sellerState !== buyerState;
  const taxAmount = roundMoney(input.taxableAmount * rate);

  const components: GstComponent[] = isInterState
    ? [{ label: 'IGST', rate, amount: taxAmount }]
    : [
        { label: 'CGST', rate: rate / 2, amount: roundMoney(taxAmount / 2) },
        { label: 'SGST', rate: rate / 2, amount: roundMoney(taxAmount / 2) },
      ];

  const region: TaxRegion = buyerState === 'MH' ? 'IN-MH' : buyerState === 'DL' ? 'IN-DL' : buyerState === 'KA' ? 'IN-KA' : 'IN';

  return {
    region,
    taxableAmount: input.taxableAmount,
    taxAmount,
    effectiveRate: rate,
    components,
    isInterState,
  };
}

export function resolveBuyerStateCode(addressState?: string | null): string {
  if (!addressState) return SELLER_STATE_CODE;
  const map: Record<string, string> = {
    maharashtra: 'MH',
    delhi: 'DL',
    karnataka: 'KA',
    gujarat: 'GJ',
    'tamil nadu': 'TN',
  };
  const key = addressState.trim().toLowerCase();
  return map[key] ?? addressState.slice(0, 2).toUpperCase();
}
