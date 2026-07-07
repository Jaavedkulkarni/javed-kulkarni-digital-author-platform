import type { LibraryEntitlementRepository } from '../repositories/libraryEntitlementRepository';
import type { CommerceOrderItemsRepository } from '../repositories/orderItemsRepository';
import type {
  FulfillmentInput,
  GrantEntitlementInput,
  LibraryEntitlement,
} from '../types/entitlement.types';
import type { CommerceOperationResult } from '../types/common';

export class EntitlementEngine {
  constructor(
    private readonly entitlementRepo: LibraryEntitlementRepository,
    private readonly orderItemsRepo: CommerceOrderItemsRepository
  ) {}

  async grantFromOrder(input: FulfillmentInput): Promise<CommerceOperationResult<LibraryEntitlement[]>> {
    try {
      const items = await this.orderItemsRepo.findByOrderId(input.orderId);
      const granted: LibraryEntitlement[] = [];

      for (const item of items) {
        if (!item.book_id) continue;
        const grantInput: GrantEntitlementInput = {
          userId: input.userId,
          bookId: item.book_id,
          format: item.format,
          source: 'purchase',
          orderId: input.orderId,
          orderItemId: item.id,
        };
        granted.push(await this.entitlementRepo.grantEntitlement(grantInput));
      }

      return { success: true, data: granted };
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Entitlement grant failed.'],
      };
    }
  }
}

export function createEntitlementEngine(
  entitlementRepo: LibraryEntitlementRepository,
  orderItemsRepo: CommerceOrderItemsRepository
): EntitlementEngine {
  return new EntitlementEngine(entitlementRepo, orderItemsRepo);
}
