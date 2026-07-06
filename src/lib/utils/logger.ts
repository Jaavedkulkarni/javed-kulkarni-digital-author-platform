export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  silent: 100,
};

let currentLevel: LogLevel = 'warn';

export function setLogLevel(level: LogLevel): void {
  currentLevel = level;
}

export function getLogLevel(): LogLevel {
  return currentLevel;
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[currentLevel];
}

function formatMessage(scope: string, message: string): string {
  return `[AuthorOS:${scope}] ${message}`;
}

export const logger = {
  debug(scope: string, message: string, meta?: unknown): void {
    if (!shouldLog('debug')) return;
    console.debug(formatMessage(scope, message), meta ?? '');
  },

  info(scope: string, message: string, meta?: unknown): void {
    if (!shouldLog('info')) return;
    console.info(formatMessage(scope, message), meta ?? '');
  },

  warn(scope: string, message: string, meta?: unknown): void {
    if (!shouldLog('warn')) return;
    console.warn(formatMessage(scope, message), meta ?? '');
  },

  error(scope: string, message: string, meta?: unknown): void {
    if (!shouldLog('error')) return;
    console.error(formatMessage(scope, message), meta ?? '');
  },
};

export default logger;
