import express from "express";
import { UserService } from "../../Models_Service/User/userService";
import { userValidation } from "../../Middlewares/userValidation";
const userService=new UserService();
export const IDENFICATIONROUTER= express.Router();
IDENFICATIONROUTER.post("/register",userValidation,(req,res)=>{
  userService.addUser(req.body)
.then((user) => {
  res.status(201).json({//לא מחזיר את הסיסמה
    name: user.name,
    email: user.email
 ,messege:"נרשמת בהצלחה!!!" });
})
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
});

IDENFICATIONROUTER.post("/login", (req, res) => {
    userService.login(req.body)
        .then(({ token, user }) => {
            res.status(200).json({ token, user });
        })
        .catch((error) => {
            console.log("Login Error:", error.message); 
            res.status(401).json({ error: error.message });
        });
});