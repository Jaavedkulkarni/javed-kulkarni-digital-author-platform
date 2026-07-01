import { supabase } from './supabase';
import type { ReaderProfile } from '../types/reader';

export async function fetchReaderProfile(userId: string): Promise<ReaderProfile | null> {
  const { data, error } = await supabase
    .from('reader_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data as ReaderProfile | null;
}

export async function ensureReaderProfile(
  userId: string,
  defaults?: { full_name?: string; display_name?: string }
): Promise<ReaderProfile> {
  const existing = await fetchReaderProfile(userId);
  if (existing) return existing;

  const { data, error } = await supabase
    .from('reader_profiles')
    .insert({
      id: userId,
      full_name: defaults?.full_name ?? null,
      display_name: defaults?.display_name ?? null,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as ReaderProfile;
}

export async function updateReaderProfile(
  userId: string,
  patch: Partial<
    Pick<ReaderProfile, 'full_name' | 'display_name' | 'mobile' | 'avatar' | 'language'>
  >
): Promise<ReaderProfile> {
  const { data, error } = await supabase
    .from('reader_profiles')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select('*')
    .single();

  if (error) throw error;
  return data as ReaderProfile;
}

export async function touchReaderLastLogin(userId: string): Promise<void> {
  await supabase
    .from('reader_profiles')
    .update({ last_login: new Date().toISOString() })
    .eq('id', userId);
}
