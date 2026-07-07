import { memo } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { useRoles } from '../../../context/RoleContext';
import { createRoleResolver } from '../../../roles/services/role-resolver.service';
import { SYSTEM_ROLE_LABELS } from '../../../roles/constants/role.constants';
import { findProfileItem, getInitials } from './sidebar.utils';
import type { SidebarUserCardProps } from './sidebar.types';
import type { NavigationItem } from '../../../navigation/types';

interface SidebarUserCardWithNavProps extends SidebarUserCardProps {
  items: NavigationItem[];
  onNavigate?: () => void;
}

export const SidebarUserCard = memo(function SidebarUserCard({
  darkMode,
  collapsed,
  items,
  onNavigate,
}: SidebarUserCardWithNavProps) {
  const { profile, roles, loading } = useRoles();
  const resolver = createRoleResolver(roles);
  const effectiveRoles = resolver.getEffectiveRoles();
  const profileItem = findProfileItem(items);
  const displayName = profile?.full_name ?? profile?.email ?? 'User';
  const initials = getInitials(profile?.full_name, profile?.email);

  if (loading) {
    return (
      <div
        className={`mx-3 mb-3 animate-pulse rounded-xl border p-3 ${
          darkMode ? 'border-navy-700 bg-navy-800/50' : 'border-gray-200 bg-gray-50'
        }`}
        aria-hidden="true"
      >
        <div className={`mb-2 h-10 w-10 rounded-full ${darkMode ? 'bg-navy-700' : 'bg-gray-200'}`} />
        <div className={`h-3 w-24 rounded ${darkMode ? 'bg-navy-700' : 'bg-gray-200'}`} />
      </div>
    );
  }

  const cardShell = `mx-3 mb-3 rounded-xl border p-3 ${
    darkMode ? 'border-navy-700 bg-navy-800/50' : 'border-gray-200 bg-gray-50'
  } ${collapsed ? 'flex justify-center px-2' : ''}`;

  const profileButton = profileItem ? (
    <Link
      to={profileItem.path}
      onClick={onNavigate}
      title={collapsed ? 'Profile' : undefined}
      className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/50 ${
        darkMode
          ? 'bg-navy-900/60 text-gray-300 hover:bg-navy-700 hover:text-white'
          : 'bg-white text-navy-800 hover:bg-gray-100'
      }`}
    >
      <User className="h-3.5 w-3.5" aria-hidden="true" />
      {!collapsed ? 'Profile' : null}
    </Link>
  ) : null;

  if (collapsed) {
    return (
      <div className={cardShell}>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/15 text-xs font-semibold text-gold-400 ring-1 ring-gold-500/30"
          title={displayName}
          aria-label={displayName}
        >
          {initials}
        </div>
      </div>
    );
  }

  return (
    <div className={cardShell}>
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-xs font-semibold text-gold-400 ring-1 ring-gold-500/30"
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className={`truncate text-sm font-semibold ${darkMode ? 'text-white' : 'text-navy-800'}`}>
            {displayName}
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {effectiveRoles.slice(0, 3).map((role) => (
              <span
                key={role}
                className="rounded-full bg-gold-500/10 px-2 py-0.5 text-[10px] font-medium text-gold-400"
              >
                {SYSTEM_ROLE_LABELS[role]}
              </span>
            ))}
          </div>
        </div>
      </div>
      {profileButton ? <div className="mt-3">{profileButton}</div> : null}
    </div>
  );
});

export default SidebarUserCard;
