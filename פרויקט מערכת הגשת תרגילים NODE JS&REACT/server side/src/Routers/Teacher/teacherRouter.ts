import express from "express";
export const TEACHERROUTER = express.Router();
import { AssignmentService } from "../../Models_Service/Assignment/assignmentService";
import { SubmissionService } from "../../Models_Service/Submission/submissionService";
import { authMiddleware } from "../../Middlewares/authenticationMid";
import { authorizeRole } from "../../Middlewares/authorizationMid";
import { logInfo } from "../../Utils.ts/Logger";
const subbmissionService=new SubmissionService();
const assignmentService=new AssignmentService();
TEACHERROUTER.post("/assignments/create", authMiddleware, authorizeRole("teacher"), async (req, res) => {
    try {
        const teacherId = (req as any).user._id; //  שליפת הID מהטוקן

        const assignmentData = {
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,        
            creatDate: req.body.creatDate,   
            teacherId: teacherId             
        };

        const newAssignment = await assignmentService.createAssignment(assignmentData);
        res.status(201).json({ message: "Assignment created successfully", assignment: newAssignment });
    } catch (error) {
        console.error("שגיאה בשרת:", error);
        res.status(500).json({ error: "שגיאה פנימית בשרת" });
    }
});

//הנתב הבא נותן למורה לתת ציון והערות על הגשה של תלמיד
TEACHERROUTER.put(
  "/submissions/:studentId/:assignmentId",
  authMiddleware,
  authorizeRole("teacher"),
  async (req, res) => {
    const { studentId, assignmentId } = req.params;
    const {grade, feedback } = req.body;
    const submission = await subbmissionService.
    getSubmissionByStudentAndAssignment(studentId, assignmentId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    await subbmissionService.setGrade( studentId,assignmentId, grade, feedback);
    res.status(200).json({ message: "Submission graded successfully" });
  }
);

//הנתב הבא מאפשר למורה לראות את כל ההגשות של התלמידים לתרגילים שהוא יצר
TEACHERROUTER.get("/submissions", authMiddleware, authorizeRole("teacher"), async (req: any, res: any) => {
    try {
        // שליפת ה-ID מהטוקן
        const teacherId = req.user._id; 

        const submissions = await subbmissionService.getSubmissionsByTeacher(teacherId); 
        
        res.status(200).json(submissions); 
    } catch (error) {
        res.status(500).json({ error: "שגיאה במשיכת ההגשות" });
    }
});

//זה הנתב שמחשב את הממוצע של כל הציונים של כל התלמידים בכל ההגשות
TEACHERROUTER.get("/submissions/average",authMiddleware,authorizeRole("teacher"),async (req,res)=>{
    const average=await subbmissionService.averageGrade();
    res.status(200).json({averageGrade:average});
});

//הנתב הבא מחזיר את הממוצע של כל תרגיל בנפרד
TEACHERROUTER.get("/stats", authMiddleware, async (req, res) => {
    const stats = await subbmissionService.getAssignmentsavg();
    res.json(stats);
});
