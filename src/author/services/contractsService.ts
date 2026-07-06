import type { AgreementSummary } from '../types/contracts.types';
import { getContracts, seedContracts } from '../stores/contractsStore';

export class ContractsService {
  list(authorId: string) {
    seedContracts(authorId);
    return getContracts(authorId);
  }

  getSummary(authorId: string): AgreementSummary {
    const contracts = this.list(authorId);
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    return {
      activeContracts: contracts.filter((c) => c.status === 'active').length,
      expiringSoon: contracts.filter(
        (c) => c.expiresAt && new Date(c.expiresAt).getTime() - now < thirtyDays
      ).length,
      pendingSignature: contracts.filter((c) => c.status === 'draft').length,
    };
  }
}

export function createContractsService(): ContractsService {
  return new ContractsService();
}
