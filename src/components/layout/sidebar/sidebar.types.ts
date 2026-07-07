import type { NavigationGroup, NavigationItem } from '../../navigation/types';

export interface SidebarProps {
  /** Controlled mobile drawer visibility. */
  open?: boolean;
  /** Called when the mobile drawer should close. */
  onClose?: () => void;
  /** Override theme — defaults to dark when ThemeProvider is unavailable. */
  darkMode?: boolean;
  /** Optional className on the root aside element. */
  className?: string;
}

export interface SidebarNavContext {
  darkMode: boolean;
  collapsed: boolean;
  searchQuery: string;
  expandedGroups: ReadonlySet<string>;
  onToggleGroup: (groupId: string) => void;
  onNavigate?: () => void;
}

export interface SidebarGroupProps {
  group: NavigationGroup;
  context: SidebarNavContext;
  depth?: number;
}

export interface SidebarItemProps {
  item: NavigationItem;
  context: SidebarNavContext;
  depth?: number;
}

export interface SidebarUserCardProps {
  darkMode: boolean;
  collapsed: boolean;
}

export interface SidebarSearchProps {
  darkMode: boolean;
  collapsed: boolean;
  value: string;
  onChange: (value: string) => void;
}

export interface SidebarCollapseProps {
  darkMode: boolean;
  collapsed: boolean;
  onToggle: () => void;
}

export interface SidebarFooterProps {
  darkMode: boolean;
  collapsed: boolean;
  items: NavigationItem[];
  onNavigate?: () => void;
}

export interface SidebarHeaderProps {
  darkMode: boolean;
  collapsed: boolean;
  onClose?: () => void;
}

export interface SidebarContentProps {
  groups: NavigationGroup[];
  context: SidebarNavContext;
  hasSearch: boolean;
}

export interface SidebarSectionTitleProps {
  title: string;
  darkMode: boolean;
  collapsed: boolean;
}

export interface SidebarEmptyProps {
  darkMode: boolean;
}

export interface SidebarLoadingProps {
  darkMode: boolean;
  collapsed: boolean;
}

export interface SidebarErrorProps {
  darkMode: boolean;
  message?: string;
  onRetry?: () => void;
}
