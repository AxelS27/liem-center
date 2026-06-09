import type { Context } from 'hono';

export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHENTICATED'
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'SERVER_ERROR';

const statusByCode: Record<ApiErrorCode, 400 | 401 | 403 | 404 | 409 | 500> = {
  BAD_REQUEST: 400,
  UNAUTHENTICATED: 401,
  UNAUTHORIZED: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

export class ApiError extends Error {
  constructor(
    public readonly code: ApiErrorCode,
    message: string,
  ) {
    super(message);
  }
}

export function errorResponse(c: Context, error: unknown) {
  if (error instanceof ApiError) {
    return c.json(
      { error: { code: error.code, message: error.message } },
      statusByCode[error.code],
    );
  }

  console.error(error);

  return c.json(
    {
      error: {
        code: 'SERVER_ERROR',
        message: 'Something went wrong while processing the request.',
      },
    },
    500,
  );
}

export function assertFound<T>(value: T | null | undefined, message = 'Resource not found.'): T {
  if (!value) {
    throw new ApiError('NOT_FOUND', message);
  }

  return value;
}
