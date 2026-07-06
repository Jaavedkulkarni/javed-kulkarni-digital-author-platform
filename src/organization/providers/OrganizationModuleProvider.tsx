import type { ReactNode } from 'react';
import { OrganizationProvider } from './OrganizationProvider';
import { WorkspaceProvider } from './WorkspaceProvider';
import { OrganizationPermissionProvider } from './PermissionProvider';
import { OrganizationRoleProvider } from './RoleProvider';

export function OrganizationModuleProvider({ children }: { children: ReactNode }) {
  return (
    <OrganizationProvider>
      <OrganizationRoleProvider>
        <WorkspaceProvider>
          <OrganizationPermissionProvider>{children}</OrganizationPermissionProvider>
        </WorkspaceProvider>
      </OrganizationRoleProvider>
    </OrganizationProvider>
  );
}
