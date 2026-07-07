export type SecretKind = 'api_key' | 'token' | 'credential' | 'webhook_secret';

export interface SecretReference {
  kind: SecretKind;
  name: string;
  envKey: string;
}

export class SecretsManager {
  private readonly allowedPrefixes = ['VITE_', 'SUPABASE_'];

  resolve(reference: SecretReference): string | undefined {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      const value = import.meta.env[reference.envKey];
      if (typeof value === 'string' && value.length > 0) return value;
    }
    return undefined;
  }

  require(reference: SecretReference): string {
    const value = this.resolve(reference);
    if (!value) {
      throw new Error(`Missing secret: ${reference.name}`);
    }
    return value;
  }

  isBrowserSafeKey(envKey: string): boolean {
    if (envKey.includes('SERVICE_ROLE') || envKey.includes('SECRET')) return false;
    return this.allowedPrefixes.some((prefix) => envKey.startsWith(prefix));
  }

  assertBrowserSafe(reference: SecretReference): void {
    if (!this.isBrowserSafeKey(reference.envKey)) {
      throw new Error(`Secret ${reference.name} must not be accessed in the browser`);
    }
  }
}

let manager: SecretsManager | null = null;

export function getSecretsManager(): SecretsManager {
  if (!manager) manager = new SecretsManager();
  return manager;
}

export const ENTERPRISE_SECRETS = {
  supabaseAnonKey: { kind: 'api_key' as const, name: 'Supabase Anon Key', envKey: 'VITE_SUPABASE_ANON_KEY' },
  supabaseUrl: { kind: 'api_key' as const, name: 'Supabase URL', envKey: 'VITE_SUPABASE_URL' },
} as const;
