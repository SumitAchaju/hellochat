import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import ValidationError from "../errors/validation.error.js";

export function validateSchema(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: issue.message,
          location: issue.path.join("."),
        }));
        throw new ValidationError("Invalid provided data", errorMessages);
      } else {
        throw new Error("Internal server error");
      }
    }
  };
}
