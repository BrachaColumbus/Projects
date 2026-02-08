import { logInfo } from "../../Utils.ts/Logger";
import { IAssignment,Assignment } from "./assignmentModel";
import mongoose from "mongoose";
export class AssignmentService {
    createAssignment(assigmnent:IAssignment): Promise<IAssignment> {
        const newAssigmnent = new Assignment(assigmnent);
        logInfo("Creating new assignment with id: " + assigmnent.id);
        return newAssigmnent.save();
    }  

    getAllOpenAssignments(): Promise<IAssignment[]> {
        const now = new Date();
        return Assignment.find({ 
        dueDate: { $gt: now } //שאילתה במסד נתונים שבודקת שהתאריך הגשה עוד לא היה
    }).exec();
}
    }



