export interface IRepository<TEntity, TId = string> {
  findById(id: TId): Promise<TEntity | null>;
  findAll(params?: Record<string, unknown>): Promise<TEntity[]>;
}

export interface IWritableRepository<TEntity, TCreate, TUpdate, TId = string>
  extends IRepository<TEntity, TId> {
  create(input: TCreate): Promise<TEntity>;
  update(id: TId, input: TUpdate): Promise<TEntity>;
  delete(id: TId): Promise<void>;
}

export interface IService<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}

export interface IServiceResult<TData, TError = string> {
  success: boolean;
  data?: TData;
  error?: TError;
}

export interface IEventPublisher {
  publish(type: string, payload: Record<string, unknown>, ids: {
    requestId: string;
    correlationId: string;
    traceId: string;
  }): void;
}

export interface IEventSubscriber {
  subscribe(type: string, handler: (payload: Record<string, unknown>) => void): () => void;
}

export interface IJobQueue {
  enqueue(jobType: string, payload: Record<string, unknown>): Promise<string | null>;
}

export interface INotificationEngine {
  send(input: {
    userId: string;
    channel: string;
    category: string;
    title: string;
    body: string;
  }): Promise<string | null>;
}

export interface IFileStorage {
  upload(bucket: string, path: string, file: File | Blob): Promise<{ path: string }>;
  remove(bucket: string, paths: string[]): Promise<void>;
  getPublicUrl(bucket: string, path: string): string;
  signUrl(bucket: string, path: string, expiresIn?: number): Promise<{ url: string }>;
}

export interface IWebhookDispatcher {
  dispatch(eventType: string, payload: Record<string, unknown>): Promise<void>;
}

export interface ICacheAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface ILogger {
  debug(scope: string, message: string, meta?: Record<string, unknown>): void;
  info(scope: string, message: string, meta?: Record<string, unknown>): void;
  warn(scope: string, message: string, meta?: Record<string, unknown>): void;
  error(scope: string, message: string, meta?: Record<string, unknown>): void;
}

export interface IPermissionGuard {
  assert(roles: string[], permission: string): void;
  has(roles: string[], permission: string): boolean;
}

export interface ISecretsManager {
  resolve(name: string): string | undefined;
  require(name: string): string;
  assertBrowserSafe(name: string): void;
}
