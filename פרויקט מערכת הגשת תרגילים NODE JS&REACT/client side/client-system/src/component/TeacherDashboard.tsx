import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const TeacherDashboard = () => {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription,] = useState("");
    const [duedate, setDueDate] = useState("");

    const teacherName = localStorage.getItem('userName') || "המורה";

    const fetchInitialData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const subRes = await axios.get('http://localhost:5000/teacher/submissions', { headers });
            setSubmissions(subRes.data);

            const statsRes = await axios.get('http://localhost:5000/teacher/stats', { headers });
            setStats(statsRes.data);
        } catch (error: any) {
            console.error("שגיאה בטעינת נתונים:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAssignment = async () => {
        if (!newTitle || !newDescription || !duedate) {
            alert("נא למלא שם, תיאור ותאריך הגשה");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const payload = { 
                title: newTitle, 
                description: newDescription,
                dueDate: duedate,
                creatDate: new Date().toISOString()
            };

            const response = await axios.post('http://localhost:5000/teacher/assignments/create', 
                payload,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            alert("המטלה פורסמה בהצלחה! 🎉");
            setNewTitle("");
            setNewDescription("");
            setDueDate("");
            fetchInitialData(); 
        } catch (error: any) {
            const msg = error.response?.data?.message || error.response?.data?.error || "שגיאה ביצירת המטלה";
            alert("שגיאה: " + msg);
        }
    };

    const handleSaveGrade = async (studentId: string, assignmentId: string, submissionId: string) => {
        try {
            const gradeInput = document.getElementById(`grade-${submissionId}`) as HTMLInputElement;
            const feedbackInput = document.getElementById(`feedback-${submissionId}`) as HTMLInputElement;
            const token = localStorage.getItem('token');

            await axios.put(`http://localhost:5000/teacher/submissions/${studentId}/${assignmentId}`,
                { grade: Number(gradeInput.value), feedback: feedbackInput.value },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            alert("נשמר בהצלחה!");
            fetchInitialData();
        } catch (error) {
            alert("שגיאה בשמירה");
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f4f8' }}>
            <div style={{ color: '#3182ce', fontWeight: 'bold' }}>טוען נתונים למורה...</div>
        </div>
    );

    return (
        <div style={styles.container}>
            <div style={styles.headerSection}>
                <h1 style={styles.welcomeTitle}>שלום המורה, {teacherName}! 👋</h1>
                <p style={styles.welcomeSubtitle}>ניהול מטלות ובדיקת הגשות סטודנטיות</p>
            </div>

            {/* --- טופס יצירת מטלה חדשה --- */}
            <div style={styles.card}>
                <h2 style={styles.cardTitle}>יצירת מטלה חדשה 📝</h2>
                
                <div style={styles.inputGroup}>
                    <label style={styles.label}>שם המטלה</label>
                    <input 
                        type="text" 
                        placeholder="למשל: תרגול React Hooks" 
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>תיאור והוראות</label>
                    <textarea 
                        placeholder="פרטי כאן מה על הסטודנטיות לבצע..." 
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        style={{ ...styles.input, height: '100px', resize: 'vertical' }}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>תאריך הגשה אחרון</label>
                    <input 
                        type="date" 
                        value={duedate}
                        onChange={(e) => setDueDate(e.target.value)}
                        style={styles.input}
                    />
                </div>

                <button onClick={handleCreateAssignment} style={styles.primaryButton}>
                    פרסמי מטלה עכשיו 🚀
                </button>
            </div>

            {/* --- טבלת בדיקת הגשות --- */}
            <div style={{ ...styles.card, marginTop: '30px' }}>
                <h3 style={styles.cardTitle}>הגשות הממתינות לבדיקה</h3>
                {submissions.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#a0aec0', padding: '20px' }}>אין כרגע הגשות הממתינות לבדיקה.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeaderRow}>
                                    <th style={styles.th}>סטודנטית</th>
                                    <th style={styles.th}>מטלה</th>
                                    <th style={styles.th}>לינק</th>
                                    <th style={styles.th}>ממוצע</th>
                                    <th style={styles.th}>ציון ופידבק</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((sub: any) => {
                                    const assignmentStat = stats.find(s => String(s._id) === String(sub.assignmentId?._id));
                                    const average = assignmentStat ? assignmentStat.averageGrade.toFixed(1) : "---";

                                    return (
                                        <tr key={sub._id} style={styles.tableRow}>
                                            <td style={{ ...styles.td, fontWeight: '600' }}>{sub.studentId?.name}</td>
                                            <td style={styles.td}>{sub.assignmentId?.title}</td>
                                            <td style={styles.td}>
                                                <a href={sub.githubLink} target="_blank" rel="noreferrer" style={styles.tableLink}>קוד</a>
                                            </td>
                                            <td style={{ ...styles.td, color: '#3182ce', fontWeight: 'bold' }}>{average}</td>
                                            <td style={styles.td}>
                                                <div style={styles.gradeArea}>
                                                    <input 
                                                        type="number" 
                                                        defaultValue={sub.grade} 
                                                        id={`grade-${sub._id}`} 
                                                        style={styles.gradeInput} 
                                                        placeholder="ציון"
                                                    />
                                                    <input 
                                                        type="text" 
                                                        defaultValue={sub.feedback} 
                                                        id={`feedback-${sub._id}`} 
                                                        placeholder="פידבק..." 
                                                        style={styles.feedbackInput} 
                                                    />
                                                    <button onClick={() => handleSaveGrade(sub.studentId._id, sub.assignmentId._id, sub._id)} style={styles.saveButton}>
                                                        שמור
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: { 
        padding: '40px 20px', 
        direction: 'rtl', 
        maxWidth: '1100px', 
        margin: 'auto', 
        fontFamily: "'Assistant', 'Segoe UI', sans-serif",
        backgroundColor: '#f0f4f8',
        minHeight: '100vh'
    },
    headerSection: { marginBottom: '30px' },
    welcomeTitle: { color: '#2d3748', fontSize: '28px', fontWeight: '700', margin: '0 0 5px 0' },
    welcomeSubtitle: { color: '#718096', fontSize: '16px', margin: 0 },
    card: { 
        backgroundColor: '#ffffff', 
        padding: '30px', 
        borderRadius: '16px', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
        border: '1px solid #e1e8ed' 
    },
    cardTitle: { fontSize: '20px', color: '#2d3748', marginBottom: '20px', fontWeight: '600', borderBottom: '2px solid #f0f4f8', paddingBottom: '10px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' },
    label: { fontSize: '14px', fontWeight: '600', color: '#4a5568' },
    input: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e0', backgroundColor: '#f8fafc', fontSize: '15px', outline: 'none', boxSizing: 'border-box' },
    primaryButton: { width: '100%', padding: '14px', backgroundColor: '#3182ce', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '10px', fontWeight: '700', fontSize: '16px', boxShadow: '0 4px 6px rgba(49, 130, 206, 0.2)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeaderRow: { backgroundColor: '#f8fafc' },
    th: { padding: '15px', textAlign: 'right', color: '#4a5568', fontSize: '14px', fontWeight: '600' },
    tableRow: { borderBottom: '1px solid #edf2f7' },
    td: { padding: '15px', fontSize: '14px' },
    tableLink: { color: '#3182ce', fontWeight: '600', textDecoration: 'none' },
    gradeArea: { display: 'flex', alignItems: 'center', gap: '8px' },
    gradeInput: { width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0', textAlign: 'center' },
    feedbackInput: { flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0' },
    saveButton: { padding: '8px 15px', backgroundColor: '#2f855a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }
};