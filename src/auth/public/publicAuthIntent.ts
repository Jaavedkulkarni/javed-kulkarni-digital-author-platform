export type PublicAuthIntent = 'members-login' | 'become-author' | 'publisher-register';

export type EmailAuthTab = 'sign-in' | 'create-account';

const INTENT_KEY = 'publicAuthIntent';
const EMAIL_TAB_KEY = 'publicAuthEmailTab';
const VERIFIED_EMAIL_KEY = 'verifiedEmailPrefill';
const OAUTH_RESUME_KEY = 'publicAuthOAuthResume';

export function markPublicAuthOAuthResume(): void {
  sessionStorage.setItem(OAUTH_RESUME_KEY, '1');
}

export function peekPublicAuthOAuthResume(): boolean {
  return sessionStorage.getItem(OAUTH_RESUME_KEY) === '1';
}

export function consumePublicAuthOAuthResume(): boolean {
  const value = sessionStorage.getItem(OAUTH_RESUME_KEY) === '1';
  sessionStorage.removeItem(OAUTH_RESUME_KEY);
  return value;
}

export function setPublicAuthIntent(intent: PublicAuthIntent): void {
  sessionStorage.setItem(INTENT_KEY, intent);
}

export function peekPublicAuthIntent(): PublicAuthIntent | null {
  const value = sessionStorage.getItem(INTENT_KEY);
  if (value === 'members-login' || value === 'become-author' || value === 'publisher-register') {
    return value;
  }
  return null;
}

export function consumePublicAuthIntent(): PublicAuthIntent | null {
  const intent = peekPublicAuthIntent();
  sessionStorage.removeItem(INTENT_KEY);
  return intent;
}

export function clearPublicAuthIntent(): void {
  sessionStorage.removeItem(INTENT_KEY);
}

export function setEmailAuthTab(tab: EmailAuthTab): void {
  sessionStorage.setItem(EMAIL_TAB_KEY, tab);
}

export function consumeEmailAuthTab(): EmailAuthTab {
  const value = sessionStorage.getItem(EMAIL_TAB_KEY);
  sessionStorage.removeItem(EMAIL_TAB_KEY);
  return value === 'create-account' ? 'create-account' : 'sign-in';
}

export function peekEmailAuthTab(): EmailAuthTab | null {
  const value = sessionStorage.getItem(EMAIL_TAB_KEY);
  if (value === 'sign-in' || value === 'create-account') return value;
  return null;
}

export function setVerifiedEmailPrefill(email: string): void {
  sessionStorage.setItem(VERIFIED_EMAIL_KEY, email.trim());
}

export function consumeVerifiedEmailPrefill(): string | null {
  const email = sessionStorage.getItem(VERIFIED_EMAIL_KEY);
  sessionStorage.removeItem(VERIFIED_EMAIL_KEY);
  return email?.trim() || null;
}

export function peekVerifiedEmailPrefill(): string | null {
  const email = sessionStorage.getItem(VERIFIED_EMAIL_KEY);
  return email?.trim() || null;
}
