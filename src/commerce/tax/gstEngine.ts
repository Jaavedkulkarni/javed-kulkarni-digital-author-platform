import type { GstCalculationInput, TaxBreakdown, GstResult } from '../types/tax.types';
import { calculateGst } from './gstCalculator';
import { roundMoney } from '../utils/money';

export type { GstResult };

export class GstEngine {
  calculate(input: GstCalculationInput): GstResult {
    const breakdown = calculateGst(input);
    return {
      baseAmount: breakdown.taxableAmount,
      gstAmount: breakdown.taxAmount,
      total: roundMoney(breakdown.taxableAmount + breakdown.taxAmount),
    };
  }

  calculateDetailed(input: GstCalculationInput): TaxBreakdown {
    return calculateGst(input);
  }
}

export function createGstEngine(): GstEngine {
  return new GstEngine();
}
