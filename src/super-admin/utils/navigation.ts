import {
  LayoutDashboard,
  Users,
  Building2,
  PenTool,
  Shield,
  Briefcase,
  Settings,
  Lock,
  BarChart3,
  Brain,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SUPER_ADMIN_BASE_PATH } from '../constants/superAdmin.constants';

export interface SuperAdminNavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
}

export const SUPER_ADMIN_NAV: SuperAdminNavItem[] = [
  { id: 'dashboard', label: 'Executive', path: SUPER_ADMIN_BASE_PATH, icon: LayoutDashboard },
  { id: 'people', label: 'People', path: `${SUPER_ADMIN_BASE_PATH}/people`, icon: Users },
  { id: 'publishers', label: 'Publishers', path: `${SUPER_ADMIN_BASE_PATH}/publishers`, icon: Building2 },
  { id: 'authors', label: 'Authors', path: `${SUPER_ADMIN_BASE_PATH}/authors`, icon: PenTool },
  { id: 'platform-admins', label: 'Platform Admins', path: `${SUPER_ADMIN_BASE_PATH}/platform-admins`, icon: Shield },
  { id: 'business', label: 'Business', path: `${SUPER_ADMIN_BASE_PATH}/business`, icon: Briefcase },
  { id: 'platform', label: 'Platform', path: `${SUPER_ADMIN_BASE_PATH}/platform`, icon: Settings },
  { id: 'security', label: 'Security', path: `${SUPER_ADMIN_BASE_PATH}/security`, icon: Lock },
  { id: 'analytics', label: 'Analytics', path: `${SUPER_ADMIN_BASE_PATH}/analytics`, icon: BarChart3 },
  { id: 'mindwave', label: 'MindWave AI', path: `${SUPER_ADMIN_BASE_PATH}/mindwave`, icon: Brain },
];
