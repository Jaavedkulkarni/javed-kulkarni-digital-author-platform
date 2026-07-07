import {
  formatInvoiceNumber,
  nextInvoiceSequence,
  resetInvoiceSequenceStore,
} from '../stores/invoiceSequenceStore';

export function generateInvoiceNumber(referenceDate = new Date()): string {
  const year = referenceDate.getFullYear();
  const sequence = nextInvoiceSequence(year);
  return formatInvoiceNumber(year, sequence);
}

export function resetInvoiceSequence(): void {
  resetInvoiceSequenceStore();
}
