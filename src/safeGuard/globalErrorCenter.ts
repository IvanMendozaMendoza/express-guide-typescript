type statCode = 400 | 401 | 402 | 403 | 404 | 422 | 500;

class AppError extends Error {
  public statusCode: statCode;
  public status: string;
  public isOperational: boolean;
  public code?: number;
  public keyValue?: {
    name: string;
  };
  public errors?: Record<string, Record<string, any>>;

  constructor(message: string, statusCode: statCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
