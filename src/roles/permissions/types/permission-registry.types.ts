import type { SystemRole } from '../../../types/roles';
import type { PermissionAction, PermissionGroup, PermissionModule } from './permission.types';

/** Canonical registry entry for a single AuthorOS permission. */
export interface PermissionDefinition {
  id: string;
  key: string;
  title: string;
  description: string;
  module: PermissionModule;
  resource: string;
  action: PermissionAction;
  group: PermissionGroup;
  isSystem: boolean;
  isActive: boolean;
}

/** Immutable permission registry envelope. */
export interface PermissionRegistry {
  version: string;
  permissions: Readonly<Record<string, Readonly<PermissionDefinition>>>;
  keys: readonly string[];
}

/** Immutable role-to-permission mapping keyed by system role. */
export type RolePermissionMap = Readonly<Record<SystemRole, readonly string[]>>;

/** Result of a permission validation operation. */
export interface PermissionValidationResult {
  valid: boolean;
  errors: string[];
}

/** Runtime resolver input. */
export interface PermissionResolverContext {
  roles: SystemRole[];
}

type PermissionDefinitionInput = Omit<PermissionDefinition, 'id' | 'module' | 'resource' | 'action'> & {
  key: string;
};

/** Factory ensuring every registry entry satisfies the locked schema. */
export function definePermission(input: PermissionDefinitionInput): Readonly<PermissionDefinition> {
  const parts = input.key.split('.');
  const action = (parts.length === 2 ? 'access' : parts[parts.length - 1]) as PermissionDefinition['action'];
  const module = parts[0] as PermissionModule;
  const resource = parts.length === 2 ? parts[1] : parts.slice(1, -1).join('.');

  return Object.freeze({
    id: input.key.replace(/\./g, '-'),
    module,
    resource,
    action,
    isSystem: true,
    isActive: true,
    ...input,
  });
}
