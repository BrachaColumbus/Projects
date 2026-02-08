import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
interface JwtPayload {
  _id: string;
  role: string;
}
export const JWT_SECRET = "SECRET_KEY"; 

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as JwtPayload;

    (req as any).user = {
      _id: decoded._id,
      role: decoded.role
    };

    next();

  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
