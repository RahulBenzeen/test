// src/utils/apiErrorHandler.ts

interface APIError {
    status: number;
    message:string;
    data?: Record<string, unknown>; // Replace 'any' with a more specific type
  }
  
  export function handleApiError(error: unknown): APIError {
    if (isAxiosError(error)) {
      const { status, data } = error.response || {};
      return {
        status: status || 0,
        message: data?.message || 'An error occurred on the server.',
        data,
      };
    } else if (error instanceof Error) {
      return {
        status: 0,
        message: error.message || 'An unexpected error occurred.',
      };
    }
    return {
      status: 0,
      message: 'An unknown error occurred.',
    };
  }
  
  function isAxiosError(error: unknown): error is { response: { status: number; data: Record<string, unknown> } } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as { response: unknown }).response === 'object'
    );
  }
  