import type { BookWorkflowStatus, DigitalFormat } from '../../types/database';

export type CmsEntityStatus = 'active' | 'inactive' | 'suspended';

export interface CmsSeoMetadata {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
}

export interface CmsPaginationParams {
  page?: number;
  pageSize?: number;
}

export interface CmsListResult<T> {
  items: T[];
  total: number;
}

export interface CmsOperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CmsStorageReference {
  bucket: string;
  path: string;
  publicUrl?: string;
}

export interface CmsBookEdition {
  format: DigitalFormat;
  storagePath?: string | null;
  fileSizeBytes?: number | null;
}

export interface CmsVersionSnapshot {
  entityType: string;
  entityId: string;
  version: number;
  capturedAt: string;
  payload: Record<string, unknown>;
}

export type { BookWorkflowStatus, DigitalFormat };
