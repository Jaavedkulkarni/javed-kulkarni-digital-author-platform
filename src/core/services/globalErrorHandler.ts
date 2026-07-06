import {
  SupabaseServiceError,
  getErrorMessage,
  normalizeSupabaseError,
} from '../../lib/utils/errors';
import { globalLogger } from './globalLogger';
import { auditLogger } from './auditLogger';
import { CORE_LOG_SCOPES, AUDIT_ACTIONS } from '../constants/app.constants';

export interface ErrorContext {
  scope?: string;
  operation?: string;
  actorId?: string;
  metadata?: Record<string, unknown>;
}

export interface HandledError {
  message: string;
  code?: string;
  source?: string;
  original: unknown;
  handledAt: string;
}

export type ErrorHandler = (error: HandledError, context?: ErrorContext) => void;

export class GlobalErrorHandler {
  private handlers: ErrorHandler[] = [];

  register(handler: ErrorHandler): () => void {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter((entry) => entry !== handler);
    };
  }

  handle(error: unknown, context: ErrorContext = {}): HandledError {
    const scope = context.scope ?? CORE_LOG_SCOPES.app;
    const normalized = this.normalize(error);
    const handled: HandledError = {
      ...normalized,
      original: error,
      handledAt: new Date().toISOString(),
    };

    globalLogger.error(scope, handled.message, {
      operation: context.operation,
      code: handled.code,
      source: handled.source,
      metadata: context.metadata,
    });

    auditLogger.log(AUDIT_ACTIONS.errorHandled, {
      message: handled.message,
      code: handled.code,
      operation: context.operation,
    }, context.actorId);

    for (const handler of this.handlers) {
      try {
        handler(handled, context);
      } catch (handlerError) {
        globalLogger.error(scope, 'Error handler failed', handlerError);
      }
    }

    return handled;
  }

  normalize(error: unknown): Pick<HandledError, 'message' | 'code' | 'source'> {
    if (error instanceof SupabaseServiceError) {
      return {
        message: error.message,
        code: error.code,
        source: error.source,
      };
    }

    if (error instanceof Error) {
      return { message: error.message };
    }

    const normalized = normalizeSupabaseError(error, 'unknown');
    return {
      message: getErrorMessage(error),
      code: normalized.code,
      source: normalized.source,
    };
  }
}

let globalErrorHandlerInstance: GlobalErrorHandler | null = null;

export function getGlobalErrorHandler(): GlobalErrorHandler {
  if (!globalErrorHandlerInstance) {
    globalErrorHandlerInstance = new GlobalErrorHandler();
  }
  return globalErrorHandlerInstance;
}

export function resetGlobalErrorHandler(): void {
  globalErrorHandlerInstance = null;
}

export function createGlobalErrorHandler(): GlobalErrorHandler {
  return new GlobalErrorHandler();
}
