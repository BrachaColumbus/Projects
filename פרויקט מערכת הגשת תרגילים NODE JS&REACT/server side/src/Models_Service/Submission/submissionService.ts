import { ISubmission,Submission } from "./submissionModel";
import { logInfo } from "../../Utils.ts/Logger";
import { Assignment } from "../Assignment/assignmentModel";
import mongoose from "mongoose";
export class SubmissionService {
       async addSubmission(submissionData: ISubmission): Promise<ISubmission> {
        const existingSubmission = await Submission.findOne({ 
        studentId: submissionData.studentId, 
        assignmentId: submissionData.assignmentId 
    });
        if (existingSubmission) {
            throw new Error("Submission already exists");
        }
        const newSubmission = new Submission(submissionData);
        return newSubmission.save();
    }
async getallSubmissions(): Promise<ISubmission[]> {
    return Submission.find()
        .populate({
            path: 'studentId',
            select: 'name email' 
        })
        .populate({
            path: 'assignmentId',
            select: 'title description' 
        })
        .exec();
}

setGrade(studentId:string,assignmentId:string, grade: number, feedback: string): Promise<ISubmission | null> {
    return Submission.findOneAndUpdate(
        { studentId: studentId as any,
          assignmentId:assignmentId as any},//איזה SUBMISSION לעדכן
        { grade, feedback },//את מה לעדכן
        { new: true }// להחזיר את המסמך המעודכן
    ).exec();
}
async averageGrade(): Promise<number> {
    let sum=0;
    let count=0;
    const list=await this.getallSubmissions();
    for (const sub of list){
        if(sub.grade){
            sum+=sub.grade;
            count++;
        }
    }
    logInfo(`Calculated average grade: ${sum/count}`);
    return sum/count;
}
async getSubmissionByStudentAndAssignment(studentId:string, assignmentId: string): Promise<ISubmission | null> {
    return Submission.findOne({ studentId: studentId as any, 
        assignmentId: assignmentId as any}).exec();

}
async getsubmitionbystudentid(studentId: object): Promise<ISubmission[]> {
    return await Submission.find({ studentId: studentId })
        .populate('studentId', 'name') 
        .populate({
            path: 'assignmentId',
            select: 'title teacherId', 
            populate: {
                path: 'teacherId',  
                select: 'name' 
            }
        })
        .exec();
}

//את הפונקציה הבאה עשיתי כדי שיהיה לי לכל תרגיל את הממוצע שלו בנפרד
async getAssignmentsavg() {
    return await Submission.aggregate([
        { $match: { grade: { $exists: true, $ne: null } } }, // רק הגשות עם ציון
        {
            $group: {
                _id: "$assignmentId", // קיבוץ לפי תרגיל
                averageGrade: { $avg: "$grade" } // חישוב ממוצע
            }
        }
    ]);
}
//את הפונקציה הבאה עשיתי כדי שאני יוכל לעשות שכל מורה תוכל לגשת רק להגשות של התרגילים שלה
async getSubmissionsByTeacher(teacherId: mongoose.Types.ObjectId): Promise<any[]> {
    const myAssignments = await Assignment.find({ teacherId: teacherId });
    
    const myAssignmentIds = myAssignments.map(a => a._id);

    return await Submission.find({ 
        assignmentId: { $in: myAssignmentIds } 
    } as any) 
    .populate('studentId', 'name')
    .populate('assignmentId', 'title')
    .exec(); 
}

}