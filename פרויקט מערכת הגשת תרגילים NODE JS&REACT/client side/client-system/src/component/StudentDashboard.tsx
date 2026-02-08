import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const StudentDashboard = () => {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [mySubmissions, setMySubmissions] = useState<any[]>([]); 
    const [stats, setStats] = useState<any[]>([]); 
    const [studentName] = useState(localStorage.getItem('userName') || "תלמידה");
    
    const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
    const [githubLink, setGithubLink] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const selectedAssignmentData = assignments.find(a => a._id === selectedAssignmentId);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const resAssignments = await axios.get('http://localhost:5000/student/assignments', { headers });
            if (resAssignments.data && Array.isArray(resAssignments.data.openAssignments)) {
                setAssignments(resAssignments.data.openAssignments);
            }

            const resSubmissions = await axios.get('http://localhost:5000/student/subbmissions/my', { headers });
            if (resSubmissions.data && Array.isArray(resSubmissions.data.submissions)) {
                setMySubmissions(resSubmissions.data.submissions);
            }

            const resStats = await axios.get('http://localhost:5000/student/assignments-stats', { headers });
            setStats(resStats.data);

        } catch (error) {
            console.error("שגיאה בטעינת נתונים:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async () => {
        if (!selectedAssignmentId || !githubLink) {
            alert("נא לבחור תרגיל ולהוסיף לינק");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/student/subbmission/submit', {
                assignmentId: selectedAssignmentId,
                githubLink: githubLink
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage("התרגיל הוגש בהצלחה! 🎉");
            setGithubLink("");
            setSelectedAssignmentId(""); 
            fetchData(); 
        } catch (error: any) {
            setMessage(error.response?.data?.message || "חלה שגיאה בהגשה");
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f4f8' }}>
            <div style={{ color: '#3182ce', fontWeight: 'bold' }}>טוען נתונים...</div>
        </div>
    );

    return (
        <div style={styles.container}>
            
            {/* כותרת ראשית */}
            <div style={styles.headerSection}>
                <h1 style={styles.welcomeTitle}>שלום, {studentName}! 👋</h1>
                <p style={styles.welcomeSubtitle}>מרכז הלמידה והגשת המטלות האישי שלך</p>
            </div>

            {/* אזור הגשת תרגיל */}
            <div style={styles.card}>
                <h2 style={styles.cardTitle}>הגשת תרגיל חדש</h2>
                
                <div style={styles.inputGroup}>
                    <label style={styles.label}>בחרי משימה</label>
                    <select 
                        value={selectedAssignmentId} 
                        onChange={(e) => setSelectedAssignmentId(e.target.value)}
                        style={styles.select}
                    >
                        <option value="">-- בחרי תרגיל מהרשימה --</option>
                        {assignments.map((item: any) => (
                            <option key={item._id} value={item._id}>{item.title}</option>
                        ))}
                    </select>
                </div>

                {selectedAssignmentData && (
                    <div style={styles.instructionBox}>
                        <strong style={styles.instructionTitle}>הוראות המורה:</strong>
                        <p style={styles.instructionText}>{selectedAssignmentData.description}</p>
                    </div>
                )}

                <div style={styles.inputGroup}>
                    <label style={styles.label}>קישור ל-GitHub / פרויקט</label>
                    <input 
                        type="text" 
                        placeholder="הדביקי כאן את הלינק..."
                        value={githubLink}
                        onChange={(e) => setGithubLink(e.target.value)}
                        style={styles.input}
                    />
                </div>

                <button onClick={handleSubmit} style={styles.submitButton}>
                    שלחי הגשה למורה 🚀
                </button>
                {message && (
                    <p style={{ 
                        marginTop: '15px', 
                        fontWeight: '600', 
                        color: message.includes("בהצלחה") ? "#2f855a" : "#c53030",
                        textAlign: 'center'
                    }}>
                        {message}
                    </p>
                )}
            </div>

            {/* טבלת היסטוריה */}
            <div style={{ ...styles.card, marginTop: '30px' }}>
                <h3 style={styles.cardTitle}>היסטוריית הגשות וציונים 📝</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeaderRow}>
                                <th style={styles.th}>שם המטלה</th>
                                <th style={styles.th}>המורה</th>
                                <th style={styles.th}>לינק</th>
                                <th style={styles.th}>ציון</th>
                                <th style={styles.th}>ממוצע כיתתי</th>
                                <th style={styles.th}>פידבק</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mySubmissions.length > 0 ? (
                                mySubmissions.map((sub: any) => {
                                    const assignmentStat = stats.find(s => String(s._id) === String(sub.assignmentId?._id));
                                    const avg = assignmentStat ? assignmentStat.averageGrade.toFixed(1) : "---";

                                    return (
                                        <tr key={sub._id} style={styles.tableRow}>
                                            <td style={styles.td}>
                                                <div style={{ fontWeight: '600', color: '#2d3748' }}>{sub.assignmentId?.title}</div>
                                            </td>
                                            <td style={{ ...styles.td, color: '#4a5568' }}>
                                                {sub.assignmentId?.teacherId?.name || "לא צוין"}
                                            </td>
                                            <td style={styles.td}>
                                                <a href={sub.githubLink} target="_blank" rel="noreferrer" style={styles.tableLink}>צפייה בפרויקט</a>
                                            </td>
                                            <td style={{ ...styles.td, fontWeight: '700', color: sub.grade ? '#3182ce' : '#ed8936' }}>
                                                {sub.grade || "עוד לא נבדק"}
                                            </td>
                                            <td style={{ ...styles.td, color: '#718096' }}>{avg}</td>
                                            <td style={{ ...styles.td, fontStyle: 'italic', fontSize: '0.9em', color: '#4a5568' }}>
                                                {sub.feedback || "---"}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: '#a0aec0' }}>עוד לא הגשת מטלות במערכת</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// עיצוב Dashboard מקצועי
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
    headerSection: {
        marginBottom: '30px',
        textAlign: 'right'
    },
    welcomeTitle: { 
        color: '#2d3748', 
        fontSize: '28px', 
        fontWeight: '700',
        margin: '0 0 5px 0'
    },
    welcomeSubtitle: {
        color: '#718096',
        fontSize: '16px',
        margin: 0
    },
    card: { 
        backgroundColor: '#ffffff', 
        padding: '30px', 
        borderRadius: '16px', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
        border: '1px solid #e1e8ed'
    },
    cardTitle: {
        fontSize: '20px',
        color: '#2d3748',
        marginBottom: '20px',
        fontWeight: '600',
        borderBottom: '2px solid #f0f4f8',
        paddingBottom: '10px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginBottom: '15px'
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#4a5568'
    },
    select: { 
        width: '100%', 
        padding: '12px', 
        borderRadius: '10px', 
        border: '1px solid #cbd5e0', 
        backgroundColor: '#f8fafc',
        fontSize: '15px',
        outline: 'none'
    },
    input: { 
        width: '100%', 
        padding: '12px', 
        borderRadius: '10px', 
        border: '1px solid #cbd5e0', 
        backgroundColor: '#f8fafc',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box'
    },
    instructionBox: { 
        backgroundColor: '#ebf8ff', 
        padding: '15px', 
        borderRadius: '10px', 
        marginBottom: '20px', 
        borderRight: '4px solid #3182ce' 
    },
    instructionTitle: { display: 'block', marginBottom: '5px', color: '#2b6cb0', fontSize: '14px' },
    instructionText: { margin: 0, whiteSpace: 'pre-wrap', color: '#2d3748', fontSize: '15px' },
    submitButton: { 
        width: '100%', 
        padding: '14px', 
        backgroundColor: '#3182ce', 
        color: 'white', 
        border: 'none', 
        cursor: 'pointer', 
        borderRadius: '10px', 
        fontWeight: '700',
        fontSize: '16px',
        boxShadow: '0 4px 6px rgba(49, 130, 206, 0.2)',
        transition: 'background 0.2s'
    },
    table: { 
        width: '100%', 
        borderCollapse: 'collapse', 
        marginTop: '10px'
    },
    tableHeaderRow: { 
        backgroundColor: '#f8fafc',
        borderBottom: '2px solid #edf2f7'
    },
    th: { 
        padding: '15px', 
        textAlign: 'right', 
        color: '#4a5568', 
        fontSize: '14px', 
        fontWeight: '600' 
    },
    tableRow: {
        borderBottom: '1px solid #edf2f7',
        transition: 'background 0.2s'
    },
    td: { 
        padding: '15px', 
        fontSize: '14px', 
        verticalAlign: 'middle' 
    },
    tableLink: {
        color: '#3182ce',
        textDecoration: 'none',
        fontWeight: '600'
    }
};