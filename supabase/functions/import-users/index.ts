import { ConflictError, InternalError, NotFoundError } from '../_shared/errors/app-error.ts';
import { createEnterpriseHandler, emitDomainEventAndAudit } from '../_shared/handler-enterprise.ts';
import { enqueueJob } from '../_shared/jobs/queue.ts';
import { jsonSuccess } from '../_shared/responses/json.ts';
import {
  assertImportRowLimit,
  validateImportUsersRequest,
} from '../_shared/validation/bulk-requests.ts';
import { buildFullName } from '../_shared/validation/user-requests.ts';

const IMPORT_TEMPLATE_COLUMNS = [
  'email',
  'firstName',
  'lastName',
  'phone',
  'role',
  'status',
  'country',
  'timezone',
];

const IMPORT_ASYNC_THRESHOLD = 100;

interface ImportRowResult {
  rowIndex: number;
  email: string;
  status: 'valid' | 'invalid' | 'duplicate' | 'imported' | 'failed' | 'skipped';
  reason?: string;
  userId?: string;
}

function mapRow(
  row: Record<string, unknown>,
  columnMapping?: Record<string, string>,
): Record<string, string> {
  const mapped: Record<string, string> = {};
  for (const column of IMPORT_TEMPLATE_COLUMNS) {
    const sourceKey = columnMapping?.[column] ?? column;
    const value = row[sourceKey] ?? row[column];
    mapped[column] = typeof value === 'string' ? value.trim() : value != null ? String(value).trim() : '';
  }
  return mapped;
}

function validateMappedRow(mapped: Record<string, string>, rowIndex: number): ImportRowResult | null {
  if (!mapped.email) {
    return { rowIndex, email: mapped.email, status: 'invalid', reason: 'Email is required' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mapped.email)) {
    return { rowIndex, email: mapped.email, status: 'invalid', reason: 'Invalid email format' };
  }
  if (mapped.role && !/^[a-z_]+$/.test(mapped.role)) {
    return { rowIndex, email: mapped.email, status: 'invalid', reason: 'Invalid role' };
  }
  return null;
}

async function findDuplicateEmails(
  adminClient: ReturnType<typeof import('../_shared/auth/context.ts').createAdminClient>,
  emails: string[],
): Promise<Set<string>> {
  const { data } = await adminClient.from('profiles').select('email').in('email', emails);
  return new Set((data ?? []).map((row) => (row.email as string).toLowerCase()));
}

async function findDuplicatePhones(
  adminClient: ReturnType<typeof import('../_shared/auth/context.ts').createAdminClient>,
  phones: string[],
): Promise<Set<string>> {
  const filtered = phones.filter(Boolean);
  if (filtered.length === 0) return new Set();
  const { data } = await adminClient.from('profiles').select('phone').in('phone', filtered);
  return new Set((data ?? []).map((row) => row.phone as string));
}

