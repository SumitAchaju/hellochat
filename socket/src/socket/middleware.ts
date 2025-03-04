import type { ExtendedError } from "socket.io";
import { jwtUserPlayload, verifyAccessToken } from "../helpers/verifyToken.js";
import type { CustomSocket } from "./types.js";
import jwt from "jsonwebtoken";
import { userRole, hasAccess } from "../middlewares/auth.js";

export const authMiddleware =
  (role: userRole) =>
  (socket: CustomSocket, next: (err?: ExtendedError) => void) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.token;
    try {
      if (!token) {
        return next(new Error("Token is required"));
      }
      const user = verifyAccessToken(token) as jwtUserPlayload;
      if (!hasAccess(role, user)) {
        return next(new Error("You don't have permission to access"));
      }
      socket.userId = String(user.user_id);
      socket.data = {
        userId: user.user_id,
        role: user.role,
      };
      return next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return next(new Error("Token is expired"));
      }
      return next(new Error("authentication error"));
    }
  };
