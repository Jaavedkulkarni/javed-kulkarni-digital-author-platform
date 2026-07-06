import type { RoyaltyRecord } from '../types/revenue.types';

const royalties = new Map<string, RoyaltyRecord[]>();

export function getRoyalties(authorId: string): RoyaltyRecord[] {
  return royalties.get(authorId) ?? [];
}

export function addRoyalty(record: RoyaltyRecord): void {
  const existing = royalties.get(record.authorId) ?? [];
  royalties.set(record.authorId, [...existing, record]);
}

export function markRoyaltyPaid(authorId: string, royaltyId: string): RoyaltyRecord | null {
  const records = royalties.get(authorId);
  if (!records) return null;
  const updated = records.map((r) =>
    r.id === royaltyId ? { ...r, status: 'paid' as const, paidAt: new Date().toISOString() } : r
  );
  royalties.set(authorId, updated);
  return updated.find((r) => r.id === royaltyId) ?? null;
}

export function resetRoyaltyStore(): void {
  royalties.clear();
}
