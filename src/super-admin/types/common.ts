export type SuperAdminOperationResult<T = void> = {
  success: boolean;
  data?: T;
  errors?: string[];
};

export type EntityStatus = 'active' | 'suspended' | 'pending' | 'verified' | 'rejected';

export type SystemHealthStatus = 'healthy' | 'degraded' | 'down';
