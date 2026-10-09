export type ApiResponse<T> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export type HttpStatus = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 409 | 422 | 500;
