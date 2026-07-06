import { LayoutDashboard, FileText, BookOpen, Wallet, Headphones, Megaphone, PenTool, Scale } from 'lucide-react';
import type { NavItem } from '../../utils/navigation';

const ICONS: Record<string, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  content: FileText,
  paperback: BookOpen,
  finance: Wallet,
  support: Headphones,
  marketing: Megaphone,
  'author-services': PenTool,
  legal: Scale,
};

export function buildPlatformAdminMenu(nav: NavItem[]) {
  return nav.map((item) => ({
    id: item.id,
    label: item.label,
    path: item.path,
    icon: ICONS[item.id] ?? LayoutDashboard,
  }));
}
