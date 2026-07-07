import type { PricingEngine } from '../pricing/pricingEngine';
import type { GstEngine } from '../tax/gstEngine';
import type { PriceBookInput, PricingBreakdown } from '../types/pricing.types';
import type { GstResult, TaxBreakdown } from '../types/tax.types';
import { resolveBuyerStateCode } from '../tax/gstCalculator';
import { SELLER_STATE_CODE } from '../constants/commerce.constants';

export class PricingService {
  constructor(
    private readonly engine: PricingEngine,
    private readonly gstEngine: GstEngine
  ) {}

  calculatePricing(input: PriceBookInput): PricingBreakdown {
    return this.engine.price(input);
  }

  calculateTax(taxableAmount: number, buyerState?: string | null): TaxBreakdown {
    const buyerStateCode = resolveBuyerStateCode(buyerState);
    return this.gstEngine.calculateDetailed({
      taxableAmount,
      sellerStateCode: SELLER_STATE_CODE,
      buyerStateCode,
    });
  }

  calculateGst(taxableAmount: number, buyerState?: string | null): GstResult {
    const buyerStateCode = resolveBuyerStateCode(buyerState);
    return this.gstEngine.calculate({
      taxableAmount,
      sellerStateCode: SELLER_STATE_CODE,
      buyerStateCode,
    });
  }
}

export function createPricingService(engine: PricingEngine, gstEngine: GstEngine): PricingService {
  return new PricingService(engine, gstEngine);
}
