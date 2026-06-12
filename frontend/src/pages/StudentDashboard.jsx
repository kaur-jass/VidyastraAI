import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';

const StudentDashboard = ({ user, onLogout, onNavigate }) => {
  const [view, setView] = useState('home'); // home (Dashboard), live (Live Classes), recorded, notes, quiz (Quiz & Results), attendance, announcements
  const [transcript, setTranscript] = useState([]);
  const [isLive, setIsLive] = useState(true);

  // Quiz state
  const [liveQuiz, setLiveQuiz] = useState(null);
  const [quizTimer, setQuizTimer] = useState(15);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState('');
  const [score, setScore] = useState(0);

  // Notes
  const [studentNotes, setStudentNotes] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Filter Dropdowns
  const [deptFilter, setDeptFilter] = useState('Computer Science & Engineering');
  const [semFilter, setSemFilter] = useState('2nd Semester');
  const [secFilter, setSecFilter] = useState('CSE - A');

  const [toastMessage, setToastMessage] = useState('');

  // Attendance records Mock
  const [attendancePercent, setAttendancePercent] = useState(92);
  const [attendanceLog] = useState([
    { date: '12 Jun 2026', subject: 'Web Development', status: 'Present' },
    { date: '11 Jun 2026', subject: 'Data Structures', status: 'Present' },
    { date: '10 Jun 2026', subject: 'Mathematics III', status: 'Absent' },
    { date: '09 Jun 2026', subject: 'Database Management System', status: 'Present' },
    { date: '08 Jun 2026', subject: 'Computer Organization', status: 'Present' }
  ]);

  // Toast helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Listen for quiz events + simulate transcript captions
  useEffect(() => {
    const handleQuiz = (e) => {
      setLiveQuiz(e.detail);
      setQuizTimer(15);
      setSelectedOption(null);
      setQuizSubmitted(false);
      setQuizFeedback('');
      triggerToast("⚠️ NEW LIVE QUIZ HAS BEEN PUSHED! Click to answer.");
      setView('live'); // Redirect to live view to answer!
    };
    window.addEventListener('new-live-quiz', handleQuiz);

    let idx = 0;
    const lines = [
      "Today we'll discuss modern web development patterns.",
      "Hooks allow state management in functional components.",
      "useState returns an array with the current value and a setter.",
      "useEffect runs code after every render, useful for API calls.",
      "Always declare hooks at the top level of your component.",
      "Let's check your understanding with a quick quiz!"
    ];
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setTranscript(prev => [...prev, { time, text: lines[idx % lines.length] }]);
      idx++;
    }, 7000);

    return () => {
      window.removeEventListener('new-live-quiz', handleQuiz);
      clearInterval(interval);
    };
  }, []);

  // Quiz countdown timer
  useEffect(() => {
    if (liveQuiz && quizTimer > 0 && !quizSubmitted) {
      const t = setTimeout(() => setQuizTimer(quizTimer - 1), 1000);
      return () => clearTimeout(t);
    }
    if (quizTimer === 0 && !quizSubmitted) {
      submitQuiz();
    }
  }, [liveQuiz, quizTimer, quizSubmitted]);

  const submitQuiz = () => {
    setQuizSubmitted(true);
    if (selectedOption === null) {
      setQuizFeedback("Time's up! No answer selected.");
      triggerToast("Time's up! Quiz expired.");
      return;
    }
    const correct = selectedOption === liveQuiz.correctIndex;
    if (correct) {
      setScore(s => s + 10);
      setQuizFeedback(`✓ Correct! +10 pts. ${liveQuiz.explanation}`);
      triggerToast("🎉 Correct Answer! +10 points added.");
    } else {
      setQuizFeedback(`✗ Incorrect. Answer was ${['A', 'B', 'C', 'D'][liveQuiz.correctIndex]}. ${liveQuiz.explanation}`);
      triggerToast("✗ Incorrect Answer. Try again next time!");
    }
  };

  const generateAiNotes = () => {
    if (transcript.length === 0) {
      alert('No lecture content yet! Attend live classes to gather notes.');
      return;
    }
    const text = transcript.map(l => l.text).join(' ').toLowerCase();
    let s = `# AI Study Notes\n*Generated for ${user?.name || "Rohan Sharma"} on ${new Date().toLocaleDateString()}*\n\n`;
    s += `## Key Concepts\n`;
    if (text.includes('hook') || text.includes('state')) {
      s += `- **useState**: Returns [currentValue, setter] for managing component state\n`;
      s += `- **useEffect**: Runs side-effects after render (API calls, timers)\n`;
      s += `- **Rules of Hooks**: Must be called at top level, only in React functions\n`;
    } else {
      s += `- **Introduction**: Conceptual breakdown of core principles\n`;
      s += `- **Deployment**: Lifecycle execution parameters\n`;
    }
    s += `\n## Summary\n`;
    s += `This lecture covered essential components, focusing on correct setup, structure, and lifecycle flows. Ensure variables are scoped and logic is checked.\n`;
    s += `\n## Quick Review\n`;
    s += `1. Identify the core principles discussed today.\n`;
    s += `2. What are the key rules for proper implementation?\n`;
    setAiSummary(s);
    setShowSummaryModal(true);
  };

  const downloadNotes = () => {
    const blob = new Blob([aiSummary], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'VidyastraAI_StudyNotes.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast("Notes downloaded successfully!");
  };

  const sidebarItems = [
    { id: 'home', label: 'Dashboard', icon: 'glyphicon-home' },
    { id: 'live', label: 'Live Classes', icon: 'glyphicon-facetime-video' },
    { id: 'recorded', label: 'Recorded Lectures', icon: 'glyphicon-film' },
    { id: 'notes', label: 'My Notes', icon: 'glyphicon-pencil' },
    { id: 'quiz', label: 'Quiz & Results', icon: 'glyphicon-check' },
    { id: 'attendance', label: 'Attendance', icon: 'glyphicon-calendar' },
    { id: 'announcements', label: 'Announcements', icon: 'glyphicon-bullhorn' }
  ];

  const notifications = [
    { text: "New Live Class: Dr. Sarah Verma started Web Development.", tab: "live" },
    { text: "Study Materials: SQL slides uploaded.", tab: "notes" },
    { text: "Grade updated: Mathematics midterm marks out.", tab: "quiz" }
  ];

  return (
    <DashboardLayout
      user={user}
      onLogout={onLogout}
      activeTab={view}
      onTabChange={setView}
      sidebarItems={sidebarItems}
      dashboardTitle="Student Dashboard"
      roleLabel="B.Tech CSE"
      roleBadgeClass="student"
      notificationCount={3}
      notifications={notifications}
    >
      {/* Student specific styles */}
      <style>{`
        /* Top Filter Box Row */
        .filters-inline-row {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .filter-select-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 6px 12px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }
        .filter-select-wrapper label {
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
          color: #6b7280;
          margin: 0;
        }
        .filter-select-inline {
          border: none;
          outline: none;
          font-size: 13px;
          font-weight: 600;
          color: #1f2937;
          background: none;
          cursor: pointer;
        }

        /* Grid Panels layout - Triple columns */
        .panels-grid-3 {
          display: grid;
          grid-template-columns: 1.1fr 1fr 1.2fr;
          gap: 20px;
          margin-bottom: 24px;
        }
        @media (max-width: 992px) {
          .panels-grid-3 {
            grid-template-columns: 1fr;
          }
        }
        
        /* Upcoming lists */
        .upcoming-row-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        .upcoming-meta-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .upcoming-time {
          font-size: 12px;
          color: #4b5563;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .upcoming-subject {
          font-size: 14px;
          font-weight: 700;
          color: #111827;
        }
        .upcoming-teacher {
          font-size: 11px;
          color: #6b7280;
        }
        .badge-live-pill {
          background-color: #3b82f6;
          color: white;
          font-size: 10px;
          font-weight: bold;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .badge-upcoming-pill {
          background-color: #f3f4f6;
          color: #2563eb;
          font-size: 10px;
          font-weight: bold;
          padding: 2px 8px;
          border-radius: 4px;
        }
        
        /* Circle Initials Subjects */
        .subject-roster-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        .subject-circle-initial {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 12px;
        }
        .subj-color-blue { background-color: #eff6ff; color: #1d4ed8; }
        .subj-color-orange { background-color: #fff7ed; color: #c2410c; }
        .subj-color-purple { background-color: #faf5ff; color: #7e22ce; }
        .subj-color-green { background-color: #f0fdf4; color: #15803d; }
        .subj-color-pink { background-color: #fdf2f8; color: #db2777; }
        
        /* Links style */
        .link-blue-new {
          color: #2563eb;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
        }
        .link-blue-new:hover {
          text-decoration: underline;
        }

        /* Recent lecture rows */
        .recent-lecture-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        .recent-left-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .play-btn-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: #f3f4f6;
          color: #002e5b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: none;
          transition: background-color 0.2s;
        }
        .play-btn-circle:hover {
          background-color: #e5e7eb;
        }
        .recent-meta-text {
          display: flex;
          flex-direction: column;
        }
        .recent-title {
          font-size: 13px;
          font-weight: bold;
          color: #1f2937;
        }
        .recent-sub {
          font-size: 11px;
          color: #6b7280;
        }
        
        /* Large button bottom */
        .btn-full-browse {
          background-color: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1d4ed8;
          font-weight: 600;
          font-size: 13px;
          padding: 10px;
          width: 100%;
          border-radius: 6px;
          cursor: pointer;
          text-align: center;
          margin-top: 10px;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .btn-full-browse:hover {
          background-color: #dbeafe;
        }
        
        /* Grid Panels layout - Double columns bottom */
        .panels-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }
        @media (max-width: 768px) {
          .panels-grid-2 {
            grid-template-columns: 1fr;
          }
        }
        
        .action-banner-card {
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .action-card-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .action-card-icon-round {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        .btn-action-solid {
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: bold;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .btn-action-solid:hover {
          opacity: 0.9;
        }

        /* Overlay Modals */
        .modal-overlay-new {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(2px);
          z-index: 1050;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .modal-box-new {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
          width: 100%;
          max-width: 480px;
          padding: 24px;
          position: relative;
        }
        .modal-box-lg-new {
          max-width: 640px;
        }
        .quiz-option-btn-new {
          width: 100%;
          padding: 12px 16px;
          text-align: left;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          background-color: white;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }
        .quiz-option-btn-new:hover {
          background-color: #f8fafc;
          border-color: #94a3b8;
        }
        .quiz-option-btn-new.selected {
          border-color: #002e5b;
          background-color: #eff6ff;
          font-weight: 600;
          box-shadow: 0 0 0 2px rgba(0,46,91,0.1);
        }
        .badge-red-pill {
          background-color: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: bold;
          padding: 2px 8px;
          border-radius: 9999px;
          letter-spacing: 0.5px;
        }
        .btn-outline-new {
          border: 1px solid #cbd5e1;
          background-color: white;
          color: #4b5563;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .btn-outline-new:hover {
          background-color: #f9fafb;
        }
        .btn-solid-new {
          border: none;
          background-color: #002e5b;
          color: white;
          padding: 8px 18px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .btn-solid-new:hover {
          background-color: #001c3d;
        }
      `}</style>

      {/* A. DASHBOARD VIEW (OVERVIEW) */}
      {view === 'home' && (
        <div className="animate-fade-in">
          <div className="greeting-section">
            <div>
              <h1 className="greeting-title">Welcome back, {user?.name || "Rohan Sharma"}! 👋</h1>
              <p className="greeting-sub">Keep learning, keep growing!</p>
            </div>
            
            {/* Selector filters row */}
            <div className="filters-inline-row">
              <div className="filter-select-wrapper">
                <span className="glyphicon glyphicon-briefcase" style={{ color: '#002e5b' }}></span>
                <label>Department</label>
                <select className="filter-select-inline" value={deptFilter} onChange={e => { setDeptFilter(e.target.value); triggerToast(`Dept: ${e.target.value}`); }}>
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                </select>
              </div>

              <div className="filter-select-wrapper">
                <span className="glyphicon glyphicon-calendar" style={{ color: '#002e5b' }}></span>
                <label>Semester</label>
                <select className="filter-select-inline" value={semFilter} onChange={e => { setSemFilter(e.target.value); triggerToast(`Semester: ${e.target.value}`); }}>
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                  <option value="3rd Semester">3rd Semester</option>
                  <option value="4th Semester">4th Semester</option>
                </select>
              </div>

              <div className="filter-select-wrapper">
                <span className="glyphicon glyphicon-user" style={{ color: '#002e5b' }}></span>
                <label>Section</label>
                <select className="filter-select-inline" value={secFilter} onChange={e => { setSecFilter(e.target.value); triggerToast(`Section: ${e.target.value}`); }}>
                  <option value="CSE - A">CSE - A</option>
                  <option value="CSE - B">CSE - B</option>
                  <option value="IT - A">IT - A</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="stats-grid">
            <StatCard
              icon="glyphicon-book"
              count={6}
              label="Subjects Enrolled"
              subtext="View all subjects →"
              subtextColorClass="link-blue-new"
              iconBgColorClass="color-blue-bg"
              onClick={() => triggerToast("Viewing enrollment details")}
            />

            <StatCard
              icon="glyphicon-facetime-video"
              count={12}
              label="Live Classes Today"
              subtext="View timetable →"
              subtextColorClass="text-success"
              iconBgColorClass="color-green-bg"
              onClick={() => setView('live')}
            />

            <StatCard
              icon="glyphicon-film"
              count={24}
              label="Lectures Completed"
              subtext="This semester"
              subtextColorClass="text-muted"
              iconBgColorClass="color-purple-bg"
              onClick={() => setView('recorded')}
            />

            <StatCard
              icon="glyphicon-check"
              count={`${score} pts`}
              label="Quiz Score"
              subtext="Participate in quizzes"
              subtextColorClass="text-muted"
              iconBgColorClass="color-red-bg"
              onClick={() => setView('quiz')}
            />
          </div>

          {/* Triple Grid Panel Rows */}
          <div className="panels-grid-3">
            
            {/* Column 1: Upcoming Today schedule */}
            <div className="panel-card-new">
              <div className="panel-header-new">
                <h2 className="panel-title-new">
                  <span className="glyphicon glyphicon-time"></span> Upcoming Today
                </h2>
                <span className="link-blue-new" onClick={() => triggerToast("Timetable details loaded")}>View Timetable</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="upcoming-row-item">
                  <div className="upcoming-meta-left">
                    <span className="upcoming-time">
                      <span className="glyphicon glyphicon-time" style={{ fontSize: '10px' }}></span> 09:00 AM - 10:00 AM
                    </span>
                    <span className="upcoming-subject">Data Structures</span>
                    <span className="upcoming-teacher">Dr. Sarah Verma</span>
                  </div>
                  <span className="badge-live-pill" style={{ cursor: 'pointer' }} onClick={() => setView('live')}>Live</span>
                </div>

                <div className="upcoming-row-item">
                  <div className="upcoming-meta-left">
                    <span className="upcoming-time">
                      <span className="glyphicon glyphicon-time" style={{ fontSize: '10px' }}></span> 10:15 AM - 11:15 AM
                    </span>
                    <span className="upcoming-subject">Web Development</span>
                    <span className="upcoming-teacher">Dr. Sarah Verma</span>
                  </div>
                  <span className="badge-live-pill" style={{ cursor: 'pointer' }} onClick={() => setView('live')}>Live</span>
                </div>

                <div className="upcoming-row-item">
                  <div className="upcoming-meta-left">
                    <span className="upcoming-time">
                      <span className="glyphicon glyphicon-time" style={{ fontSize: '10px' }}></span> 11:30 AM - 12:30 PM
                    </span>
                    <span className="upcoming-subject">Mathematics III</span>
                    <span className="upcoming-teacher">Dr. Rajesh Kumar</span>
                  </div>
                  <span className="badge-upcoming-pill">Upcoming</span>
                </div>

                <div className="upcoming-row-item">
                  <div className="upcoming-meta-left">
                    <span className="upcoming-time">
                      <span className="glyphicon glyphicon-time" style={{ fontSize: '10px' }}></span> 02:00 PM - 03:00 PM
                    </span>
                    <span className="upcoming-subject">Database Management System</span>
                    <span className="upcoming-teacher">Dr. Amit Singh</span>
                  </div>
                  <span className="badge-upcoming-pill">Upcoming</span>
                </div>
              </div>
              <span style={{ display: 'block', fontSize: '11px', color: '#9ca3af', marginTop: '12px' }}>
                All times in IST
              </span>
            </div>

            {/* Column 2: Enrolled subjects list */}
            <div className="panel-card-new">
              <div className="panel-header-new">
                <h2 className="panel-title-new">
                  <span className="glyphicon glyphicon-book"></span> My Subjects
                </h2>
                <span className="link-blue-new" onClick={() => triggerToast("Roster synchronized")}>View All</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div className="subject-roster-item">
                  <div className="subject-circle-initial subj-color-blue">DS</div>
                  <div className="upcoming-meta-left">
                    <span className="upcoming-subject" style={{ fontSize: '13px' }}>Data Structures</span>
                    <span className="upcoming-teacher">Dr. Sarah Verma</span>
                  </div>
                </div>

                <div className="subject-roster-item">
                  <div className="subject-circle-initial subj-color-blue">WD</div>
                  <div className="upcoming-meta-left">
                    <span className="upcoming-subject" style={{ fontSize: '13px' }}>Web Development</span>
                    <span className="upcoming-teacher">Dr. Sarah Verma</span>
                  </div>
                </div>

                <div className="subject-roster-item">
                  <div className="subject-circle-initial subj-color-orange">DB</div>
                  <div className="upcoming-meta-left">
                    <span className="upcoming-subject" style={{ fontSize: '13px' }}>Database Management System</span>
                    <span className="upcoming-teacher">Dr. Amit Singh</span>
                  </div>
                </div>

                <div className="subject-roster-item">
                  <div className="subject-circle-initial subj-color-purple">M3</div>
                  <div className="upcoming-meta-left">
                    <span className="upcoming-subject" style={{ fontSize: '13px' }}>Mathematics III</span>
                    <span className="upcoming-teacher">Dr. Rajesh Kumar</span>
                  </div>
                </div>

                <div className="subject-roster-item">
                  <div className="subject-circle-initial subj-color-green">CO</div>
                  <div className="upcoming-meta-left">
                    <span className="upcoming-subject" style={{ fontSize: '13px' }}>Computer Organization</span>
                    <span className="upcoming-teacher">Dr. Neha Gupta</span>
                  </div>
                </div>

                <div className="subject-roster-item">
                  <div className="subject-circle-initial subj-color-pink">DL</div>
                  <div className="upcoming-meta-left">
                    <span className="upcoming-subject" style={{ fontSize: '13px' }}>Digital Logic Design</span>
                    <span className="upcoming-teacher">Dr. Pawan Kumar</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Recent Recorded Lectures */}
            <div className="panel-card-new">
              <div className="panel-header-new">
                <h2 className="panel-title-new">
                  <span className="glyphicon glyphicon-film"></span> Recent Lectures
                </h2>
                <span className="link-blue-new" onClick={() => setView('recorded')}>View All</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="recent-lecture-row">
                  <div className="recent-left-group">
                    <button className="play-btn-circle" onClick={() => triggerToast("Playing: Introduction to React Hooks")}>
                      <span className="glyphicon glyphicon-play"></span>
                    </button>
                    <div className="recent-meta-text">
                      <span className="recent-title">Introduction to React Hooks</span>
                      <span className="recent-sub">Web Development</span>
                    </div>
                  </div>
                  <div className="recent-meta-text" style={{ textAlign: 'right', fontSize: '11px', color: '#6b7280' }}>
                    <span>08 Jun 2026</span>
                    <span>45:12</span>
                  </div>
                </div>

                <div className="recent-lecture-row">
                  <div className="recent-left-group">
                    <button className="play-btn-circle" onClick={() => triggerToast("Playing: Arrays and Linked Lists")}>
                      <span className="glyphicon glyphicon-play"></span>
                    </button>
                    <div className="recent-meta-text">
                      <span className="recent-title">Arrays and Linked Lists</span>
                      <span className="recent-sub">Data Structures</span>
                    </div>
                  </div>
                  <div className="recent-meta-text" style={{ textAlign: 'right', fontSize: '11px', color: '#6b7280' }}>
                    <span>07 Jun 2026</span>
                    <span>52:40</span>
                  </div>
                </div>

                <div className="recent-lecture-row">
                  <div className="recent-left-group">
                    <button className="play-btn-circle" onClick={() => triggerToast("Playing: Normalization in DBMS")}>
                      <span className="glyphicon glyphicon-play"></span>
                    </button>
                    <div className="recent-meta-text">
                      <span className="recent-title">Normalization in DBMS</span>
                      <span className="recent-sub">Database Management System</span>
                    </div>
                  </div>
                  <div className="recent-meta-text" style={{ textAlign: 'right', fontSize: '11px', color: '#6b7280' }}>
                    <span>06 Jun 2026</span>
                    <span>48:33</span>
                  </div>
                </div>

                <div className="recent-lecture-row">
                  <div className="recent-left-group">
                    <button className="play-btn-circle" onClick={() => triggerToast("Playing: Limits and Continuity")}>
                      <span className="glyphicon glyphicon-play"></span>
                    </button>
                    <div className="recent-meta-text">
                      <span className="recent-title">Limits and Continuity</span>
                      <span className="recent-sub">Mathematics III</span>
                    </div>
                  </div>
                  <div className="recent-meta-text" style={{ textAlign: 'right', fontSize: '11px', color: '#6b7280' }}>
                    <span>05 Jun 2026</span>
                    <span>46:18</span>
                  </div>
                </div>

                <button className="btn-full-browse" onClick={() => setView('recorded')}>
                  <span className="glyphicon glyphicon-play"></span> Browse All Recorded Lectures
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Quick Action Row Panels */}
          <div className="panels-grid-2">
            
            {/* Quiz Activity shortcut Banner */}
            <div className="action-banner-card" style={{ border: '1px solid #bbf7d0', backgroundColor: '#f0fdf4' }}>
              <div className="action-card-left">
                <div className="action-card-icon-round" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
                  <span className="glyphicon glyphicon-check"></span>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontWeight: 'bold', fontSize: '14px', color: '#14532d' }}>
                    Your current score: {score} pts
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#166534' }}>
                    Quizzes appear in real-time during live streaming classes.
                  </p>
                </div>
              </div>
              <button className="btn-action-solid" style={{ backgroundColor: '#16a34a' }} onClick={() => setView('live')}>
                Participate in Quiz
              </button>
            </div>

            {/* My Notes AI Summary shortcut Banner */}
            <div className="action-banner-card" style={{ border: '1px solid #fed7aa', backgroundColor: '#fff7ed' }}>
              <div className="action-card-left">
                <div className="action-card-icon-round" style={{ backgroundColor: '#ffedd5', color: '#c2410c' }}>
                  <span className="glyphicon glyphicon-edit"></span>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontWeight: 'bold', fontSize: '14px', color: '#7c2d12' }}>
                    Take notes & generate AI summary
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#9a3412' }}>
                    Compile transcripts to study guides and download to markdown notes.
                  </p>
                </div>
              </div>
              <button className="btn-action-solid" style={{ backgroundColor: '#ea580c' }} onClick={() => setView('notes')}>
                Go to My Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* B. LIVE CLASSROOM STREAM PLAYER */}
      {view === 'live' && (
        <div className="animate-fade-in">
          <button onClick={() => setView('home')} className="btn-outline-new" style={{ marginBottom: '16px', padding: '6px 12px' }}>
            <span className="glyphicon glyphicon-arrow-left"></span> Back to Dashboard
          </button>

          <div className="row">
            <div className="col-md-8">
              {/* Video Presentation */}
              <div className="panel-card-new" style={{ padding: 0, overflow: 'hidden', marginBottom: '16px' }}>
                <div className="panel-header-new" style={{ padding: '12px 20px', margin: 0, backgroundColor: '#002e5b', color: 'white' }}>
                  <h3 className="panel-title-new" style={{ color: 'white' }}>
                    <span className="glyphicon glyphicon-facetime-video"></span> Ongoing Lecture Presentation
                  </h3>
                  <span className="badge-red-pill">● LIVE</span>
                </div>
                
                <div style={{ backgroundColor: '#0f172a', aspectRatio: '1.6', display: 'flex', alignItems: 'center', justify: 'center', position: 'relative' }}>
                  <div style={{ width: '80%', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '24px', color: 'white' }}>
                    <span style={{ fontSize: '11px', color: '#fecd0b', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>Slide Presentation</span>
                    <h3 style={{ margin: '8px 0 16px 0', fontFamily: 'Outfit' }}>VidyastraAI Smart Teaching Room</h3>
                    
                    <div style={{ backgroundColor: '#020617', borderRadius: '6px', padding: '16px', fontSize: '13px', fontFamily: 'monospace', color: '#94a3b8', lineHeight: '1.6', borderLeft: '3px solid #3b82f6' }}>
                      {"// Smart whiteboard simulated content"}<br />
                      {"const [topic, setTopic] = useState(\"VidyastraAI Redesign\");"}<br />
                      {"console.log(`Currently learning: ${topic}`);"}
                    </div>
                  </div>
                  
                  <div style={{ position: 'absolute', bottom: '15px', left: '15px', backgroundColor: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', color: '#cbd5e1' }}>
                    📚 NIT JALANDHAR CLASSROOM E-PORTAL
                  </div>
                </div>
              </div>

              {/* Scrolling Captions Bar */}
              <div className="panel-card-new" style={{ padding: '12px 18px', borderLeft: '4px solid #3b82f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="badge-live-pill" style={{ backgroundColor: '#2563eb' }}>CAPTION</span>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: '#1f2937' }}>
                    {transcript.length > 0 ? transcript[transcript.length - 1].text : 'Waiting for instructor speech...'}
                  </span>
                </div>
              </div>
            </div>

            {/* Transcripts lists */}
            <div className="col-md-4">
              <div className="panel-card-new" style={{ height: '420px' }}>
                <div className="panel-header-new">
                  <h2 className="panel-title-new">
                    <span className="glyphicon glyphicon-comment"></span> Live Captions Log
                  </h2>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                  {transcript.length === 0 ? (
                    <div style={{ color: '#9ca3af', textAlign: 'center', padding: '40px 0', fontSize: '12px' }}>
                      Captions appear dynamically.
                    </div>
                  ) : (
                    transcript.map((l, i) => (
                      <div key={i} style={{ marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid #f1f5f9', fontSize: '12px' }}>
                        <span style={{ color: '#3b82f6', fontFamily: 'monospace', marginRight: '6px' }}>[{l.time}]</span>
                        <span>{l.text}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* C. RECORDED LECTURES */}
      {view === 'recorded' && (
        <div className="animate-fade-in">
          <h2 className="erp-page-title">
            <span className="glyphicon glyphicon-film"></span> Recorded Archives
          </h2>

          <div className="panel-card-new">
            <div className="table-responsive-new">
              <table className="custom-table-new">
                <thead>
                  <tr>
                    <th>Lecture Name</th>
                    <th>Subject</th>
                    <th>Record Date</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 'bold', color: '#002e5b' }}>Introduction to React Hooks</td>
                    <td>Web Development</td>
                    <td>08 Jun 2026</td>
                    <td>45:12</td>
                    <td>
                      <button className="btn-solid-new" style={{ padding: '4px 12px' }} onClick={() => triggerToast("Streaming recording link")}>Play</button>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 'bold', color: '#002e5b' }}>Arrays and Linked Lists</td>
                    <td>Data Structures</td>
                    <td>07 Jun 2026</td>
                    <td>52:40</td>
                    <td>
                      <button className="btn-solid-new" style={{ padding: '4px 12px' }} onClick={() => triggerToast("Streaming recording link")}>Play</button>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 'bold', color: '#002e5b' }}>Normalization in DBMS</td>
                    <td>Database Management System</td>
                    <td>06 Jun 2026</td>
                    <td>48:33</td>
                    <td>
                      <button className="btn-solid-new" style={{ padding: '4px 12px' }} onClick={() => triggerToast("Streaming recording link")}>Play</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* D. MY NOTES EDITOR & AI WRITER */}
      {view === 'notes' && (
        <div className="animate-fade-in">
          <h2 className="erp-page-title">
            <span className="glyphicon glyphicon-pencil"></span> Personal Notebook & study Guide
          </h2>

          <div className="row">
            <div className="col-md-7">
              <div className="panel-card-new">
                <div className="panel-header-new">
                  <h3 className="panel-title-new">My Personal Annotations</h3>
                </div>
                <textarea 
                  className="form-input-new" 
                  rows="14" 
                  style={{ resize: 'none', lineHeight: '1.6', fontSize: '14px' }} 
                  placeholder="Type personal notes, class summaries, or calculations here..." 
                  value={studentNotes} 
                  onChange={e => setStudentNotes(e.target.value)} 
                />
                <div style={{ marginTop: '12px' }}>
                  <button className="btn-solid-new" onClick={() => triggerToast("Notes saved to dashboard!")}>
                    <span className="glyphicon glyphicon-floppy-disk"></span> Save Notes
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-5">
              <div className="panel-card-new" style={{ borderLeft: '4px solid #ea580c', backgroundColor: '#fff7ed', marginBottom: '20px' }}>
                <div className="panel-header-new" style={{ border: 'none', padding: 0, margin: 0 }}>
                  <h3 className="panel-title-new" style={{ color: '#c2410c' }}>
                    <span className="glyphicon glyphicon-flash"></span> AI Study Guide compiler
                  </h3>
                </div>
                <p style={{ fontSize: '13px', color: '#9a3412', marginTop: '10px', lineHeight: '1.5' }}>
                  Translate live transcript captions from classroom streams into clean markdown summaries with check questions.
                </p>
                <button className="btn-action-solid" style={{ backgroundColor: '#ea580c', marginTop: '12px' }} onClick={generateAiNotes}>
                  Generate Study Guide
                </button>
              </div>

              <div className="panel-card-new">
                <div className="panel-header-new">
                  <h3 className="panel-title-new">Study Instructions</h3>
                </div>
                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px', color: '#4b5563', lineHeight: '1.8' }}>
                  <li>Connect to ongoing streaming classes to compile live captions.</li>
                  <li>Write down concepts in your notebook for retention.</li>
                  <li>Download AI summaries to markdown for offline reviews.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* E. QUIZ & RESULTS VIEW */}
      {view === 'quiz' && (
        <div className="animate-fade-in">
          <h2 className="erp-page-title">
            <span className="glyphicon glyphicon-check"></span> Quizzes & Scoreboards
          </h2>

          <div className="row">
            <div className="col-md-6">
              <div className="panel-card-new" style={{ minHeight: '280px' }}>
                <div className="panel-header-new">
                  <h3 className="panel-title-new">Quiz Performance Log</h3>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '30px 0' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justify: 'center', fontSize: '32px', marginBottom: '16px' }}>
                    🏆
                  </div>
                  <h4 style={{ fontWeight: 'bold', margin: '0 0 6px 0' }}>Score: {score} pts</h4>
                  <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
                    Score increases by 10 points for each correct answer pushed live!
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="panel-card-new">
                <div className="panel-header-new">
                  <h3 className="panel-title-new">Live Classroom leaderboard</h3>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifycontent: 'space-between', justifyContent: 'space-between', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '13px' }}>
                    <strong>1. Anjali Verma</strong>
                    <span style={{ fontWeight: 'bold', color: '#2563eb' }}>40 pts</span>
                  </div>
                  <div style={{ display: 'flex', justifycontent: 'space-between', justifyContent: 'space-between', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '13px' }}>
                    <strong>2. Priya Patel</strong>
                    <span style={{ fontWeight: 'bold', color: '#2563eb' }}>30 pts</span>
                  </div>
                  <div style={{ display: 'flex', justifycontent: 'space-between', justifyContent: 'space-between', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '13px' }}>
                    <strong>3. Amit Sharma</strong>
                    <span style={{ fontWeight: 'bold', color: '#2563eb' }}>20 pts</span>
                  </div>
                  <div style={{ display: 'flex', justifycontent: 'space-between', justifyContent: 'space-between', padding: '8px', backgroundColor: '#eff6ff', borderRadius: '6px', fontSize: '13px', border: '1px solid #bfdbfe' }}>
                    <strong>4. Rohan Sharma (You)</strong>
                    <span style={{ fontWeight: 'bold', color: '#2563eb' }}>{score} pts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* F. ATTENDANCE VIEW */}
      {view === 'attendance' && (
        <div className="animate-fade-in">
          <h2 className="erp-page-title">
            <span className="glyphicon glyphicon-calendar"></span> Attendance Logs
          </h2>

          <div className="row">
            <div className="col-md-4">
              <div className="panel-card-new" style={{ textAlign: 'center', padding: '30px 20px' }}>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#16a34a', marginBottom: '8px' }}>
                  {attendancePercent}%
                </div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold', color: '#002e5b' }}>Average Attendance</h3>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                  Minimum 75% required to qualify for NIT Jalandhar end-term examinations.
                </p>
              </div>
            </div>

            <div className="col-md-8">
              <div className="panel-card-new">
                <div className="panel-header-new">
                  <h3 className="panel-title-new">Recent Attendance Sheets</h3>
                </div>
                
                <div className="table-responsive-new">
                  <table className="custom-table-new">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Subject</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceLog.map((log, idx) => (
                        <tr key={idx}>
                          <td>{log.date}</td>
                          <td style={{ fontWeight: 'bold' }}>{log.subject}</td>
                          <td>
                            <span style={{
                              backgroundColor: log.status === 'Present' ? '#dcfce7' : '#fee2e2',
                              color: log.status === 'Present' ? '#16a34a' : '#ef4444',
                              padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold'
                            }}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* G. ANNOUNCEMENTS VIEW */}
      {view === 'announcements' && (
        <div className="animate-fade-in">
          <h2 className="erp-page-title">
            <span className="glyphicon glyphicon-bullhorn"></span> Notices & Board announcements
          </h2>

          <div className="panel-card-new" style={{ gap: '16px' }}>
            <div style={{ borderLeft: '4px solid #002e5b', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '0 8px 8px 0' }}>
              <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                <strong>FROM: DR. SARAH VERMA</strong>
                <span>12 June 2026</span>
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: '#002e5b' }}>Web Design Mockup Review Scheduled</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#4b5563' }}>
                Please review the Teacher and Student dashboard mockups shared during classes. Final implementations are being evaluated.
              </p>
            </div>

            <div style={{ borderLeft: '4px solid #002e5b', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '0 8px 8px 0' }}>
              <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                <strong>FROM: DEAN ACADEMICS</strong>
                <span>08 June 2026</span>
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: '#002e5b' }}>End-Term Exam Schedules</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#4b5563' }}>
                Final schedules are compiled. Verify exam halls and timing rosters on the institute notice board.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Live quiz modal popup overlay when pushed */}
      {liveQuiz && !quizSubmitted && (
        <div className="modal-overlay-new">
          <div className="modal-box-new">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ backgroundColor: '#fef3c7', color: '#d97706', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px' }}>LIVE CLASS QUIZ</span>
              <span style={{ fontWeight: 'bold', color: quizTimer <= 5 ? '#ef4444' : '#d97706', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="glyphicon glyphicon-time"></span> {quizTimer}s
              </span>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#002e5b', marginBottom: '20px', lineHeight: '1.4' }}>
              {liveQuiz.question}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {liveQuiz.options.map((option, i) => (
                <button 
                  key={i} 
                  className={`quiz-option-btn-new ${selectedOption === i ? 'selected' : ''}`}
                  onClick={() => setSelectedOption(i)}
                >
                  {option}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                className="btn-solid-new" 
                style={{ flex: 1, height: '40px' }}
                onClick={submitQuiz}
              >
                Submit Answer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live quiz results feedback popup */}
      {liveQuiz && quizSubmitted && (
        <div className="modal-overlay-new">
          <div className="modal-box-new" style={{ textAlign: 'center', padding: '30px 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>
              {selectedOption === liveQuiz.correctIndex ? '🎉' : '❌'}
            </div>
            <h3 style={{ color: '#002e5b', fontWeight: 'bold', margin: '0 0 8px 0' }}>
              {selectedOption === liveQuiz.correctIndex ? 'Correct Answer!' : 'Incorrect Answer!'}
            </h3>
            <p style={{ color: '#4b5563', fontSize: '13px', lineHeight: '1.6', marginBottom: '24px' }}>
              {quizFeedback}
            </p>
            <button className="btn-outline-new" style={{ padding: '8px 24px' }} onClick={() => setLiveQuiz(null)}>
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* AI summarized notes modal */}
      {showSummaryModal && (
        <div className="modal-overlay-new">
          <div className="modal-box-new modal-box-lg-new">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#002e5b', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="glyphicon glyphicon-flash" style={{ color: '#ea580c' }}></span> AI Summarized Study Guide
              </h3>
              <button className="btn-outline-new" style={{ padding: '4px 8px', borderRadius: '50%' }} onClick={() => setShowSummaryModal(false)}>✕</button>
            </div>

            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-wrap', maxHeight: '380px', overflowY: 'auto' }}>
              {aiSummary}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'flex-end' }}>
              <button className="btn-solid-new" onClick={downloadNotes}>
                <span className="glyphicon glyphicon-download"></span> Download Markdown
              </button>
              <button className="btn-outline-new" onClick={() => setShowSummaryModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast popup */}
      {toastMessage && (
        <div className="floating-toast-new">
          <span className="glyphicon glyphicon-info-sign" style={{ marginRight: '8px' }}></span>
          {toastMessage}
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;
