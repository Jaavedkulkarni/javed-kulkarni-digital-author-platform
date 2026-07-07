import type { ErrorContract } from '../errors/error.types';

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  version: string;
  requestId?: string;
}

export interface ApiFailureResponse {
  success: false;
  error: ErrorContract;
  version: string;
  requestId?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiFailureResponse;

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface RequestContextSnapshot {
  requestId: string;
  traceId: string;
  correlationId: string;
  spanId: string;
  actorId: string | null;
  actorRole: string | null;
  ip: string | null;
  browser: string | null;
  device: string | null;
  platform: string | null;
  timezone: string | null;
  locale: string | null;
  userAgent: string | null;
}

export interface AuditEntrySnapshot {
  id: string;
  requestId: string;
  correlationId: string;
  traceId: string;
  actorId: string | null;
  action: string;
  entity: string;
  targetId: string | null;
  targetType: string | null;
  beforeState: Record<string, unknown> | null;
  afterState: Record<string, unknown> | null;
  createdAt: string;
}

export interface ActivityEntrySnapshot {
  id: string;
  targetId: string;
  targetType: string;
  activityType: string;
  description: string | null;
  actorId: string | null;
  createdAt: string;
}

export interface FeatureFlagSnapshot {
  id: string;
  enabled: boolean;
  description: string | null;
}

export interface HealthReportSnapshot {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checkedAt: string;
  latencyMs?: number;
}

export type { ErrorContract };
