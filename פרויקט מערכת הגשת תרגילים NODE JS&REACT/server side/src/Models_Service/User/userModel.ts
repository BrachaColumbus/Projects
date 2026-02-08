import mongoose from 'mongoose';
export interface IUser{
    name: string;
    email: string;
    password: string;
    role: "student" | "teacher";
}
export const UserSchema = {
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ["student", "teacher"], required: true}
};  
export const User = mongoose.model<IUser>('User', new mongoose.Schema<IUser>(UserSchema));