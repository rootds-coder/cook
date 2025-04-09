class ApiError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  path?: string;

  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true,
    path?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;
    this.path = path;
    this.name = 'ApiError';

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError; 