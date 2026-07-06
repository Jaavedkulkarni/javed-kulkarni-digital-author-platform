import type { CommerceCurrency } from '../types/common';

const CURRENCY_DECIMALS: Record<CommerceCurrency, number> = {
  INR: 2,
  USD: 2,
  EUR: 2,
  GBP: 2,
};

export function roundMoney(amount: number, currency: CommerceCurrency = 'INR'): number {
  const decimals = CURRENCY_DECIMALS[currency] ?? 2;
  const factor = 10 ** decimals;
  return Math.round(amount * factor) / factor;
}

export function sumMoney(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0);
}

export function formatMoney(amount: number, currency: CommerceCurrency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function isFreeAmount(amount: number): boolean {
  return amount <= 0;
}
