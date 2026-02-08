import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student' // ברירת מחדל
    });
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Sending data:", formData);
        try {
            const response = await api.post('/auth/register', formData);
            console.log("Success:", response.data);
            alert("נרשמת בהצלחה! כעת תועברי לדף ההתחברות");
            navigate('/'); 
        } catch (error: any) {
            console.error("The actual error:", error.response?.data);
            const errorMessage = error.response?.data?.message || 
                                 error.response?.data?.error || 
                                 "קרתה שגיאה בשרת, נסי שוב מאוחר יותר";
            alert("שגיאה בהרשמה: " + errorMessage);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>יצירת חשבון חדש</h2>
                    <p style={styles.subtitle}>הצטרפי למערכת הניהול הבית ספרית</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>שם מלא</label>
                        <input 
                            style={styles.input} 
                            type="text" 
                            placeholder="הזינו שם מלא" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                            required 
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>כתובת אימייל</label>
                        <input 
                            style={styles.input} 
                            type="email" 
                            placeholder="example@mail.com" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})} 
                            required 
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>סיסמה</label>
                        <input 
                            style={styles.input} 
                            type="password" 
                            placeholder="אותיות ומספרים" 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                            required 
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>סוג חשבון</label>
                        <select 
                            style={styles.input} 
                            value={formData.role} 
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="student">סטודנטית</option>
                            <option value="teacher">מורה</option>
                        </select>
                    </div>

                    <button type="submit" style={styles.button}>הירשמי עכשיו</button>
                </form>

                <div style={styles.footer}>
                    <p style={styles.footerText}>כבר יש לך חשבון?</p>
                    <Link to="/" style={styles.link}>התחברי כאן</Link>
                </div>
            </div>
        </div>
    );
};

// עיצוב תואם לדף הלוגין (School Professional)
const styles: any = {
    container: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        backgroundColor: '#f0f4f8', 
        direction: 'rtl', 
        fontFamily: "'Assistant', 'Segoe UI', sans-serif",
        padding: '20px'
    },
    card: { 
        padding: '40px', 
        borderRadius: '16px', 
        backgroundColor: '#fff', 
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)', 
        width: '100%',
        maxWidth: '440px',
        border: '1px solid #e1e8ed'
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px'
    },
    title: {
        color: '#2d3748',
        fontSize: '24px',
        margin: '0 0 8px 0',
        fontWeight: '700'
    },
    subtitle: {
        color: '#718096',
        fontSize: '15px',
        margin: 0
    },
    form: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '18px' 
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#4a5568',
        marginRight: '4px'
    },
    input: { 
        padding: '12px 14px', 
        borderRadius: '10px', 
        border: '1px solid #cbd5e0', 
        fontSize: '15px', 
        backgroundColor: '#f8fafc',
        outline: 'none',
        transition: 'all 0.2s ease',
        textAlign: 'right'
    },
    button: { 
        marginTop: '10px',
        padding: '14px', 
        borderRadius: '10px', 
        border: 'none', 
        backgroundColor: '#3182ce', 
        color: '#fff', 
        fontSize: '16px', 
        fontWeight: '600', 
        cursor: 'pointer', 
        boxShadow: '0 4px 6px rgba(49, 130, 206, 0.2)',
        transition: 'background-color 0.2s' 
    },
    footer: {
        marginTop: '25px',
        textAlign: 'center',
        borderTop: '1px solid #edf2f7',
        paddingTop: '20px'
    },
    footerText: {
        color: '#718096',
        fontSize: '14px',
        marginBottom: '5px'
    },
    link: { 
        color: '#3182ce', 
        fontWeight: '600', 
        textDecoration: 'underline',
        fontSize: '14px'
    }
};