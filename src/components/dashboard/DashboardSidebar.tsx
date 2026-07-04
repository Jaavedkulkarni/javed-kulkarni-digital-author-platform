import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { SiteNavItem } from '../../lib/siteNavigation';
import { isDashboardPlaceholderPath } from '../../lib/dashboardNavigation';

interface DashboardSidebarProps {
  darkMode: boolean;
  menuItems: SiteNavItem[];
  roleLabel: string;
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}

function isNavActive(pathname: string, path: string): boolean {
  if (path === '/reader') {
    return pathname === '/reader' || pathname === '/reader/dashboard';
  }
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function DashboardSidebar({
  darkMode,
  menuItems,
  roleLabel,
  open,
  collapsed,
  onClose,
  onToggleCollapse,
}: DashboardSidebarProps) {
  const location = useLocation();
  const navItems = menuItems.filter((item) => item.action !== 'logout' && item.path);

  const sidebarSurface = darkMode ? 'bg-navy-900 border-navy-800' : 'bg-white border-gray-200';
  const itemIdle = darkMode
    ? 'text-gray-400 hover:text-white hover:bg-navy-800'
    : 'text-gray-600 hover:text-navy-800 hover:bg-gray-100';
  const itemActive = darkMode
    ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20'
    : 'bg-gold-50 text-gold-700 border border-gold-200';

  return (
    <aside
      aria-label="Dashboard navigation"
      className={`fixed top-0 left-0 z-40 flex h-screen flex-col border-r transition-all duration-300 ${sidebarSurface} ${
        collapsed ? 'w-[4.5rem]' : 'w-64'
      } ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
    >
      <div
        className={`flex items-center gap-3 border-b px-4 py-5 ${darkMode ? 'border-navy-800' : 'border-gray-200'} ${
          collapsed ? 'justify-center px-2' : ''
        }`}
      >
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-lg font-bold text-navy-900">
          ज
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className={`truncate text-sm font-bold ${darkMode ? 'text-white' : 'text-navy-800'}`}>
              जावेद कुलकर्णी
            </p>
            <p className="mt-0.5 truncate text-xs text-gold-500">{roleLabel}</p>
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          className={`rounded p-1 lg:hidden ${darkMode ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-navy-800'}`}
          aria-label="Close navigation menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const placeholder = isDashboardPlaceholderPath(item.path);
          const active = !placeholder && item.path ? isNavActive(location.pathname, item.path) : false;
          const className = `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400/50 ${
            active ? itemActive : itemIdle
          } ${collapsed ? 'justify-center px-2' : ''}`;

          if (placeholder) {
            return (
              <button
                key={item.id}
                type="button"
                disabled
                aria-disabled="true"
                title={collapsed ? item.label : undefined}
                className={`${className} w-full cursor-not-allowed opacity-60`}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          }

          return (
            <Link
              key={item.id}
              to={item.path!}
              onClick={onClose}
              title={collapsed ? item.label : undefined}
              aria-current={active ? 'page' : undefined}
              className={className}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={`hidden border-t p-3 lg:block ${darkMode ? 'border-navy-800' : 'border-gray-200'}`}>
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gold-400/50 ${
            darkMode ? 'text-gray-400 hover:bg-navy-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-navy-800'
          }`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
