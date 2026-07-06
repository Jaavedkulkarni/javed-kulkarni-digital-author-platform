import type { AuthorContract } from '../types/contracts.types';

const contracts = new Map<string, AuthorContract[]>();

export function getContracts(authorId: string): AuthorContract[] {
  return contracts.get(authorId) ?? [];
}

export function seedContracts(authorId: string): void {
  if (getContracts(authorId).length > 0) return;
  contracts.set(authorId, [
    {
      id: `ctr_${Date.now()}`,
      authorId,
      title: 'Standard Publishing Agreement',
      contractType: 'publishing',
      status: 'active',
      signedAt: new Date().toISOString(),
      expiresAt: null,
      documentPath: `contracts/${authorId}/publishing-agreement.pdf`,
      terms: { royaltyRate: 0.7, territory: 'worldwide' },
      createdAt: new Date().toISOString(),
    },
  ]);
}

export function resetContractsStore(): void {
  contracts.clear();
}
