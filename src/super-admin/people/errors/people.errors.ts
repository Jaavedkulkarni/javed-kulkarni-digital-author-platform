export type PeopleErrorCode =
  | 'validation_failed'
  | 'not_found'
  | 'query_failed'
  | 'statistics_failed'
  | 'filters_failed'
  | 'permission_denied'
  | 'unknown';

export class PeopleRepositoryError extends Error {
  readonly code: PeopleErrorCode;

  constructor(code: PeopleErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'PeopleRepositoryError';
    this.code = code;
    this.cause = cause;
  }
}

export class PeopleServiceError extends Error {
  readonly code: PeopleErrorCode;

  constructor(code: PeopleErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'PeopleServiceError';
    this.code = code;
    this.cause = cause;
  }
}

const FRIENDLY_MESSAGES: Record<PeopleErrorCode, string> = {
  validation_failed: 'The request parameters are invalid. Please review your filters and try again.',
  not_found: 'The requested user could not be found.',
  query_failed: 'Unable to load people data right now. Please try again.',
  statistics_failed: 'Unable to load people statistics right now. Please try again.',
  filters_failed: 'Unable to load filter options right now. Please try again.',
  permission_denied: 'You do not have permission to view people data.',
  unknown: 'Something went wrong while loading people data.',
};

export function mapPeopleErrorToMessage(error: unknown): string {
  if (error instanceof PeopleServiceError || error instanceof PeopleRepositoryError) {
    return FRIENDLY_MESSAGES[error.code] ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return FRIENDLY_MESSAGES.unknown;
}

export function toPeopleServiceError(error: unknown): PeopleServiceError {
  if (error instanceof PeopleServiceError) return error;
  if (error instanceof PeopleRepositoryError) {
    return new PeopleServiceError(error.code, mapPeopleErrorToMessage(error), error);
  }
  if (error instanceof Error) {
    return new PeopleServiceError('unknown', mapPeopleErrorToMessage(error), error);
  }
  return new PeopleServiceError('unknown', FRIENDLY_MESSAGES.unknown, error);
}
