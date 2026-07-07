import type { OrderService } from './orderService';
import type { EntitlementService } from './entitlementService';
import type { InvoiceService } from './invoiceService';
import type { FulfillmentInput, FulfillmentResult } from '../types/entitlement.types';

/**
 * Post-payment fulfillment orchestrator — integration-ready, not wired to checkout yet.
 */
export class FulfillmentService {
  constructor(
    private readonly orders: OrderService,
    private readonly entitlements: EntitlementService,
    private readonly invoices: InvoiceService
  ) {}

  async fulfillPaidOrder(input: FulfillmentInput): Promise<FulfillmentResult> {
    const order = await this.orders.getById(input.orderId);
    if (!order) {
      return {
        orderId: input.orderId,
        entitlementsGranted: [],
        invoiceId: null,
        completed: false,
        errors: ['Order not found.'],
      };
    }

    const entitlementResult = await this.entitlements.grantFromOrder(input);
    if (!entitlementResult.success) {
      return {
        orderId: input.orderId,
        entitlementsGranted: [],
        invoiceId: null,
        completed: false,
        errors: entitlementResult.errors,
      };
    }

    let invoiceId: string | null = null;
    const existingInvoice = this.invoices.findByOrderId(order.id);
    if (!existingInvoice) {
      const invoice = this.invoices.generate({
        orderId: order.id,
        orderNumber: order.orderNumber,
        currency: order.currency,
        buyer: order.buyer,
        items: order.items,
        subtotal: order.subtotal,
        discountAmount: order.discountAmount,
        tax: {
          region: 'IN',
          taxableAmount: order.subtotal - order.discountAmount,
          taxAmount: order.taxAmount,
          effectiveRate: order.taxAmount > 0 ? order.taxAmount / Math.max(order.subtotal - order.discountAmount, 1) : 0,
          components: [{ label: 'GST', rate: 18, amount: order.taxAmount }],
          isInterState: false,
        },
        totalAmount: order.totalAmount,
      });
      invoiceId = invoice.invoiceNumber;
    } else {
      invoiceId = existingInvoice.invoiceNumber;
    }

    return {
      orderId: input.orderId,
      entitlementsGranted: entitlementResult.data ?? [],
      invoiceId,
      completed: true,
    };
  }
}

export function createFulfillmentService(
  orders: OrderService,
  entitlements: EntitlementService,
  invoices: InvoiceService
): FulfillmentService {
  return new FulfillmentService(orders, entitlements, invoices);
}
