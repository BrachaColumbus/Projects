import express, { response } from "express";
import bodyParser from "body-parser";
import { Request, Response, NextFunction } from "express";
import { logMiddleware } from "./Middlewares/loggerMid";
import cors from 'cors';
import { STUDENTROUTER } from "./Routers/Student/studentRouter";
import { TEACHERROUTER } from "./Routers/Teacher/teacherRouter";
import { errorHandling } from "./Middlewares/errorHendling";
import { IDENFICATIONROUTER } from "./Routers/Identification/identificationRouter";

import * as mongoose from "mongoose";
export const app = express();
const URI = `mongodb://127.0.0.1:27017/${'Exercise_submission_system'}`;
app.use(cors())
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const startServer = async () => {
    try {
        await mongoose.connect(URI);
        console.log(" Connected to MongoDB successfully");

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(` Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error(" Failed to connect to MongoDB:", error);
        process.exit(1); // סגירת האפליקציה אם אין חיבור למסד נתונים
    }
};

app.use(bodyParser.json());
app.use(logMiddleware)
//  ראוטרים 
app.use("/student", STUDENTROUTER);
app.use("/teacher", TEACHERROUTER);
app.use("/auth", IDENFICATIONROUTER);
//מידלוואר לתפיסת שגיאות
app.use(errorHandling);



startServer(); 
