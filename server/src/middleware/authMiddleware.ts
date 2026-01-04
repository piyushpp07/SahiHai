import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const logger = {
  warn: (msg: string, data?: any) =>
    console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`, data || ""),
};

const JWT_SECRET = process.env.JWT_SECRET || "sahihai-super-secret-key-2026";

/**
 * Authentication middleware
 * Verifies JWT token and attaches userId to request
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("No token provided", {
        path: req.path,
        ip: req.ip,
      });
      return res.status(401).json({
        success: false,
        message: "No token provided. Please login.",
      });
    }

    // Extract token (format: "Bearer <token>")
    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // Attach userId to request object
    (req as any).userId = decoded.userId;

    next();
  } catch (error: any) {
    logger.warn("Invalid or expired token", {
      path: req.path,
      error: error.message,
    });

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token. Please login again.",
    });
  }
};
