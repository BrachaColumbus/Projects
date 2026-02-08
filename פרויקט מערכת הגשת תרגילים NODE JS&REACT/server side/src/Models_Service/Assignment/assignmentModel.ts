import mongoose, { ObjectId } from "mongoose";

export interface IAssignment{
    id?:ObjectId,
    title: string;
    description: string ;
    dueDate: Date;
    creatDate: Date;
    teacherId: mongoose.Types.ObjectId;
}

export const AssignmentSchema = new mongoose.Schema<IAssignment>({
    title: {type: String, required: true},
    description: {type: String, required: true},
    dueDate: {type: Date, required: true},
    creatDate: {type: Date, required: true},
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // זה השדה הקריטי!
});

AssignmentSchema.virtual('isOpen').get(function(this: IAssignment) {
    return new Date() < this.dueDate;
});

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);