import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  collectActiveGroupIds,
  filterNavigationGroups,
  filterNavigationItems,
  findFooterItems,
  prepareMainNavigationGroups,
  readExpandedGroups,
  readSidebarCollapsed,
  writeExpandedGroups,
  writeSidebarCollapsed,
} from './sidebar.utils';
import { useNavigation } from '../../../navigation';

export function useSidebarNavigation(searchQuery: string) {
  const { groups, items, loading } = useNavigation();
  const location = useLocation();

  const mainGroups = useMemo(() => prepareMainNavigationGroups(groups), [groups]);

  const filteredGroups = useMemo(
    () => filterNavigationGroups(mainGroups, searchQuery),
    [mainGroups, searchQuery],
  );

  const filteredItems = useMemo(
    () => filterNavigationItems(items, searchQuery),
    [items, searchQuery],
  );

  const footerItems = useMemo(() => findFooterItems(items), [items]);

  const navItems = useMemo(
    () =>
      items.filter(
        (item) => item.action !== 'search' && item.action !== 'logout' && (item.path || item.children.length > 0),
      ),
    [items],
  );

  const activeGroupIds = useMemo(
    () => collectActiveGroupIds(navItems, location.pathname),
    [navItems, location.pathname],
  );

  return {
    groups: mainGroups,
    items,
    filteredGroups,
    filteredItems,
    footerItems,
    loading,
    isEmpty: !loading && items.length === 0,
    activeGroupIds,
  };
}

export function useSidebarUiState(activeGroupIds: string[]) {
  const [collapsed, setCollapsed] = useState(readSidebarCollapsed);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(readExpandedGroups);

  useEffect(() => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      let changed = false;
      for (const id of activeGroupIds) {
        if (!next.has(id)) {
          next.add(id);
          changed = true;
        }
      }
      if (changed) writeExpandedGroups(next);
      return changed ? next : prev;
    });
  }, [activeGroupIds]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      writeSidebarCollapsed(next);
      return next;
    });
  }, []);

  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      writeExpandedGroups(next);
      return next;
    });
  }, []);

  return {
    collapsed,
    expandedGroups,
    toggleCollapsed,
    toggleGroup,
  };
}

export type SidebarNavigationState = ReturnType<typeof useSidebarNavigation>;
export type SidebarUiState = ReturnType<typeof useSidebarUiState>;
