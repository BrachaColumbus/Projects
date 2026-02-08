import express from "express";
import { logInfo } from "../../Utils.ts/Logger";
import { AssignmentService } from "../../Models_Service/Assignment/assignmentService";
const assignmentService=new AssignmentService();
import { SubmissionService } from "../../Models_Service/Submission/submissionService";
import { authMiddleware } from "../../Middlewares/authenticationMid";
const subbmissionservice=new SubmissionService();
export const STUDENTROUTER= express.Router();
STUDENTROUTER.get("/assignments",authMiddleware,async (req,res)=>{  
    const openAssignments = await assignmentService.getAllOpenAssignments();
    res.status(200).json({openAssignments}); 
});
STUDENTROUTER.post("/subbmission/submit", authMiddleware, async (req, res) => {
    const studentId = (req as any).user._id;  
    const submissionData = {
        ...req.body,
        studentId  // מוסיפים ל-body
    };

    await subbmissionservice.addSubmission(submissionData);
    logInfo("Assignment submitted successfully");
    res.status(201).json({ message: "Assignment submitted successfully" });
});

STUDENTROUTER.get("/subbmissions/my",authMiddleware,async (req,res)=>{
    const userId = (req as any).user._id;
    const submissions=await subbmissionservice.getsubmitionbystudentid(userId);
    if(!submissions){
        return res.status(404).json({message:"Submission not found"});
    }   
    res.status(200).json({submissions});
});

STUDENTROUTER.get("/assignments-stats", authMiddleware, async (req, res) => {
    try {
        const stats = await subbmissionservice.getAssignmentsavg();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: "שגיאה בשליפת הממוצע" });
    }
});
