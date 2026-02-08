import mongoose, { ObjectId } from "mongoose";
export interface ISubmission{
    studentId: object;
    assignmentId: string;
    githubLink: string;
    partner?: string;
    grade?: number;
    feedback?: string;
}
export const SubmissionSchema = new mongoose.Schema<ISubmission>({
    studentId: {type:mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    assignmentId: {type: String, required: true,ref: 'Assignment'},   
    githubLink: {type: String, required: true},
    partner: {type: String, required: false,ref: 'User'},
    grade: {type: Number, required: false},
    feedback: {type: String, required: false}
});
SubmissionSchema.virtual('isGraded').get(function(this: ISubmission) {
    return this.grade !== undefined;
});
export const Submission = mongoose.model<ISubmission>('Submission', SubmissionSchema);