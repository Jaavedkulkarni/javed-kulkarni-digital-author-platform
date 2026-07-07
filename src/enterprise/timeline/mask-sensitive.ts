const SENSITIVE_KEY_PATTERN =
  /password|token|secret|recovery|mfa|api[_-]?key|service[_-]?key|authorization|credential|private/i;

export function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEY_PATTERN.test(key);
}

export function maskSensitiveValue(value: unknown): unknown {
  if (value == null) return value;
  if (typeof value === 'string') {
    if (value.length <= 4) return '••••';
    return `${value.slice(0, 2)}••••${value.slice(-2)}`;
  }
  return '••••••••';
}

export function maskSensitiveData<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map((item) => maskSensitiveData(item)) as T;
  }
  if (input && typeof input === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      if (isSensitiveKey(key)) {
        result[key] = maskSensitiveValue(value);
      } else if (value && typeof value === 'object') {
        result[key] = maskSensitiveData(value);
      } else {
        result[key] = value;
      }
    }
    return result as T;
  }
  return input;
}
