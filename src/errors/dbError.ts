import  CustomError  from "./customError";

export default class DbError extends CustomError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
    this.name="DbError"
    Error.captureStackTrace(this, this.constructor);
  }
}
