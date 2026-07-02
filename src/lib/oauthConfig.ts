export type OAuthProvider = 'google' | 'azure' | 'facebook';

function envFlag(key: string, defaultValue = true): boolean {
  const value = import.meta.env[key];
  if (value === undefined || value === '') return defaultValue;
  return value === 'true' || value === '1';
}

export function isOAuthProviderEnabled(provider: OAuthProvider): boolean {
  switch (provider) {
    case 'google':
      return envFlag('VITE_OAUTH_GOOGLE_ENABLED', true);
    case 'azure':
      return envFlag('VITE_OAUTH_AZURE_ENABLED', true);
    case 'facebook':
      return envFlag('VITE_OAUTH_FACEBOOK_ENABLED', true);
    default:
      return true;
  }
}

export function isProviderNotEnabledError(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes('not enabled') || lower.includes('unsupported provider');
}

export function oauthUnavailableMessage(provider: OAuthProvider): string {
  if (provider === 'google') return 'Google Sign In is temporarily unavailable.';
  if (provider === 'azure') return 'Microsoft Sign In is temporarily unavailable.';
  return 'Facebook Sign In is temporarily unavailable.';
}
