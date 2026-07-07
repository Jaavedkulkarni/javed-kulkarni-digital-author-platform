export type TimelineSeverity = 'normal' | 'warning' | 'critical';

export type TimelineExportFormat = 'csv' | 'xlsx' | 'pdf' | 'json';

export interface TimelinePagination {
  cursor?: string | null;
  limit?: number;
}

export interface TimelineFilters {
  search?: string;
  severity?: TimelineSeverity | '';
  action?: string;
  dateFrom?: string;
  dateTo?: string;
  eventType?: string;
}

export interface TimelineMetrics {
  queryTimeMs: number;
  edgeTimeMs?: number;
  recordsReturned: number;
  cacheHit?: boolean;
}

export interface TimelinePage<T> {
  items: T[];
  nextCursor: string | null;
  metrics: TimelineMetrics;
}

export interface AuditTimelineItem {
  id: string;
  actorId: string | null;
  actorLabel: string | null;
  targetId: string | null;
  targetType: string | null;
  targetLabel: string | null;
  action: string;
  entity: string;
  beforeState: Record<string, unknown> | null;
  afterState: Record<string, unknown> | null;
  createdAt: string;
  browser: string | null;
  operatingSystem: string | null;
  platform: string | null;
  ipAddress: string | null;
  requestId: string;
  traceId: string;
  correlationId: string;
  severity: TimelineSeverity;
  metadata: Record<string, unknown>;
}

export interface LoginHistoryItem {
  id: string;
  eventType: string;
  title: string;
  description: string | null;
  browser: string | null;
  operatingSystem: string | null;
  device: string | null;
  country: string | null;
  region: string | null;
  ipAddress: string | null;
  createdAt: string;
  isCurrentSession: boolean;
  severity: TimelineSeverity;
  metadata: Record<string, unknown>;
}

export interface SecurityEventItem {
  id: string;
  eventType: string;
  title: string;
  description: string | null;
  actorId: string | null;
  actorLabel: string | null;
  targetId: string | null;
  createdAt: string;
  severity: TimelineSeverity;
  requestId: string | null;
  traceId: string | null;
  correlationId: string | null;
  metadata: Record<string, unknown>;
}

export interface TimelineDetailPayload {
  id: string;
  kind: 'audit' | 'login' | 'security' | 'activity';
  title: string;
  description: string | null;
  actorId: string | null;
  actorLabel: string | null;
  targetId: string | null;
  targetLabel: string | null;
  createdAt: string;
  severity: TimelineSeverity;
  requestId: string | null;
  traceId: string | null;
  correlationId: string | null;
  beforeState?: Record<string, unknown> | null;
  afterState?: Record<string, unknown> | null;
  metadata: Record<string, unknown>;
  relatedEvents?: Array<{ id: string; title: string; createdAt: string }>;
}

export interface JsonDiffEntry {
  path: string;
  type: 'added' | 'removed' | 'modified' | 'unchanged';
  before?: unknown;
  after?: unknown;
}
