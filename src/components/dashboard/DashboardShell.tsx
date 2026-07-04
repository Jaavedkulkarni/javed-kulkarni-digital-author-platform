import { ReactNode, useState } from 'react';
import type { SiteNavItem } from '../../lib/siteNavigation';
import { useTheme } from '../../context/ThemeContext';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardFooter } from './DashboardFooter';

interface DashboardShellProps {
  children: ReactNode;
  pageTitle: string;
  menuItems: SiteNavItem[];
  roleLabel?: string;
}

export function DashboardShell({
  children,
  pageTitle,
  menuItems,
  roleLabel = 'Reader',
}: DashboardShellProps) {
  const { darkMode, toggleDarkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const pageSurface = darkMode ? 'bg-[#0f1117]' : 'bg-gray-50';
  const mainOffset = sidebarCollapsed ? 'lg:pl-[4.5rem]' : 'lg:pl-64';

  return (
    <div className={`min-h-screen ${pageSurface}`}>
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <DashboardSidebar
        darkMode={darkMode}
        menuItems={menuItems}
        roleLabel={roleLabel}
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
      />

      <div className={`flex min-h-screen flex-col transition-all duration-300 ${mainOffset}`}>
        <DashboardHeader
          darkMode={darkMode}
          pageTitle={pageTitle}
          onToggleDarkMode={toggleDarkMode}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8" id="dashboard-main-content">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>

        <DashboardFooter darkMode={darkMode} />
      </div>
    </div>
  );
}

export default DashboardShell;
