import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './component/login'; 
import { TeacherDashboard } from './component/TeacherDashboard';
import { StudentDashboard } from './component/StudentDashboard';
import { Register } from './component/Register'; // ודאי שזה מיובא נכון

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* דף הבית הוא הלוגין */}
        <Route path="/" element={<Login />} />
        
        {/* דף ההרשמה */}
        <Route path="/register" element={<Register />} />
        
        {/* דפים נוספים */}
    <Route path="/student-dashboard" element={<StudentDashboard />} />
    <Route path="/teacher-dashboard" element={<TeacherDashboard />} />      </Routes>
    </BrowserRouter>
  );
}

export default App;