import mongoose from 'mongoose';
import { logInfo,logError } from './Logger';


export class myDB{
    static DB: myDB = new myDB();
    DB_NAME = 'Exercise_submission_system';    // 
    URI = `mongodb://127.0.0.1:27017/${this.DB_NAME}`;

    async connectToDb(): Promise<void> {
        try {
            await mongoose.connect(this.URI);
            console.log('Connected to MongoDB (Mongoose)');
            logInfo('Connected to MongoDB (Mongoose)');
        } catch (err) {
            console.error('MongoDB connection error:', err);
        process.exit(1);
        }   }
    static getDB(): myDB
    {
        if( mongoose.connection.readyState === 0)
            this.DB.connectToDb();
        return this.DB;
    }}