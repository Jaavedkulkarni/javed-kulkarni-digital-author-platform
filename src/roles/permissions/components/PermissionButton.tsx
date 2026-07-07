import { cloneElement, isValidElement, memo, type ReactElement, type ReactNode } from 'react';
import type { PermissionAction, PermissionResource } from '../../types/permission.types';
import { buildActionPermission } from '../../constants/actionPermissions';
import { usePermissionContext } from '../providers/PermissionProvider';

interface PermissionButtonProps {
  resource: PermissionResource;
  action: PermissionAction;
  children: ReactElement<{ disabled?: boolean; title?: string }>;
  hideWhenDenied?: boolean;
  deniedTitle?: string;
}

export const PermissionButton = memo(function PermissionButton({
  resource,
  action,
  children,
  hideWhenDenied = false,
  deniedTitle = 'You do not have permission for this action.',
}: PermissionButtonProps) {
  const ctx = usePermissionContext();
  const permission = buildActionPermission(resource, action);
  const allowed = ctx.isAuthenticated && !ctx.isLoading && ctx.hasPermission(permission);

  if (!allowed && hideWhenDenied) return null;
  if (!isValidElement(children)) return children as ReactNode;

  return cloneElement(children, {
    disabled: children.props.disabled || ctx.isLoading || !allowed,
    title: !allowed ? deniedTitle : children.props.title,
  });
});

export default PermissionButton;
