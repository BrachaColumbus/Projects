import fs from "fs";
import path from "path";

const logDir = path.join(__dirname, "../../system_logs");
const logFile = path.join(logDir, "system.log");

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

export function logInfo(message: string) {
  const log = `[INFO] ${new Date().toISOString()} - ${message}\n`;
  fs.appendFileSync(logFile, log);
  console.log(log);
}

export function logError(message: string) {
  const log = `[ERROR] ${new Date().toISOString()} - ${message}\n`;
  fs.appendFileSync(logFile, log);
  console.error(log);
}