import type { ApiResponse, ApiError } from '@shared/types';

export const createSuccessResponse = <T>(
  data: T,
  message?: string
): ApiResponse<T> => ({
  data,
  success: true,
  message: message || 'Success'
});

export const createErrorResponse = (
  message: string,
  code: string,
  details?: any
): ApiError => ({
  error: {
    message,
    code,
    details
  }
});

export const sendSuccessResponse = <T>(
  res: any,
  data: T,
  message?: string,
  statusCode: number = 200
): void => {
  res.status(statusCode).json(createSuccessResponse(data, message));
};

export const sendErrorResponse = (
  res: any,
  message: string,
  code: string,
  statusCode: number = 500,
  details?: any
): void => {
  res.status(statusCode).json(createErrorResponse(message, code, details));
};
