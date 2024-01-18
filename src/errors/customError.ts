
export default class CustomError extends Error {
  statusCode: number;

  constructor(message:string, statusCode:number ) {
    super(message);
    this.statusCode = statusCode;
    this.name='CustomError'
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
