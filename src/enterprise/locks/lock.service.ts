export interface DistributedLockOptions {
  ttlMs?: number;
}

export interface DistributedLockHandle {
  lockKey: string;
  holderId: string;
  acquired: boolean;
  expiresAt: string;
}

export interface DistributedLockAdapter {
  acquire(lockKey: string, holderId: string, options?: DistributedLockOptions): Promise<DistributedLockHandle>;
  release(lockKey: string, holderId: string): Promise<void>;
}

export class InMemoryDistributedLockAdapter implements DistributedLockAdapter {
  private locks = new Map<string, { holderId: string; expiresAt: number }>();

  async acquire(lockKey: string, holderId: string, options: DistributedLockOptions = {}): Promise<DistributedLockHandle> {
    const ttlMs = options.ttlMs ?? 30_000;
    const now = Date.now();
    const existing = this.locks.get(lockKey);

    if (existing && existing.expiresAt > now && existing.holderId !== holderId) {
      return {
        lockKey,
        holderId,
        acquired: false,
        expiresAt: new Date(existing.expiresAt).toISOString(),
      };
    }

    const expiresAt = now + ttlMs;
    this.locks.set(lockKey, { holderId, expiresAt });

    return {
      lockKey,
      holderId,
      acquired: true,
      expiresAt: new Date(expiresAt).toISOString(),
    };
  }

  async release(lockKey: string, holderId: string): Promise<void> {
    const existing = this.locks.get(lockKey);
    if (existing?.holderId === holderId) {
      this.locks.delete(lockKey);
    }
  }
}

let adapter: DistributedLockAdapter | null = null;

export function getDistributedLockAdapter(): DistributedLockAdapter {
  if (!adapter) adapter = new InMemoryDistributedLockAdapter();
  return adapter;
}

export async function withDistributedLock<T>(
  lockKey: string,
  holderId: string,
  fn: () => Promise<T>,
  options?: DistributedLockOptions,
): Promise<T> {
  const lock = getDistributedLockAdapter();
  const handle = await lock.acquire(lockKey, holderId, options);
  if (!handle.acquired) {
    throw new Error(`Could not acquire lock: ${lockKey}`);
  }
  try {
    return await fn();
  } finally {
    await lock.release(lockKey, holderId);
  }
}
