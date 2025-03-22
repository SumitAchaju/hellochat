import jwt from "jsonwebtoken";
import type { userRole } from "../middlewares/auth.js";

export type jwtUserPlayload = {
  user_id: string;
  token_type: "access" | "refresh";
  iat: number;
  exp: number;
  role: userRole;
  jti: string;
};

export function verifyAccessToken(token: string) {
  if (!process.env.TOKEN_SECRET) {
    throw new Error("Token secret is not provided");
  }
  return jwt.verify(token, process.env.TOKEN_SECRET);
}

export function verifyRefreshToken(token: string) {
  if (!process.env.TOKEN_SECRET) {
    throw new Error("Refresh token secret is not provided");
  }
  return jwt.verify(token, process.env.TOKEN_SECRET);
}

export function decodeToken(token: string) {
  return jwt.decode(token);
}
