import { InternalError, NotFoundError } from '../_shared/errors/app-error.ts';
import { createEnterpriseHandler, emitDomainEventAndAudit } from '../_shared/handler-enterprise.ts';
import { enqueueJob } from '../_shared/jobs/queue.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';
import { validateExportUsersRequest } from '../_shared/validation/bulk-requests.ts';

const DEFAULT_EXPORT_COLUMNS = [
  'id',
  'name',
  'email',
  'phone',
  'primaryRole',
  'status',
  'emailVerified',
  'lastLogin',
  'createdAt',
  'country',
  'timezone',
];

const EXPORT_ASYNC_THRESHOLD = 500;

async function fetchExportRows(
  adminClient: ReturnType<typeof import('../_shared/auth/context.ts').createAdminClient>,
  scope: string,
  userIds?: string[],
  filters?: Record<string, unknown>,
): Promise<Record<string, unknown>[]> {
  let query = adminClient
    .from('profiles')
    .select(`
      id,
      full_name,
      email,
      phone,
      status,
      deleted_at,
      created_at,
      country,
      timezone,
      user_roles!inner(roles(name), is_active)
    `);

  if (scope === 'selected' && userIds?.length) {
    query = query.in('id', userIds);
  } else if (scope === 'filtered' && filters) {
    if (filters.status === 'deleted') query = query.not('deleted_at', 'is', null);
    else query = query.is('deleted_at', null);
    if (typeof filters.search === 'string' && filters.search.trim()) {
      query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }
    if (typeof filters.status === 'string' && filters.status && filters.status !== 'deleted') {
      query = query.eq('status', filters.status);
    }
  } else {
    query = query.is('deleted_at', null);
  }

  const { data, error } = await query.limit(5000);
  if (error) throw new InternalError(error.message);

  return (data ?? []).map((row) => {
    const roles = (row.user_roles as Array<{ roles: { name: string }; is_active: boolean }> | null) ?? [];
    const primaryRole = roles.find((r) => r.is_active)?.roles?.name ?? 'reader';
    return {
      id: row.id,
      name: row.full_name,
      email: row.email,
      phone: row.phone,
      primaryRole,
      status: row.deleted_at ? 'deleted' : row.status,
      emailVerified: row.status !== 'pending',
      lastLogin: null,
      createdAt: row.created_at,
      country: row.country,
      timezone: row.timezone,
    };
  });
}

Deno.serve(
  createEnterpriseHandler('export-users', { permission: 'super_admin' }, async (ctx) => {
    const payload = validateExportUsersRequest(ctx.body);

    if (payload.action === 'job_status') {
      const { data, error } = await ctx.adminClient
        .from('background_jobs')
        .select('status, payload, last_error')
        .eq('id', payload.jobId!)
        .maybeSingle();
      if (error || !data) throw new NotFoundError('Export job not found');
      const jobPayload = (data.payload ?? {}) as Record<string, unknown>;
      return jsonSuccess({
        jobId: payload.jobId,
        status: data.status,
        rows: jobPayload.rows,
        columns: jobPayload.columns,
        format: jobPayload.format,
        error: data.last_error,
      });
    }

    const columns = payload.columns?.length ? payload.columns : DEFAULT_EXPORT_COLUMNS;
    const scope = payload.scope ?? 'filtered';

    const estimateQuery = scope === 'selected'
      ? (payload.userIds?.length ?? 0)
      : 100;

    if (estimateQuery > EXPORT_ASYNC_THRESHOLD || scope === 'all') {
      const jobId = await enqueueJob(
        ctx.adminClient,
        {
          jobType: 'notification',
          queue: 'user_export',
          payload: {
            scope,
            userIds: payload.userIds,
            filters: payload.filters,
            columns,
            format: payload.format,
            actorId: ctx.actor.id,
          },
        },
        ctx.logger,
      );

      void processExportJob(ctx, jobId!, scope, payload.userIds, payload.filters, columns, payload.format ?? 'csv');

      return jsonSuccess({ async: true, jobId, format: payload.format, scope });
    }

    const rows = await fetchExportRows(ctx.adminClient, scope, payload.userIds, payload.filters);

    await emitDomainEventAndAudit(ctx, {
      eventType: 'UserUpdated',
      payload: { exportScope: scope, rowCount: rows.length, format: payload.format },
      audit: {
        action: 'export',
        entity: 'user',
        targetType: 'user',
        metadata: { scope, format: payload.format, rowCount: rows.length },
      },
      activity: {
        targetId: ctx.actor.id,
        targetType: 'export',
        activityType: 'update',
        description: 'Users exported',
        metadata: { scope, rowCount: rows.length },
      },
    });

    await enqueueJob(
      ctx.adminClient,
      {
        jobType: 'notification',
        payload: {
          eventType: 'ExportCompleted',
          actorId: ctx.actor.id,
          rowCount: rows.length,
          format: payload.format,
        },
      },
      ctx.logger,
    );

    return jsonSuccess({
      async: false,
      format: payload.format,
      columns,
      rows,
      rowCount: rows.length,
    });
  }),
);

async function processExportJob(
  ctx: Parameters<typeof createEnterpriseHandler>[2] extends (c: infer C) => unknown ? C : never,
  jobId: string,
  scope: string,
  userIds: string[] | undefined,
  filters: Record<string, unknown> | undefined,
  columns: string[],
  format: string,
): Promise<void> {
  try {
    await ctx.adminClient.from('background_jobs').update({ status: 'processing' }).eq('id', jobId);
    const rows = await fetchExportRows(ctx.adminClient, scope, userIds, filters);
    await ctx.adminClient
      .from('background_jobs')
      .update({
        status: 'completed',
        payload: { rows, columns, format, rowCount: rows.length },
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId);
  } catch (error) {
    await ctx.adminClient
      .from('background_jobs')
      .update({
        status: 'failed',
        last_error: error instanceof Error ? error.message : 'Export failed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId);
  }
}
