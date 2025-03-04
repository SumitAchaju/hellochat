import CustomError, { ISerializeErrors } from "./custom.error.js";

class ValidationError extends CustomError {
  errorCode = 422;
  errorType = "ValidationError";
  constructor(message: string, public errors: ISerializeErrors["errors"]) {
    super(message);

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
  serializeErrors(): ISerializeErrors {
    return {
      success: false,
      message: this.message,
      errors: this.errors,
    };
  }
}

export default ValidationError;
