import type { RoyaltyStatus } from './common';

export interface RoyaltyRecord {
  id: string;
  authorId: string;
  bookId: string;
  bookTitle: string;
  orderId: string;
  grossAmount: number;
  royaltyRate: number;
  royaltyAmount: number;
  status: RoyaltyStatus;
  periodMonth: string;
  periodYear: number;
  paidAt: string | null;
  createdAt: string;
}

export interface RoyaltySummary {
  pending: number;
  paid: number;
  total: number;
  monthly: Array<{ month: string; amount: number; status: RoyaltyStatus }>;
  yearly: Array<{ year: number; amount: number }>;
}

export interface SalesReportRow {
  bookId: string;
  bookTitle: string;
  unitsSold: number;
  grossRevenue: number;
  netRoyalty: number;
  period: string;
}

export interface ExportPreparation {
  format: 'csv' | 'pdf';
  filename: string;
  columns: string[];
  rowCount: number;
  preparedAt: string;
  downloadPath: string | null;
}
