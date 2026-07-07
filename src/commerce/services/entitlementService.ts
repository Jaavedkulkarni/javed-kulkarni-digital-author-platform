import type { LibraryEntitlementRepository } from '../repositories/libraryEntitlementRepository';
import type { EntitlementEngine } from '../entitlement/entitlementEngine';
import type {
  EntitlementCheckResult,
  FulfillmentInput,
  GrantEntitlementInput,
  LibraryEntitlement,
} from '../types/entitlement.types';
import type { CommerceOperationResult } from '../types/common';

export class EntitlementService {
  constructor(
    private readonly repo: LibraryEntitlementRepository,
    private readonly engine: EntitlementEngine
  ) {}

  async listByUser(userId: string): Promise<LibraryEntitlement[]> {
    return this.repo.findByUser(userId);
  }

  async check(userId: string, bookId: string): Promise<EntitlementCheckResult> {
    return this.repo.checkEntitlement(userId, bookId);
  }

  async grant(input: GrantEntitlementInput): Promise<CommerceOperationResult<LibraryEntitlement>> {
    try {
      const entitlement = await this.repo.grantEntitlement(input);
      return { success: true, data: entitlement };
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Entitlement grant failed.'],
      };
    }
  }

  async grantFromOrder(input: FulfillmentInput): Promise<CommerceOperationResult<LibraryEntitlement[]>> {
    return this.engine.grantFromOrder(input);
  }
}

export function createEntitlementService(
  repo: LibraryEntitlementRepository,
  engine: EntitlementEngine
): EntitlementService {
  return new EntitlementService(repo, engine);
}
