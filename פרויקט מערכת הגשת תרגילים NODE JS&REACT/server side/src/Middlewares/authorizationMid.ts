import { error } from "console";
import { Request, Response, NextFunction } from "express";
// הקוד כאן בנוי בשני שלבים:
//  קודם כל מגדירים איזה תפקיד אנחנו מחפשים,
//  ואז מחזירים פונקציה שבודקת אם למשתמש שנכנס יש באמת את התפקיד הזה
//  ומאשרת לו להמשיך.
//וככה הקוד הזה מתאים לכל תפקיד שאנחנו רוצים לבדוק. 

export function authorizeRole(requiredRole: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role; 
    console.log("Checking role. User has:", userRole, "Required:", requiredRole);
    if (userRole !== requiredRole) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}
