import { FormEvent, memo, type ReactNode } from 'react';
import type { PermissionAction, PermissionResource, RolePermission } from '../../types/permission.types';
import { buildActionPermission } from '../../constants/actionPermissions';
import { usePermissionContext } from '../providers/PermissionProvider';
import { Forbidden } from './Forbidden';

interface PermissionFormProps {
  resource: PermissionResource;
  action: PermissionAction;
  permission?: RolePermission;
  children: ReactNode;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  blockRender?: boolean;
}

export const PermissionForm = memo(function PermissionForm({
  resource,
  action,
  permission,
  children,
  onSubmit,
  blockRender = true,
}: PermissionFormProps) {
  const ctx = usePermissionContext();
  const required = permission ?? buildActionPermission(resource, action);
  const allowed = ctx.isAuthenticated && !ctx.isLoading && ctx.hasPermission(required);

  if (ctx.isLoading) return null;
  if (!ctx.isAuthenticated || (!allowed && blockRender)) return <Forbidden />;

  return (
    <form
      onSubmit={(event) => {
        if (!allowed) {
          event.preventDefault();
          return;
        }
        onSubmit?.(event);
      }}
    >
      <fieldset disabled={!allowed}>{children}</fieldset>
    </form>
  );
});

export default PermissionForm;
