import { Request, Response, NextFunction } from "express";
import { logError } from "../Utils.ts/Logger";
export function errorHandling(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err); 

  // בודק אם יש סטטוס שהוגדר, אחרת 500
  const status = err.status || 500;
  if(status === 500){
    logError("Internal Server Error");
  }
  // בודק אם יש הודעת שגיאה שהוגדרה, אחרת הודעה כללית
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
}
