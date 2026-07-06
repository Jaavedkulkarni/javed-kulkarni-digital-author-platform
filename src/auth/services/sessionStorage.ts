import type { StoredAuthSession } from '../types/auth.types';

const PERSISTENT_SESSION_KEY = 'authoros_auth_session';
const TEMP_SESSION_KEY = 'authoros_auth_session_temp';
const RETURN_TO_KEY = 'authoros_auth_return_to';

function getStorage(persistent: boolean): Storage | null {
  if (typeof window === 'undefined') return null;
  return persistent ? window.localStorage : window.sessionStorage;
}

export function saveAuthSession(session: StoredAuthSession): void {
  const storage = getStorage(session.rememberMe);
  const fallback = getStorage(!session.rememberMe);

  if (!storage) return;

  const serialized = JSON.stringify(session);
  storage.setItem(session.rememberMe ? PERSISTENT_SESSION_KEY : TEMP_SESSION_KEY, serialized);

  if (fallback) {
    fallback.removeItem(session.rememberMe ? TEMP_SESSION_KEY : PERSISTENT_SESSION_KEY);
  }
}

export function loadAuthSession(): StoredAuthSession | null {
  if (typeof window === 'undefined') return null;

  const persistentRaw = window.localStorage.getItem(PERSISTENT_SESSION_KEY);
  const tempRaw = window.sessionStorage.getItem(TEMP_SESSION_KEY);
  const raw = persistentRaw ?? tempRaw;

  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredAuthSession;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;

  window.localStorage.removeItem(PERSISTENT_SESSION_KEY);
  window.sessionStorage.removeItem(TEMP_SESSION_KEY);
}

export function storeAuthReturnTo(path: string): void {
  if (typeof window === 'undefined') return;
  if (!path.startsWith('/')) return;
  window.sessionStorage.setItem(RETURN_TO_KEY, path);
}

export function consumeAuthReturnTo(): string | null {
  if (typeof window === 'undefined') return null;

  const path = window.sessionStorage.getItem(RETURN_TO_KEY);
  window.sessionStorage.removeItem(RETURN_TO_KEY);
  return path;
}

export function peekAuthReturnTo(): string | null {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage.getItem(RETURN_TO_KEY);
}
