import type { Request, Response, NextFunction } from "express";
import CustomError, { ISerializeErrors } from "../errors/custom.error.js";

function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response<ISerializeErrors>,
  next: NextFunction
) {
  if (err instanceof CustomError) {
    res.status(err.errorCode).json(err.serializeErrors()).end();
    return;
  }
  res
    .status(500)
    .json({
      success: false,
      message: "Something went wrong",
      errors: [
        {
          message: err.message,
          location: "Internal",
        },
      ],
    })
    .end();
}

export default globalErrorHandler;
