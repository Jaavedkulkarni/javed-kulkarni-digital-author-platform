import type { RoyaltyRecord, RoyaltySummary, SalesReportRow, ExportPreparation } from '../types/revenue.types';
import { getRoyalties, addRoyalty, markRoyaltyPaid } from '../stores/royaltyStore';
import { buildRoyaltyRecord, prepareCsvExport } from '../utils/analytics';

export class AuthorRevenueService {
  getRoyalties(authorId: string): RoyaltyRecord[] {
    return getRoyalties(authorId);
  }

  recordSale(params: {
    authorId: string;
    bookId: string;
    bookTitle: string;
    orderId: string;
    grossAmount: number;
  }): RoyaltyRecord {
    const record = buildRoyaltyRecord(params);
    addRoyalty(record);
    return record;
  }

  getSummary(authorId: string): RoyaltySummary {
    const records = getRoyalties(authorId);
    const pending = records.filter((r) => r.status === 'pending').reduce((s, r) => s + r.royaltyAmount, 0);
    const paid = records.filter((r) => r.status === 'paid').reduce((s, r) => s + r.royaltyAmount, 0);

    const monthlyMap = new Map<string, number>();
    const yearlyMap = new Map<number, number>();
    for (const r of records) {
      const key = `${r.periodYear}-${r.periodMonth}`;
      monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + r.royaltyAmount);
      yearlyMap.set(r.periodYear, (yearlyMap.get(r.periodYear) ?? 0) + r.royaltyAmount);
    }

    return {
      pending: Math.round(pending * 100) / 100,
      paid: Math.round(paid * 100) / 100,
      total: Math.round((pending + paid) * 100) / 100,
      monthly: [...monthlyMap.entries()].map(([month, amount]) => ({
        month,
        amount,
        status: 'pending' as const,
      })),
      yearly: [...yearlyMap.entries()].map(([year, amount]) => ({ year, amount })),
    };
  }

  getSalesReport(authorId: string): SalesReportRow[] {
    const records = getRoyalties(authorId);
    const map = new Map<string, SalesReportRow>();

    for (const r of records) {
      const existing = map.get(r.bookId) ?? {
        bookId: r.bookId,
        bookTitle: r.bookTitle,
        unitsSold: 0,
        grossRevenue: 0,
        netRoyalty: 0,
        period: `${r.periodMonth} ${r.periodYear}`,
      };
      existing.unitsSold += 1;
      existing.grossRevenue += r.grossAmount;
      existing.netRoyalty += r.royaltyAmount;
      map.set(r.bookId, existing);
    }

    return [...map.values()];
  }

  payRoyalty(authorId: string, royaltyId: string): RoyaltyRecord | null {
    return markRoyaltyPaid(authorId, royaltyId);
  }

  prepareExport(authorId: string, type: 'royalties' | 'sales'): ExportPreparation {
    const records = type === 'royalties' ? getRoyalties(authorId) : [];
    const sales = type === 'sales' ? this.getSalesReport(authorId) : [];
    const rowCount = type === 'royalties' ? records.length : sales.length;
    const columns =
      type === 'royalties'
        ? ['bookTitle', 'grossAmount', 'royaltyAmount', 'status', 'periodMonth', 'periodYear']
        : ['bookTitle', 'unitsSold', 'grossRevenue', 'netRoyalty', 'period'];

    return prepareCsvExport(`author-${type}-${authorId}.csv`, columns, rowCount);
  }
}

export function createAuthorRevenueService(): AuthorRevenueService {
  return new AuthorRevenueService();
}
