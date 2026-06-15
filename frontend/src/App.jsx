import { useState } from 'react';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import LecturesArchive from './pages/LecturesArchive';

function App() {
  const [view, setView] = useState('login');
  const [user, setUser] = useState(null);

  const [lectures, setLectures] = useState([
    {
      id: 101, topic: 'Introduction to React Hooks', date: '2026-06-08', duration: '45:12',
      transcript: [
        { time: '10:05 AM', text: "Good morning, let's get started with React Hooks." },
        { time: '10:12 AM', text: 'Hooks were introduced in React 16.8 for state in functions.' },
        { time: '10:25 AM', text: 'useState allows functional components to have local state.' },
        { time: '10:38 AM', text: 'useEffect handles side effects like API calls.' },
        { time: '10:48 AM', text: 'Always follow the rules of hooks.' },
      ],
      quizzes: [{ question: 'Which Hook handles side-effects?', correctIndex: 1 }],
    },
    {
      id: 102, topic: 'Web Application Security (JWT & CSRF)', date: '2026-06-09', duration: '52:40',
      transcript: [
        { time: '02:02 PM', text: 'Welcome to our web security session.' },
        { time: '02:10 PM', text: 'JWT is useful for stateless authentication.' },
        { time: '02:22 PM', text: 'CSRF occurs when bad sites use your active cookies.' },
        { time: '02:35 PM', text: 'Anti-CSRF tokens validate request origin.' },
        { time: '02:48 PM', text: 'HttpOnly cookies block JavaScript token theft.' },
      ],
      quizzes: [{ question: 'What are the three parts of a JWT?', correctIndex: 1 }],
    },
  ]);

  const handleLogin = (role, name) => { setUser({ role, name }); setView('dashboard'); };
  const handleLogout = () => { setUser(null); setView('login'); };
  const handleNavigate = (v) => setView(v);

  return (
    <div className="app-container">
      {view === 'login' && <Login onLogin={handleLogin} onNavigate={handleNavigate} />}
      {view === 'forgot' && <ForgotPassword onNavigate={handleNavigate} />}

      {view === 'dashboard' && user?.role === 'admin' && (
        <AdminDashboard user={user} onLogout={handleLogout} onNavigate={handleNavigate} lectures={lectures} />
      )}
      {view === 'dashboard' && user?.role === 'teacher' && (
        <TeacherDashboard user={user} onLogout={handleLogout} onNavigate={handleNavigate} lectures={lectures} setLectures={setLectures} />
      )}
      {view === 'dashboard' && user?.role === 'student' && (
        <StudentDashboard user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
      )}

      {view === 'archive' && (
        <LecturesArchive user={user} onLogout={handleLogout} onNavigate={handleNavigate} lectures={lectures} />
      )}
    </div>
  );
}

export default App;
