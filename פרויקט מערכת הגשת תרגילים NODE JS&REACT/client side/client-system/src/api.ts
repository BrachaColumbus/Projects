import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000', // הכתובת של השרת 
});

// הוספת הטוקן באופן אוטומטי לכל בקשה
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const GlobalAPI = {
    // --- פעולות סטודנטית ---
    login: (credentials: any) => api.post('/auth/login', credentials),
    getAssignments: () => api.get('/assignments'), // רשימת כל המטלות שקיימות
    submitAssignment: (data: any) => api.post('/student/subbmission/submit', data),
    getMySubmissions: (studentId: string) => api.get(`/student/submissions/${studentId}`),

    // --- פעולות מורה ---
    getAllSubmissions: () => api.get('/teacher/submissions'),
    updateGrade: (studentId: string, assignmentId: string, data: { grade: number, feedback: string }) => 
        api.put(`/teacher/submissions/${studentId}/${assignmentId}`, data),
};

export default api;