import { logger, setLogLevel, getLogLevel, type LogLevel } from '../../lib/utils/logger';
import { CORE_SCOPE } from '../constants/app.constants';

export class GlobalLogger {
  setLevel(level: LogLevel): void {
    setLogLevel(level);
  }

  getLevel(): LogLevel {
    return getLogLevel();
  }

  debug(scope: string, message: string, meta?: unknown): void {
    logger.debug(`${CORE_SCOPE}:${scope}`, message, meta);
  }

  info(scope: string, message: string, meta?: unknown): void {
    logger.info(`${CORE_SCOPE}:${scope}`, message, meta);
  }

  warn(scope: string, message: string, meta?: unknown): void {
    logger.warn(`${CORE_SCOPE}:${scope}`, message, meta);
  }

  error(scope: string, message: string, meta?: unknown): void {
    logger.error(`${CORE_SCOPE}:${scope}`, message, meta);
  }
}

export const globalLogger = new GlobalLogger();
