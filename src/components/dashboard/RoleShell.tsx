import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, LogOut } from 'lucide-react';
import type { SiteNavItem } from '../../lib/siteNavigation';
import { findActiveNavItem } from '../../lib/navRendering';

interface RoleShellProps {
  title: string;
  subtitle: string;
  menuItems: SiteNavItem[];
  children: ReactNode;
  pageTitle?: string;
  onLogout: () => Promise<void>;
  logoutRedirect?: string;
}

function renderShellNavItem(item: SiteNavItem, pathname: string, depth = 0): React.ReactNode {
  if (item.children?.length) {
    return (
      <div key={item.id} className="space-y-0.5">
        <p className="px-3 pt-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">{item.label}</p>
        {item.children.map((child) => renderShellNavItem(child, pathname, depth + 1))}
      </div>
    );
  }

  if (!item.path || item.action === 'logout') return null;

  const active = pathname === item.path || (item.path !== '/author' && pathname.startsWith(`${item.path}/`));

  return (
    <Link
      key={item.id}
      to={item.path}
      style={depth > 0 ? { paddingLeft: `${0.75 + depth * 0.75}rem` } : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
        active ? 'bg-gold-500/15 text-gold-400' : 'text-gray-400 hover:text-white hover:bg-navy-800'
      }`}
    >
      <item.icon className="w-4 h-4 flex-shrink-0" />
      {item.label}
    </Link>
  );
}

export function RoleShell({
  title,
  subtitle,
  menuItems,
  children,
  pageTitle,
  onLogout,
  logoutRedirect = '/',
}: RoleShellProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = menuItems.filter((item) => item.action !== 'logout' && (item.path || item.children?.length));
  const activeItem = findActiveNavItem(navItems, location.pathname) ?? navItems[0];

  const handleLogout = async () => {
    await onLogout();
    navigate(logoutRedirect, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex">
      <aside className="hidden lg:flex w-64 bg-navy-900 border-r border-navy-800 flex-col">
        <div className="px-5 py-5 border-b border-navy-800">
          <p className="text-white font-bold text-sm">{title}</p>
          <p className="text-gold-400 text-xs mt-0.5">{subtitle}</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => renderShellNavItem(item, location.pathname))}
        </nav>
        <div className="p-3 border-t border-navy-800">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-navy-800"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-[#0f1117]/95 backdrop-blur border-b border-navy-800 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{subtitle}</p>
            <h1 className="text-white font-semibold text-lg truncate">{pageTitle ?? activeItem?.label ?? title}</h1>
          </div>
          <div className="lg:hidden">
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg text-sm text-red-400 border border-navy-700"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function RolePlaceholder({ heading, description }: { heading: string; description: string }) {
  return (
    <div className="bg-navy-900 border border-navy-800 rounded-xl p-8">
      <div className="flex items-center gap-2 text-gold-400 text-sm mb-3">
        <ChevronRight className="w-4 h-4" />
        Sprint 7 Foundation
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">{heading}</h2>
      <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">{description}</p>
    </div>
  );
}

export default RoleShell;
