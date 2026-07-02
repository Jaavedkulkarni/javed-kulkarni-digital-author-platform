import { supabase } from './supabase';
import type { CreateInvitationPayload, RoleInvitation, SystemRole, UserProfile } from '../types/roles';

interface RoleRow {
  name: SystemRole;
}

export async function fetchUserRoles(userId: string): Promise<SystemRole[]> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', userId);

  if (error) {
    console.warn('fetchUserRoles failed:', error.message);
    return [];
  }

  const roles = (data ?? [])
    .map((row) => (row.roles as RoleRow | null)?.name)
    .filter((role): role is SystemRole => !!role);

  return roles;
}

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar, status, created_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.warn('fetchUserProfile failed:', error.message);
    return null;
  }

  return data;
}

export async function assignUserRole(userId: string, role: SystemRole, assignedBy?: string): Promise<boolean> {
  const { data: roleRow, error: roleError } = await supabase
    .from('roles')
    .select('id')
    .eq('name', role)
    .maybeSingle();

  if (roleError || !roleRow) {
    console.warn('assignUserRole role lookup failed:', roleError?.message);
    return false;
  }

  const { error } = await supabase.from('user_roles').upsert(
    {
      user_id: userId,
      role_id: roleRow.id,
      assigned_by: assignedBy ?? userId,
    },
    { onConflict: 'user_id,role_id' }
  );

  if (error) {
    console.warn('assignUserRole failed:', error.message);
    return false;
  }

  return true;
}

export async function createRoleInvitation(payload: CreateInvitationPayload): Promise<RoleInvitation | null> {
  const { data: roleRow, error: roleError } = await supabase
    .from('roles')
    .select('id, name')
    .eq('name', payload.role)
    .maybeSingle();

  if (roleError || !roleRow) {
    console.warn('createRoleInvitation role lookup failed:', roleError?.message);
    return null;
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (payload.expiresInDays ?? 7));

  const { data, error } = await supabase
    .from('role_invitations')
    .insert({
      email: payload.email.trim().toLowerCase(),
      role_id: roleRow.id,
      invited_by: payload.invitedBy,
      status: 'pending',
      expires_at: expiresAt.toISOString(),
    })
    .select('id, email, role_id, token, invited_by, status, expires_at, accepted_at, created_at')
    .single();

  if (error) {
    console.warn('createRoleInvitation failed:', error.message);
    return null;
  }

  return { ...data, role_name: roleRow.name as SystemRole };
}

export async function fetchPendingInvitations(): Promise<RoleInvitation[]> {
  const { data, error } = await supabase
    .from('role_invitations')
    .select('id, email, role_id, token, invited_by, status, expires_at, accepted_at, created_at, roles(name)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('fetchPendingInvitations failed:', error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    role_id: row.role_id,
    role_name: (row.roles as RoleRow | null)?.name,
    token: row.token,
    invited_by: row.invited_by,
    status: row.status,
    expires_at: row.expires_at,
    accepted_at: row.accepted_at,
    created_at: row.created_at,
  }));
}

export async function acceptRoleInvitation(token: string, userId: string): Promise<boolean> {
  const { data: invitation, error } = await supabase
    .from('role_invitations')
    .select('id, role_id, status, expires_at, roles(name)')
    .eq('token', token)
    .maybeSingle();

  if (error || !invitation || invitation.status !== 'pending') return false;
  if (new Date(invitation.expires_at).getTime() < Date.now()) return false;

  const roleName = (invitation.roles as RoleRow | null)?.name;
  if (!roleName) return false;

  const assigned = await assignUserRole(userId, roleName);
  if (!assigned) return false;

  const { error: updateError } = await supabase
    .from('role_invitations')
    .update({ status: 'accepted', accepted_at: new Date().toISOString() })
    .eq('id', invitation.id);

  return !updateError;
}
