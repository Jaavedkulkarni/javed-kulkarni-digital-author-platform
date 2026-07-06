import { useContext } from 'react';
import { useRoles as useAppRoles } from '../../context/RoleContext';
import { OrganizationRoleContext } from '../contexts/RoleContext';

export function useRoles() {
  const appRoles = useAppRoles();
  const orgRoles = useContext(OrganizationRoleContext);

  return {
    ...appRoles,
    roleContext: orgRoles?.roleContext ?? null,
    assignments: orgRoles?.assignments ?? [],
    orgRolesLoading: orgRoles?.isLoading ?? false,
    refreshOrgRoles: orgRoles?.refresh ?? (async () => {}),
  };
}

export { useAppRoles as useLegacyRoles };
