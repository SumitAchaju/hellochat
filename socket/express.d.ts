import type * as express from "express";
import type { jwtUserPlayload } from "../helpers/verifyToken.js";
import { IApiResponse } from "./src/utils/apiResponse.ts";
declare global {
  namespace Express {
    interface Request {
      user?: jwtUserPlayload;
    }
  }
}
