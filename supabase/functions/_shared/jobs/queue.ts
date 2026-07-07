import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';
import type { Logger } from '../logging/logger.ts';

export type JobType =
  | 'email'
  | 'notification'
  | 'image_processing'
  | 'thumbnail_generation'
  | 'audit_cleanup'
  | 'cache_refresh'
  | 'search_index'
  | 'analytics'
  | 'ai_task';

export type JobStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'dead_letter'
  | 'scheduled'
  | 'cancelled';

export interface EnqueueJobInput {
  jobType: JobType;
  queue?: string;
  payload?: Record<string, unknown>;
  priority?: number;
  maxAttempts?: number;
  scheduledFor?: string;
}

export async function enqueueJob(
  adminClient: SupabaseClient,
  input: EnqueueJobInput,
  logger: Logger,
): Promise<string | null> {
  const status = input.scheduledFor ? 'scheduled' : 'pending';
  const { data, error } = await adminClient
    .from('background_jobs')
    .insert({
      job_type: input.jobType,
      queue: input.queue ?? 'default',
      payload: input.payload ?? {},
      priority: input.priority ?? 0,
      max_attempts: input.maxAttempts ?? 5,
      scheduled_for: input.scheduledFor ?? null,
      status,
    })
    .select('id')
    .single();

  if (error) {
    logger.error('Failed to enqueue job', { jobType: input.jobType, message: error.message });
    return null;
  }

  return data?.id ?? null;
}

export async function markJobFailed(
  adminClient: SupabaseClient,
  jobId: string,
  errorMessage: string,
  maxAttempts: number,
  currentAttempts: number,
): Promise<void> {
  const nextAttempts = currentAttempts + 1;
  const status = nextAttempts >= maxAttempts ? 'dead_letter' : 'failed';

  await adminClient
    .from('background_jobs')
    .update({
      status,
      attempts: nextAttempts,
      last_error: errorMessage,
      updated_at: new Date().toISOString(),
    })
    .eq('id', jobId);
}

export async function markJobCompleted(adminClient: SupabaseClient, jobId: string): Promise<void> {
  await adminClient
    .from('background_jobs')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', jobId);
}

export async function claimNextJob(
  adminClient: SupabaseClient,
  queue = 'default',
  holderId: string,
): Promise<{ id: string; job_type: JobType; payload: Record<string, unknown>; attempts: number; max_attempts: number } | null> {
  const now = new Date().toISOString();

  const { data: jobs } = await adminClient
    .from('background_jobs')
    .select('id, job_type, payload, attempts, max_attempts')
    .eq('queue', queue)
    .in('status', ['pending', 'failed'])
    .or(`scheduled_for.is.null,scheduled_for.lte.${now}`)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(1);

  const job = jobs?.[0];
  if (!job) return null;

  const { data: locked } = await adminClient
    .from('background_jobs')
    .update({
      status: 'processing',
      locked_at: now,
      locked_by: holderId,
      updated_at: now,
    })
    .eq('id', job.id)
    .eq('status', job.attempts > 0 ? 'failed' : 'pending')
    .select('id, job_type, payload, attempts, max_attempts')
    .maybeSingle();

  return locked ?? null;
}
