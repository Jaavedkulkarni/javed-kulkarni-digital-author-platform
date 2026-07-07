import type { LucideIcon } from 'lucide-react';
import type { SystemRole } from '../types/roles';
import type { RolePermission } from '../roles/types/permission.types';

/** Assigned platform role required to surface a navigation entry. */
export type NavigationRole = SystemRole;

/** Permission key from the centralized registry or platform-admin department strings. */
export type NavigationPermission = RolePermission | string;

/** Logical surface grouping for registry organization and builder merge order. */
export type NavigationSection =
  | 'common'
  | 'reader'
  | 'author'
  | 'platform_admin'
  | 'super_admin'
  | 'publisher';

/** Optional badge metadata for sidebar labels. */
export interface NavigationBadge {
  label: string;
  variant?: 'default' | 'info' | 'warning' | 'danger';
  count?: number;
}

/** Single navigable entry in the AuthorOS unified sidebar. */
export interface NavigationItem {
  id: string;
  title: string;
  icon: LucideIcon;
  path: string;
  children: NavigationItem[];
  requiredRoles: NavigationRole[];
  requiredPermissions: NavigationPermission[];
  sortOrder: number;
  isVisible: boolean;
  isEnabled: boolean;
  section: NavigationSection;
  badge?: NavigationBadge;
  description?: string;
  action?: 'logout' | 'search';
}

/** Grouped navigation entries rendered as a labeled sidebar section. */
export interface NavigationGroup {
  id: string;
  title: string;
  items: NavigationItem[];
  sortOrder: number;
  isVisible: boolean;
  section: NavigationSection;
}

/** Complete navigation registry for all AuthorOS surfaces. */
export interface NavigationRegistry {
  version: string;
  sections: Record<NavigationSection, NavigationGroup[]>;
  items: NavigationItem[];
}

/** Runtime context used by the builder and hooks to resolve dynamic navigation. */
export interface NavigationBuildContext {
  roles: SystemRole[];
  permissions?: NavigationPermission[];
}

/** Output of a full navigation build. */
export interface BuiltNavigation {
  items: NavigationItem[];
  groups: NavigationGroup[];
}

type NavigationItemInput = Omit<NavigationItem, 'children'> & { children?: NavigationItem[] };

/** Factory ensuring every registry entry satisfies the locked schema. */
export function defineNavigationItem(input: NavigationItemInput): NavigationItem {
  return {
    children: [],
    requiredPermissions: [],
    isVisible: true,
    isEnabled: true,
    ...input,
    children: input.children ?? [],
  };
}

/** Factory for navigation groups. */
export function defineNavigationGroup(
  input: Omit<NavigationGroup, 'items'> & { items: NavigationItem[] },
): NavigationGroup {
  return {
    isVisible: true,
    ...input,
  };
}
