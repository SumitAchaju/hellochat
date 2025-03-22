import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../helpers/verifyToken.js";
import jwt from "jsonwebtoken";
import { jwtUserPlayload } from "../helpers/verifyToken.js";
import { PermissionError, UnAuthorizedError } from "../errors/auth.error.js";

export type userRole = "staff" | "user" | "superadmin";

export function hasAccess(
  requiredRole: userRole,
  decodedToken: jwtUserPlayload
): boolean {
  const allowedRoles = {
    superadmin: ["superadmin"],
    staff: ["superadmin", "staff"],
    user: ["superadmin", "staff", "user"],
  };

  return allowedRoles[requiredRole]?.includes(decodedToken.role) || false;
}

const getTokenFromRequest = (req: Request): string | null => {
  const token = req?.cookies?.access;
  if (token) return token;

  const authHeader = req.headers?.authorization;
  if (!authHeader) return null;
  if (!authHeader.startsWith("Bearer ")) return null;

  return authHeader.split(" ")[1] || null;
};

const requireAuth =
  (role?: userRole) => (req: Request, res: Response, next: NextFunction) => {
    const token = getTokenFromRequest(req);
    if (!token) {
      throw new UnAuthorizedError("Token is required");
    }
    try {
      const decoded = verifyAccessToken(token) as jwtUserPlayload;

      if (role && !hasAccess(role, decoded)) {
        throw new PermissionError("You don't have permission to access");
      }
      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnAuthorizedError("Token is expired");
      }
      throw error;
    }
  };

export default requireAuth;
