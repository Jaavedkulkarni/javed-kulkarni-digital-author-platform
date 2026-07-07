/**
 * Multi-tenant foundation — architecture preparation only.
 * No runtime tenant isolation is implemented in Sprint 02.3C.
 */

export interface TenantContext {
  tenantId: string | null;
  tenantSlug: string | null;
  isMultiTenantEnabled: boolean;
}

export interface TenantScopedResource {
  tenantId: string | null;
}

export interface MultiTenantAdapter {
  resolveTenant(): TenantContext;
  scopeQuery<T extends TenantScopedResource>(resource: T): T;
}

export class DefaultSingleTenantAdapter implements MultiTenantAdapter {
  resolveTenant(): TenantContext {
    return {
      tenantId: null,
      tenantSlug: null,
      isMultiTenantEnabled: false,
    };
  }

  scopeQuery<T extends TenantScopedResource>(resource: T): T {
    return resource;
  }
}

let adapter: MultiTenantAdapter = new DefaultSingleTenantAdapter();

export function getMultiTenantAdapter(): MultiTenantAdapter {
  return adapter;
}

export function setMultiTenantAdapter(next: MultiTenantAdapter): void {
  adapter = next;
}
