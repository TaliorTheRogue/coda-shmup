import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type JwtPayload = {
  userId: string;
  username: string;
};

export function authenticate(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    response.status(401).json({
      error: "Authorization header is missing",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    response.status(401).json({
      error: "Token is missing",
    });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    response.status(500).json({
      error: "JWT secret is not defined",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    request.user = {
      id: decoded.userId,
      username: decoded.username,
    };

    next();
  } catch {
    response.status(401).json({
      error: "Invalid or expired token",
    });
  }
}