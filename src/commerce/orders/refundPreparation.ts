import type { PaymentOrchestrator } from '../payments/paymentOrchestrator';
import type { PaymentProviderId, RefundPreparationRequest, RefundPreparationResult } from '../types/payment.types';
import type { CommerceOrderStatus } from '../types/checkout.types';
import { validateOrderTransition } from '../workflow/orderWorkflow';

export interface PrepareRefundInput {
  orderId: string;
  paymentId: string;
  providerPaymentId: string;
  provider: PaymentProviderId;
  amount: number;
  currentOrderStatus: CommerceOrderStatus;
  reason?: string;
}

export interface PrepareRefundResult {
  success: boolean;
  refund?: RefundPreparationResult;
  errors?: string[];
}

export class RefundPreparationService {
  constructor(private readonly orchestrator: PaymentOrchestrator) {}

  async prepare(input: PrepareRefundInput): Promise<PrepareRefundResult> {
    const transition = validateOrderTransition(input.currentOrderStatus, 'refunded');
    if (!transition.allowed) {
      return { success: false, errors: [transition.error ?? 'Refund not allowed for this order.'] };
    }

    const request: RefundPreparationRequest = {
      paymentId: input.paymentId,
      orderId: input.orderId,
      amount: input.amount,
      reason: input.reason,
    };

    const refund = await this.orchestrator.prepareRefund(input.provider, request);
    return { success: true, refund };
  }
}

export function createRefundPreparationService(
  orchestrator: PaymentOrchestrator
): RefundPreparationService {
  return new RefundPreparationService(orchestrator);
}
