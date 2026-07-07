import { useMemo, type ReactNode } from 'react';
import type { PermissionAction, PermissionResource, RolePermission } from '../../types/permission.types';
import { buildActionPermission } from '../../constants/actionPermissions';
import { usePermissionContext } from '../providers/PermissionProvider';

export interface PermissionTableColumn<T> {
  id: string;
  permission?: RolePermission;
  resource?: PermissionResource;
  action?: PermissionAction;
  render: (row: T) => ReactNode;
}

export interface PermissionTableAction {
  id: string;
  permission?: RolePermission;
  resource?: PermissionResource;
  action?: PermissionAction;
}

export function usePermissionTable<T>(
  columns: PermissionTableColumn<T>[],
  actions: PermissionTableAction[] = [],
  bulkActions: PermissionTableAction[] = []
) {
  const ctx = usePermissionContext();

  return useMemo(() => {
    const resolvePermission = (item: {
      permission?: RolePermission;
      resource?: PermissionResource;
      action?: PermissionAction;
    }) => {
      if (item.permission) return item.permission;
      if (item.resource && item.action) return buildActionPermission(item.resource, item.action);
      return null;
    };

    const visibleColumns = columns.filter((column) => {
      const permission = resolvePermission(column);
      if (!permission) return true;
      return ctx.hasPermission(permission);
    });

    const visibleActions = actions.filter((actionItem) => {
      const permission = resolvePermission(actionItem);
      if (!permission) return true;
      return ctx.hasPermission(permission);
    });

    const visibleBulkActions = bulkActions.filter((actionItem) => {
      const permission = resolvePermission(actionItem);
      if (!permission) return true;
      return ctx.hasPermission(permission);
    });

    return {
      columns: visibleColumns,
      actions: visibleActions,
      bulkActions: visibleBulkActions,
      isLoading: ctx.isLoading,
    };
  }, [ctx, columns, actions, bulkActions]);
}
