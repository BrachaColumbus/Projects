import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";

// פונקציה שמחזירה את שם הקובץ לפי שנה וחודש
function getLogFileName() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const logsDir = path.join(__dirname, "../logs");

    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

    return path.join(logsDir, `logs_${year}_${month}_${day}.txt`);
}

export function logMiddleware(req: Request, res: Response, next: NextFunction) {
    const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`;
    console.log(logMessage);

    const logFile = getLogFileName();

    fs.appendFile(logFile, logMessage + "\n", (err) => {
        if (err) console.error("Failed to write log:", err);
    });

    next(); 
}
