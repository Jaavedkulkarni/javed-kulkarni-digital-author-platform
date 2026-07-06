import type { PrintSpecifications } from '../types/rfq.types';

export const SAMPLE_SPECS: PrintSpecifications = {
  trimSize: '5.5 x 8.5 in',
  pageCount: 280,
  paperType: 'Cream Offset',
  paperGsm: 80,
  bindingType: 'Perfect Binding',
  lamination: 'Matte',
  coverType: '300 GSM Art Paper',
  printColor: 'Full Color',
};

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function isToday(dateIso: string): boolean {
  return dateIso.slice(0, 10) === todayIso();
}
