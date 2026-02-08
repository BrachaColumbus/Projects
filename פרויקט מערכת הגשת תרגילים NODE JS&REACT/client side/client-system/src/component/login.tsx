import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/auth/login', { email, password });
            
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role);
            localStorage.setItem('userName', user.name);

            if (user.role === 'teacher') {
                navigate('/teacher-dashboard');
            } else {
                navigate('/student-dashboard');
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || "שגיאה לא ידועה";
            alert("שגיאה מהשרת: " + errorMsg);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>שלום, טוב לראות אותך!</h2>
                    <p style={styles.subtitle}>התחברי למערכת הניהול הבית ספרית</p>
                </div>
                
                <div style={styles.inputGroup}>
                    <label style={styles.label}>כתובת אימייל</label>
                    <input 
                        type="email" 
                        placeholder="example@mail.com" 
                        style={styles.input}
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    
                    <label style={styles.label}>סיסמה</label>
                    <input 
                        type="password" 
                        placeholder="הזינו סיסמה" 
                        style={styles.input}
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>

                <button style={styles.loginButton} onClick={handleLogin}>
                    כניסה למערכת
                </button>

                <div style={styles.footer}>
                    <p style={styles.footerText}>עדיין לא רשומה?</p>
                    <button style={styles.registerButton} onClick={() => navigate('/register')}>
                        לחצי כאן להרשמה מהירה
                    </button>
                </div>
            </div>
        </div>
    );
};

// עיצוב מקצועי ונקי (School Professional)
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f4f8', // אפור-תכלת בהיר ונעים
        direction: 'rtl',
        fontFamily: "'Assistant', 'Segoe UI', sans-serif"
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '45px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)', // צל רך מאוד
        width: '100%',
        maxWidth: '440px',
        border: '1px solid #e1e8ed'
    },
    header: {
        textAlign: 'center',
        marginBottom: '35px'
    },
    title: {
        color: '#2d3748', // כחול כהה פחמי
        fontSize: '24px',
        margin: '0 0 10px 0',
        fontWeight: '700'
    },
    subtitle: {
        color: '#718096',
        fontSize: '15px',
        margin: 0
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginBottom: '25px'
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#4a5568',
        marginRight: '4px'
    },
    input: {
        padding: '14px',
        borderRadius: '10px',
        border: '1px solid #cbd5e0',
        fontSize: '15px',
        backgroundColor: '#f8fafc',
        outline: 'none',
        transition: 'all 0.2s ease',
        textAlign: 'right'
    },
    loginButton: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#3182ce', // כחול בית ספר קלאסי
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: '600',
        boxShadow: '0 4px 6px rgba(49, 130, 206, 0.2)',
        transition: 'background-color 0.2s'
    },
    footer: {
        marginTop: '30px',
        textAlign: 'center',
        borderTop: '1px solid #edf2f7',
        paddingTop: '20px'
    },
    footerText: {
        color: '#718096',
        fontSize: '14px',
        marginBottom: '5px'
    },
    registerButton: {
        background: 'none',
        border: 'none',
        color: '#3182ce',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'underline'
    }
};