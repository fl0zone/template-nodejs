import CustomError from "./customError";

export default class ValidationError extends CustomError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
    this.name = "ValidationError";
    Error.captureStackTrace(this, this.constructor);
  }
}
