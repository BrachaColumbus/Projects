import { IUser,User } from "./userModel";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../Middlewares/authenticationMid";
import bcrypt from "bcrypt";
import { logInfo,logError } from "../../Utils.ts/Logger";


export class UserService {
async addUser(user: IUser): Promise<IUser> {
  const existingUser = await User.findOne({ password: user.password });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);//זה מצין את הסיסמה

  const newUser = new User({
    ...user,
    password: hashedPassword
  });
  
  return newUser.save();
}
async login(details: any) {
    const { email, password } = details;

    const user = await User.findOne({ email }); 
    if (!user) {
        throw new Error("משתמש לא נמצא");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("סיסמה שגויה");
    }

    const token = jwt.sign({ _id: user._id.toString(), role: user.role }, "SECRET_KEY");

    return { token, user };
}}