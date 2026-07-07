import type { JsonDiffEntry } from './timeline.types';
import { isSensitiveKey, maskSensitiveValue } from './mask-sensitive';

function sanitizeDiffValue(path: string, value: unknown): unknown {
  const key = path.split('.').pop() ?? path;
  if (isSensitiveKey(key)) return maskSensitiveValue(value);
  return value;
}

export function buildJsonDiff(
  before: Record<string, unknown> | null | undefined,
  after: Record<string, unknown> | null | undefined,
  hideUnchanged = true,
): JsonDiffEntry[] {
  const left = before ?? {};
  const right = after ?? {};
  const paths = new Set([...collectPaths(left), ...collectPaths(right)]);
  const entries: JsonDiffEntry[] = [];

  for (const path of paths) {
    const beforeValue = getPath(left, path);
    const afterValue = getPath(right, path);
    const beforeExists = beforeValue !== undefined;
    const afterExists = afterValue !== undefined;

    if (!beforeExists && afterExists) {
      entries.push({
        path,
        type: 'added',
        after: sanitizeDiffValue(path, afterValue),
      });
      continue;
    }
    if (beforeExists && !afterExists) {
      entries.push({
        path,
        type: 'removed',
        before: sanitizeDiffValue(path, beforeValue),
      });
      continue;
    }
    if (JSON.stringify(beforeValue) !== JSON.stringify(afterValue)) {
      entries.push({
        path,
        type: 'modified',
        before: sanitizeDiffValue(path, beforeValue),
        after: sanitizeDiffValue(path, afterValue),
      });
      continue;
    }
    if (!hideUnchanged) {
      entries.push({ path, type: 'unchanged', before: beforeValue, after: afterValue });
    }
  }

  return entries.sort((a, b) => a.path.localeCompare(b.path));
}

function collectPaths(value: Record<string, unknown>, prefix = ''): string[] {
  const paths: string[] = [];
  for (const [key, nested] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    paths.push(path);
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
      paths.push(...collectPaths(nested as Record<string, unknown>, path));
    }
  }
  return paths;
}

function getPath(source: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, segment) => {
    if (!acc || typeof acc !== 'object') return undefined;
    return (acc as Record<string, unknown>)[segment];
  }, source);
}
