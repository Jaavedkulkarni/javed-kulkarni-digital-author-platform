import type { CommerceCurrency } from '../types/common';

export interface CurrencyConversionQuote {
  from: CommerceCurrency;
  to: CommerceCurrency;
  rate: number;
  quotedAt: string;
}

const BASE_RATES_TO_INR: Record<CommerceCurrency, number> = {
  INR: 1,
  USD: 83.5,
  EUR: 90.2,
  GBP: 105.4,
};

export function convertCurrency(
  amount: number,
  from: CommerceCurrency,
  to: CommerceCurrency
): { amount: number; quote: CurrencyConversionQuote } {
  if (from === to) {
    return {
      amount,
      quote: { from, to, rate: 1, quotedAt: new Date().toISOString() },
    };
  }

  const inInr = amount * BASE_RATES_TO_INR[from];
  const converted = inInr / BASE_RATES_TO_INR[to];
  const rate = BASE_RATES_TO_INR[from] / BASE_RATES_TO_INR[to];

  return {
    amount: converted,
    quote: { from, to, rate, quotedAt: new Date().toISOString() },
  };
}

export function isSupportedCurrency(currency: string): currency is CommerceCurrency {
  return currency === 'INR' || currency === 'USD' || currency === 'EUR' || currency === 'GBP';
}
