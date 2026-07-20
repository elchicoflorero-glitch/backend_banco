/**
 * Standard API Response format
 */
export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

/**
 * Paginated Response format
 */
export interface PaginatedResponse<T> {
  statusCode: number;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}

/**
 * Create a success response
 */
export function createSuccessResponse<T>(
  data: T,
  message: string = 'Success',
  statusCode: number = 200,
): ApiResponse<T> {
  return {
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create an error response
 */
export function createErrorResponse(
  message: string,
  statusCode: number = 400,
  error?: string,
): ApiResponse {
  return {
    statusCode,
    message,
    error: error || message,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create a paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message: string = 'Success',
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);

  return {
    statusCode: 200,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
    timestamp: new Date().toISOString(),
  };
}
