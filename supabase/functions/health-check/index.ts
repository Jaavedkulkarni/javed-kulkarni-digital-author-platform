import { createEnterpriseHandler } from '../_shared/handler-enterprise.ts';
import { createAdminClient } from '../_shared/auth/context.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';
import { getMetrics } from '../_shared/observability/metrics.ts';

const HEALTH_CHECK_TABLE = 'roles';

Deno.serve(
  createEnterpriseHandler('health-check', { skipAuth: true, skipRateLimit: true, skipIdempotency: true }, async (ctx) => {
    const adminClient = createAdminClient();
    const startedAt = Date.now();

    const [database, storage, auth] = await Promise.all([
      adminClient.from(HEALTH_CHECK_TABLE).select('id').limit(1),
      adminClient.storage.listBuckets(),
      adminClient.auth.admin.listUsers({ page: 1, perPage: 1 }),
    ]);

    const checks = {
      database: {
        status: database.error ? 'unhealthy' : 'healthy',
        message: database.error?.message ?? 'ok',
      },
      storage: {
        status: storage.error ? 'unhealthy' : 'healthy',
        message: storage.error?.message ?? 'ok',
        bucketCount: storage.data?.length ?? 0,
      },
      auth: {
        status: auth.error ? 'unhealthy' : 'healthy',
        message: auth.error?.message ?? 'ok',
      },
      functions: {
        status: 'healthy',
        message: 'Edge runtime active',
      },
      realtime: {
        status: 'healthy',
        message: 'Realtime check deferred to client SDK',
      },
    };

    const unhealthy = Object.values(checks).some((c) => c.status === 'unhealthy');

    return jsonSuccess({
      status: unhealthy ? 'degraded' : 'healthy',
      latencyMs: Date.now() - startedAt,
      checks,
      metrics: getMetrics(),
      requestId: ctx.requestContext.requestId,
    });
  }),
);
