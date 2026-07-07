export type SystemRole = 'super_admin' | 'author' | 'admin' | 'reader' | 'publisher';

export type Permission =
  | 'manage_website'
  | 'manage_authors'
  | 'manage_admins'
  | 'manage_readers'
  | 'manage_books'
  | 'manage_blog'
  | 'manage_categories'
  | 'manage_media'
  | 'manage_products'
  | 'manage_orders'
  | 'manage_newsletter'
  | 'manage_menus'
  | 'manage_homepage'
  | 'manage_seo'
  | 'manage_settings'
  | 'manage_analytics'
  | 'manage_roles'
  | 'manage_own_books'
  | 'manage_own_blog'
  | 'manage_own_media'
  | 'manage_own_categories'
  | 'manage_own_reader_stats'
  | 'read_books'
  | 'read_blog'
  | 'bookmark'
  | 'wishlist'
  | 'subscribe'
  | 'purchase'
  | 'review'
  | 'comment';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar: string | null;
  status: string;
  created_at: string;
}

export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'revoked';

export interface RoleInvitation {
  id: string;
  email: string;
  role_id: string;
  role_name?: SystemRole;
  token: string;
  invited_by: string | null;
  status: InvitationStatus;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
}

export interface AssignRolePayload {
  userId: string;
  role: SystemRole;
  assignedBy?: string;
}

export interface CreateInvitationPayload {
  email: string;
  role: Exclude<SystemRole, 'reader' | 'super_admin'>;
  invitedBy: string;
  expiresInDays?: number;
}
