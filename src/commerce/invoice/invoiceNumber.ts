let invoiceSequence = 1000;

export function generateInvoiceNumber(orderNumber: string): string {
  invoiceSequence += 1;
  const suffix = String(invoiceSequence).padStart(6, '0');
  const orderSuffix = orderNumber.replace(/^AO-/, '');
  return `INV-${orderSuffix}-${suffix}`;
}

export function resetInvoiceSequence(): void {
  invoiceSequence = 1000;
}
