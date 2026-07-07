import { getBrowserClient } from './supabase/clients/browser';

/** Shared browser Supabase singleton — auth, contexts, organization, and RPCs. */
export const supabase = getBrowserClient();

// Helper to get user IP for likes/bookmarks
export async function getUserIP(): Promise<string> {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip || 'anonymous';
  } catch {
    return 'anonymous';
  }
}
