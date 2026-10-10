export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  meta?: {
    requestId?: string;
    timestamp?: string;
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    [key: string]: unknown;
  };
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export const ok = <T>(data: T, requestId?: string, extraMeta: Record<string, unknown> = {}): ApiSuccessResponse<T> => ({
  success: true,
  data,
  meta: {
    requestId,
    timestamp: new Date().toISOString(),
    ...extraMeta
  }
});

export const fail = (code: string, message: string, details?: unknown): ApiErrorResponse => ({
  success: false,
  error: {
    code,
    message,
    details
  }
});
