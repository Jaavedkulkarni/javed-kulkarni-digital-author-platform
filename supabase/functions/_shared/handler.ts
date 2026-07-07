import { corsPreflightResponse, withCors } from '../cors.ts';
import { toAppError } from '../errors/app-error.ts';
import { createLogger, type Logger } from '../logging/logger.ts';
import { jsonFailure, jsonFromError, methodNotAllowed } from '../responses/json.ts';

export interface EdgeHandlerContext {
  req: Request;
  logger: Logger;
}

export type EdgeHandler = (ctx: EdgeHandlerContext) => Promise<Response>;

export function createEdgeHandler(scope: string, handler: EdgeHandler): (req: Request) => Promise<Response> {
  const logger = createLogger(scope);

  return async (req: Request): Promise<Response> => {
    if (req.method === 'OPTIONS') {
      return corsPreflightResponse();
    }

    if (req.method !== 'POST') {
      return methodNotAllowed(withCors());
    }

    try {
      const response = await handler({ req, logger });
      const headers = new Headers(response.headers);
      for (const [key, value] of Object.entries(withCors())) {
        headers.set(key, value);
      }
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    } catch (error) {
      const appError = toAppError(error);
      logger.error('Unhandled edge function error', {
        code: appError.code,
        message: appError.message,
      });
      return jsonFromError(appError, withCors());
    }
  };
}

export async function readJsonBody(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

export function jsonFailureResponse(error: unknown): Response {
  return jsonFromError(error, withCors());
}

export { jsonFailure };
