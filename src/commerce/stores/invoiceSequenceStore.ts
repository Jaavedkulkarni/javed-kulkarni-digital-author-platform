const sequenceByYear = new Map<number, number>();

export function nextInvoiceSequence(year: number = new Date().getFullYear()): number {
  const current = (sequenceByYear.get(year) ?? 0) + 1;
  sequenceByYear.set(year, current);
  return current;
}

export function formatInvoiceNumber(year: number, sequence: number): string {
  return `INV-${year}-${String(sequence).padStart(6, '0')}`;
}

export function resetInvoiceSequenceStore(): void {
  sequenceByYear.clear();
}
