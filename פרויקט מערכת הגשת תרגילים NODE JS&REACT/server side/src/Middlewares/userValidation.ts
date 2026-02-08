import { Request, Response, NextFunction } from "express";
import { User } from "../Models_Service/User/userModel";
import { error } from "node:console";

export async function userValidation(req: Request, res: Response, next: NextFunction) {
    const { name, email,password } = req.body;
    if (!name || !email||!password) {
        return res.status(400).json({ error: "Username, email, and password are required" });
    }
const existingUser = await User.findOne({ email: req.body.email });
const existingUsername = await User.findOne({ name: req.body.username });
if(existingUser||existingUsername){
    return res.status(409).json({ error: "User with this email or username already exists" });
}
if (!password) {
  return res.status(400).json({ error: "Password is required" });
}

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;//בודק שהסיסמה מכילה לפחות 8 תווים, ושיש אותיות ומספרים
if (!passwordRegex.test(password)) {
   return res.status(400).json({
    error: "Password must be at least 8 characters and contain letters and numbers"
    });
}
next();}