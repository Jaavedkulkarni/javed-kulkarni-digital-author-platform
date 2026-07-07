import { invokeEdgeFunctionOrThrow } from '../../lib/edge-functions';
import { checkSupabaseConnection } from '../../lib/utils/healthCheck';
import { getBrowserClient } from '../../lib/supabase/clients/browser';

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface ServiceHealthCheck {
  status: HealthStatus;
  message: string;
  latencyMs?: number;
  details?: Record<string, unknown>;
}

export interface PlatformHealthReport {
  status: HealthStatus;
  checkedAt: string;
  checks: {
    database: ServiceHealthCheck;
    storage: ServiceHealthCheck;
    auth: ServiceHealthCheck;
    functions: ServiceHealthCheck;
    realtime: ServiceHealthCheck;
  };
}

export class EnterpriseHealthService {
  async checkDatabase(): Promise<ServiceHealthCheck> {
    const client = getBrowserClient();
    const result = await checkSupabaseConnection(client);
    return {
      status: result.status === 'healthy' ? 'healthy' : result.status === 'degraded' ? 'degraded' : 'unhealthy',
      message: result.message,
      latencyMs: result.latencyMs,
    };
  }

  async checkStorage(): Promise<ServiceHealthCheck> {
    const client = getBrowserClient();
    const startedAt = Date.now();
    const { data, error } = await client.storage.listBuckets();
    return {
      status: error ? 'unhealthy' : 'healthy',
      message: error?.message ?? 'Storage reachable',
      latencyMs: Date.now() - startedAt,
      details: { bucketCount: data?.length ?? 0 },
    };
  }

  async checkAuth(): Promise<ServiceHealthCheck> {
    const client = getBrowserClient();
    const startedAt = Date.now();
    const { error } = await client.auth.getSession();
    return {
      status: error ? 'degraded' : 'healthy',
      message: error?.message ?? 'Auth service reachable',
      latencyMs: Date.now() - startedAt,
    };
  }

  async checkFunctions(): Promise<ServiceHealthCheck> {
    const startedAt = Date.now();
    try {
      const data = await invokeEdgeFunctionOrThrow<{
        status: string;
        checks: Record<string, ServiceHealthCheck>;
      }>('health-check', {});
      return {
        status: data.status === 'healthy' ? 'healthy' : 'degraded',
        message: 'Edge functions reachable',
        latencyMs: Date.now() - startedAt,
        details: data.checks,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Functions unreachable',
        latencyMs: Date.now() - startedAt,
      };
    }
  }

  async checkRealtime(): Promise<ServiceHealthCheck> {
    return {
      status: 'healthy',
      message: 'Realtime validated at connection time',
    };
  }

  async checkAll(): Promise<PlatformHealthReport> {
    const [database, storage, auth, functions, realtime] = await Promise.all([
      this.checkDatabase(),
      this.checkStorage(),
      this.checkAuth(),
      this.checkFunctions(),
      this.checkRealtime(),
    ]);

    const checks = { database, storage, auth, functions, realtime };
    const statuses = Object.values(checks).map((c) => c.status);
    const status: HealthStatus = statuses.includes('unhealthy')
      ? 'unhealthy'
      : statuses.includes('degraded')
        ? 'degraded'
        : 'healthy';

    return { status, checkedAt: new Date().toISOString(), checks };
  }
}

let service: EnterpriseHealthService | null = null;

export function getEnterpriseHealthService(): EnterpriseHealthService {
  if (!service) service = new EnterpriseHealthService();
  return service;
}
