import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import your components
import VidyastraLogin from './pages/loginpage.jsx';
import ForgotPassword from './pages/forgot_password.jsx';
import StudentDashboard from './pages/Student_dashboard.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The main login page */}
        <Route path="/" element={<VidyastraLogin />} />
        
        {/* The forgot password page */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

         {/* The Student dashboard page */}
         <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;