import { memo, useMemo, useState } from 'react';
import { SidebarHeader } from './SidebarHeader';
import { SidebarSearch } from './SidebarSearch';
import { SidebarContent } from './SidebarContent';
import { SidebarUserCard } from './SidebarUserCard';
import { SidebarFooter } from './SidebarFooter';
import { SidebarCollapse } from './SidebarCollapse';
import { SidebarLoading } from './SidebarLoading';
import { useSidebarNavigation, useSidebarUiState } from './useSidebarState';
import type { SidebarNavContext, SidebarProps } from './sidebar.types';

function readDarkModePreference(fallback: boolean): boolean {
  if (typeof window === 'undefined') return fallback;
  const saved = localStorage.getItem('darkMode');
  return saved ? (JSON.parse(saved) as boolean) : fallback;
}

export const Sidebar = memo(function Sidebar({
  open = false,
  onClose,
  darkMode: darkModeProp = readDarkModePreference(true),
  className = '',
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    groups,
    items,
    filteredGroups,
    footerItems,
    loading,
    isEmpty,
    activeGroupIds,
  } = useSidebarNavigation(searchQuery);

  const { collapsed, expandedGroups, toggleCollapsed, toggleGroup } = useSidebarUiState(activeGroupIds);

  const hasSearch = searchQuery.trim().length > 0;
  const displayGroups = hasSearch ? filteredGroups : groups;

  const navContext = useMemo<SidebarNavContext>(
    () => ({
      darkMode: darkModeProp,
      collapsed,
      searchQuery,
      expandedGroups,
      onToggleGroup: toggleGroup,
      onNavigate: onClose,
    }),
    [darkModeProp, collapsed, searchQuery, expandedGroups, toggleGroup, onClose],
  );

  const sidebarSurface = darkModeProp ? 'bg-navy-900 border-navy-800' : 'bg-white border-gray-200';

  return (
    <aside
      aria-label="Platform navigation"
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r transition-all duration-300 ${sidebarSurface} ${
        collapsed ? 'w-[4.5rem]' : 'w-64'
      } ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${className}`}
    >
      <SidebarHeader darkMode={darkModeProp} collapsed={collapsed} onClose={onClose} />

      <SidebarSearch
        darkMode={darkModeProp}
        collapsed={collapsed}
        value={searchQuery}
        onChange={setSearchQuery}
      />

      <div className="flex-1 overflow-y-auto px-1 py-2">
        {loading ? (
          <SidebarLoading darkMode={darkModeProp} collapsed={collapsed} />
        ) : isEmpty && !hasSearch ? (
          <SidebarContent groups={[]} context={navContext} hasSearch={false} />
        ) : (
          <SidebarContent groups={displayGroups} context={navContext} hasSearch={hasSearch} />
        )}
      </div>

      <SidebarUserCard
        darkMode={darkModeProp}
        collapsed={collapsed}
        items={items}
        onNavigate={onClose}
      />

      <SidebarFooter
        darkMode={darkModeProp}
        collapsed={collapsed}
        items={footerItems}
        onNavigate={onClose}
      />

      <SidebarCollapse darkMode={darkModeProp} collapsed={collapsed} onToggle={toggleCollapsed} />
    </aside>
  );
});

export default Sidebar;
