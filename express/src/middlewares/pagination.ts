import type { Request, Response, NextFunction } from "express";

const paginationParser = (req: Request, res: Response, next: NextFunction) => {
  const { limit, offset } = req.query;
  req.limit = parseInt(limit as string) || 10;
  req.offset = parseInt(offset as string) || 0;
  next();
};

export default paginationParser;