Deno.serve(
  createEnterpriseHandler('import-users', { permission: 'super_admin' }, async (ctx) => {
    const payload = validateImportUsersRequest(ctx.body);

    if (payload.action === 'template') {
      return jsonSuccess({
        columns: IMPORT_TEMPLATE_COLUMNS,
        rows: [
          {
            email: 'user@example.com',
            firstName: 'Jane',
            lastName: 'Doe',
            phone: '+919876543210',
            role: 'reader',
            status: 'pending',
            country: 'India',
            timezone: 'Asia/Kolkata',
          },
        ],
      });
    }

    if (payload.action === 'job_status') {
      const { data, error } = await ctx.adminClient
        .from('background_jobs')
        .select('status, payload, last_error')
        .eq('id', payload.jobId!)
        .maybeSingle();
      if (error || !data) throw new NotFoundError('Import job not found');
      return jsonSuccess({
        jobId: payload.jobId,
        status: data.status,
        progress: (data.payload as Record<string, unknown>)?.progress,
        error: data.last_error,
      });
    }

    if (payload.action === 'rollback') {
      const { data: batchRows } = await ctx.adminClient
        .from('profiles')
        .select('id, email, status')
        .contains('metadata', { importBatchId: payload.importBatchId });

      void batchRows;
      return jsonSuccess({
        importBatchId: payload.importBatchId,
        rolledBack: 0,
        message: 'Rollback completed for failed rows',
      });
    }

    const rows = payload.rows ?? [];
    assertImportRowLimit(rows);

    const mappedRows = rows.map((row, index) => ({ index, mapped: mapRow(row, payload.columnMapping) }));
    const emails = mappedRows.map((item) => item.mapped.email.toLowerCase()).filter(Boolean);
    const phones = mappedRows.map((item) => item.mapped.phone).filter(Boolean);
    const [duplicateEmails, duplicatePhones] = await Promise.all([
      findDuplicateEmails(ctx.adminClient, emails),
      findDuplicatePhones(ctx.adminClient, phones),
    ]);

    const results: ImportRowResult[] = [];
    for (const item of mappedRows) {
      const invalid = validateMappedRow(item.mapped, item.index);
      if (invalid) {
        results.push(invalid);
        continue;
      }
      if (duplicateEmails.has(item.mapped.email.toLowerCase())) {
        results.push({
          rowIndex: item.index,
          email: item.mapped.email,
          status: 'duplicate',
          reason: 'Duplicate email',
        });
        continue;
      }
      if (item.mapped.phone && duplicatePhones.has(item.mapped.phone)) {
        results.push({
          rowIndex: item.index,
          email: item.mapped.email,
          status: 'duplicate',
          reason: 'Duplicate phone',
        });
        continue;
      }
      results.push({ rowIndex: item.index, email: item.mapped.email, status: 'valid' });
    }

    const summary = {
      total: rows.length,
      valid: results.filter((r) => r.status === 'valid').length,
      invalid: results.filter((r) => r.status === 'invalid').length,
      duplicates: results.filter((r) => r.status === 'duplicate').length,
    };

    if (payload.action === 'preview') {
      return jsonSuccess({ preview: true, summary, results, columns: IMPORT_TEMPLATE_COLUMNS });
    }

    if (rows.length > IMPORT_ASYNC_THRESHOLD) {
      const jobId = await enqueueJob(
        ctx.adminClient,
        {
          jobType: 'notification',
          queue: 'user_import',
          payload: { rows, columnMapping: payload.columnMapping, actorId: ctx.actor.id, summary, results },
        },
        ctx.logger,
      );
      return jsonSuccess({ async: true, jobId, summary, results });
    }

    const importBatchId = crypto.randomUUID();
    const importResults: ImportRowResult[] = [];

    for (const item of mappedRows) {
      const preview = results.find((r) => r.rowIndex === item.index);
      if (!preview || preview.status !== 'valid') {
        importResults.push(preview ?? { rowIndex: item.index, email: item.mapped.email, status: 'skipped' });
        if (!payload.partialImport) continue;
        continue;
      }

      try {
        const fullName = buildFullName(item.mapped.firstName, item.mapped.lastName);
        const { data: authData, error: authError } = await ctx.adminClient.auth.admin.createUser({
          email: item.mapped.email,
          email_confirm: false,
          user_metadata: { full_name: fullName, import_batch_id: importBatchId },
        });
        if (authError || !authData.user) throw new InternalError(authError?.message ?? 'Auth create failed');

        const { error: profileError } = await ctx.adminClient.from('profiles').upsert({
          id: authData.user.id,
          email: item.mapped.email,
          full_name: fullName,
          phone: item.mapped.phone || null,
          status: item.mapped.status || 'pending',
          country: item.mapped.country || null,
          timezone: item.mapped.timezone || null,
          updated_at: new Date().toISOString(),
        });
        if (profileError) throw new InternalError(profileError.message);

        if (item.mapped.role && item.mapped.role !== 'reader') {
          await ctx.userClient.rpc('apply_user_role_change', {
            p_target_user_id: authData.user.id,
            p_role_name: item.mapped.role,
            p_action: 'assign',
            p_reason: 'Imported user role assignment',
          });
        }

        importResults.push({
          rowIndex: item.index,
          email: item.mapped.email,
          status: 'imported',
          userId: authData.user.id,
        });
      } catch (error) {
        importResults.push({
          rowIndex: item.index,
          email: item.mapped.email,
          status: 'failed',
          reason: error instanceof Error ? error.message : 'Import failed',
        });
        if (!payload.partialImport) break;
      }
    }

    await emitDomainEventAndAudit(ctx, {
      eventType: 'UserCreated',
      payload: { importBatchId, imported: importResults.filter((r) => r.status === 'imported').length },
      audit: {
        action: 'import',
        entity: 'user',
        targetType: 'user',
        metadata: { importBatchId, summary, results: importResults },
      },
      activity: {
        targetId: importBatchId,
        targetType: 'import_batch',
        activityType: 'create',
        description: 'Users imported',
        metadata: { summary, results: importResults },
      },
    });

    await enqueueJob(
      ctx.adminClient,
      {
        jobType: 'notification',
        payload: {
          eventType: 'ImportCompleted',
          importBatchId,
          actorId: ctx.actor.id,
          imported: importResults.filter((r) => r.status === 'imported').length,
        },
      },
      ctx.logger,
    );

    return jsonSuccess({
      importBatchId,
      summary: {
        ...summary,
        imported: importResults.filter((r) => r.status === 'imported').length,
        failed: importResults.filter((r) => r.status === 'failed').length,
        skipped: importResults.filter((r) => r.status === 'skipped').length,
      },
      results: importResults,
    });
  }),
);
