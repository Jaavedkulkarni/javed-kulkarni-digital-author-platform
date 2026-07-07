export const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '0',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export function applySecurityHeaders(headers: HeadersInit = {}): HeadersInit {
  return { ...SECURITY_HEADERS, ...headers };
}

export function sanitizeString(value: string, maxLength = 10_000): string {
  // Remove ASCII control characters (0x00-0x1F and 0x7F)
  let result = '';
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code >= 32 && code !== 127) {
      result += value[i];
    }
  }
  return result.trim().slice(0, maxLength);
}

export function sanitizeRecord(input: Record<string, unknown>): Record<string, unknown> {
  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === 'string') {
      output[key] = sanitizeString(value);
    } else if (value !== undefined) {
      output[key] = value;
    }
  }
  return output;
}
