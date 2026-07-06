import type { CommerceReceipt, GenerateReceiptInput } from '../types/receipt.types';

let receiptSequence = 5000;

function generateReceiptNumber(orderNumber: string): string {
  receiptSequence += 1;
  const suffix = String(receiptSequence).padStart(6, '0');
  const orderSuffix = orderNumber.replace(/^AO-/, '');
  return `RCP-${orderSuffix}-${suffix}`;
}

export function buildReceipt(input: GenerateReceiptInput): CommerceReceipt {
  return {
    receiptNumber: generateReceiptNumber(input.orderNumber),
    orderNumber: input.orderNumber,
    orderId: input.orderId,
    paymentId: input.paymentId,
    paidAt: new Date().toISOString(),
    amount: input.amount,
    currency: input.currency,
    paymentMethod: input.paymentMethod,
    provider: input.provider,
    buyerEmail: input.buyerEmail,
    lineSummary: input.itemTitles,
  };
}

export class ReceiptGenerator {
  generate(input: GenerateReceiptInput): CommerceReceipt {
    return buildReceipt(input);
  }
}

export function createReceiptGenerator(): ReceiptGenerator {
  return new ReceiptGenerator();
}

export function resetReceiptSequence(): void {
  receiptSequence = 5000;
}
