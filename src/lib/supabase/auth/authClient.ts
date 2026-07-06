import type { AuthChangeEvent, Session, Subscription, User } from '@supabase/supabase-js';
import type { TypedSupabaseClient } from '../clients/browser';

export type AuthStateChangeCallback = (
  event: AuthChangeEvent,
  session: Session | null
) => void;

export class AuthClient {
  constructor(private readonly client: TypedSupabaseClient) {}

  get auth() {
    return this.client.auth;
  }

  async getSession() {
    return this.client.auth.getSession();
  }

  async getUser() {
    return this.client.auth.getUser();
  }

  async signOut() {
    return this.client.auth.signOut();
  }

  async refreshSession() {
    return this.client.auth.refreshSession();
  }

  onAuthStateChange(callback: AuthStateChangeCallback): { data: { subscription: Subscription } } {
    return this.client.auth.onAuthStateChange(callback);
  }

  async setSession(accessToken: string, refreshToken: string) {
    return this.client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  }

  getCurrentUserId(): Promise<string | null> {
    return this.client.auth.getUser().then(({ data }: { data: { user: { id: string } | null } }) => data.user?.id ?? null);
  }

  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await this.client.auth.getUser();
    if (error) return null;
    return data.user;
  }
}

export function createAuthClient(client: TypedSupabaseClient): AuthClient {
  return new AuthClient(client);
}
