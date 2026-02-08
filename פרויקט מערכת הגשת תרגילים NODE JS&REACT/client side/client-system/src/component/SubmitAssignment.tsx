import React, { useState } from 'react';
import api from '../api';

export const SubmitAssignment = ({ assignmentId }: { assignmentId: string }) => {
    const [githubLink, setGithubLink] = useState('');

    const handleSubmit = async () => {
        try {
            await api.post('/student/submission/submit', {
                assignmentId,
                githubLink
            });
            alert('המטלה הוגשה בהצלחה!');
        } catch (error: any) {
            alert(error.response?.data?.message || 'שגיאה בהגשה');
        }
    };

    return (
        <div style={styles.card}>
            <h3 style={styles.title}>הגשת מטלה</h3>
            
            <div style={styles.inputGroup}>
                <label style={styles.label}>קישור ל-GitHub</label>
                <input 
                    type="text" 
                    placeholder="הדביקי כאן את הלינק לפרויקט שלך" 
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)} 
                    style={styles.input}
                />
            </div>

            <button onClick={handleSubmit} style={styles.button}>
                שלחי הגשה
            </button>
        </div>
    );
};

// עיצוב תואם לשאר דפי המערכת
const styles: { [key: string]: React.CSSProperties } = {
    card: { 
        backgroundColor: '#ffffff',
        padding: '25px', 
        borderRadius: '12px', 
        border: '1px solid #e1e8ed',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        marginTop: '20px',
        direction: 'rtl',
        fontFamily: "'Assistant', 'Segoe UI', sans-serif"
    },
    title: { 
        color: '#2d3748', 
        fontSize: '18px', 
        fontWeight: '700',
        marginBottom: '20px',
        marginTop: 0
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginBottom: '20px'
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#4a5568',
        marginRight: '4px'
    },
    input: { 
        padding: '12px', 
        borderRadius: '10px', 
        border: '1px solid #cbd5e0', 
        fontSize: '15px', 
        backgroundColor: '#f8fafc',
        outline: 'none',
        transition: 'all 0.2s ease',
        textAlign: 'right'
    },
    button: { 
        width: '100%',
        padding: '12px', 
        borderRadius: '10px', 
        border: 'none', 
        backgroundColor: '#3182ce', 
        color: 'white', 
        fontSize: '16px', 
        fontWeight: '600', 
        cursor: 'pointer', 
        boxShadow: '0 4px 6px rgba(49, 130, 206, 0.2)',
        transition: 'background-color 0.2s'
    }
};