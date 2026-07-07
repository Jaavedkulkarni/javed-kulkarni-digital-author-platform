import {
  BarChart3,
  BookOpen,
  ClipboardList,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  PenTool,
} from 'lucide-react';
import type { SiteNavItem } from './siteNavigation';

/** Scalable author content types — add future types here without changing top-level nav. */
export const AUTHOR_CONTENT_NAV: SiteNavItem[] = [
  { id: 'author-content-books', label: 'Books', path: '/author/books', icon: BookOpen },
  { id: 'author-content-blogs', label: 'Blogs', path: '/author/blogs', icon: PenTool },
  { id: 'author-content-articles', label: 'Articles', path: '/author/articles', icon: FileText },
  { id: 'author-content-poems', label: 'Poems', path: '/author/poems', icon: FileText },
  { id: 'author-content-stories', label: 'Stories', path: '/author/stories', icon: FileText },
];

/** Author shell menu — Dashboard, Content group, Drafts, Analytics. */
export const AUTHOR_SHELL_MENU: SiteNavItem[] = [
  { id: 'author-dashboard', label: 'Author Dashboard', path: '/author', icon: LayoutDashboard },
  { id: 'author-content', label: 'Content', icon: FolderOpen, children: AUTHOR_CONTENT_NAV },
  { id: 'author-drafts', label: 'Drafts', path: '/author/drafts', icon: ClipboardList },
  { id: 'author-analytics', label: 'Analytics', path: '/author/analytics', icon: BarChart3 },
  { id: 'logout', label: 'Logout', icon: LogOut, action: 'logout' },
];

export const AUTHOR_PUBLIC_MENU: SiteNavItem[] = AUTHOR_SHELL_MENU.filter((item) => item.action !== 'logout');
