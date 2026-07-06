import type { PricingEngine } from '../pricing/pricingEngine';
import type { PriceBookInput, PricingBreakdown } from '../types/pricing.types';
import type { TaxBreakdown } from '../types/tax.types';
import { calculateGst, resolveBuyerStateCode } from '../tax/gstCalculator';
import { SELLER_STATE_CODE } from '../constants/commerce.constants';

export class PricingService {
  constructor(private readonly engine: PricingEngine) {}

  calculatePricing(input: PriceBookInput): PricingBreakdown {
    return this.engine.price(input);
  }

  calculateTax(taxableAmount: number, buyerState?: string | null): TaxBreakdown {
    const buyerStateCode = resolveBuyerStateCode(buyerState);
    return calculateGst({
      taxableAmount,
      sellerStateCode: SELLER_STATE_CODE,
      buyerStateCode,
    });
  }
}

export function createPricingService(engine: PricingEngine): PricingService {
  return new PricingService(engine);
}
