import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';

const TeacherDashboard = ({ user, onLogout, onNavigate, lectures, setLectures }) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, classroom, recorded, quiz, results, students, announcements, analytics, settings

  // Streaming state
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamDuration, setStreamDuration] = useState(0);
  const [transcript, setTranscript] = useState([]);
  
  // Lecture Configuration Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardSemester, setWizardSemester] = useState('2nd Semester');
  const [wizardBranch, setWizardBranch] = useState('Computer Science (CSE)');
  const [wizardSection, setWizardSection] = useState('Section A');
  const [wizardSubject, setWizardSubject] = useState('Web Development');
  const [wizardTopic, setWizardTopic] = useState('');

  // Active Lecture details (once started)
  const [activeLecture, setActiveLecture] = useState(null);

  // Webcam
  const videoRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);

  // Quiz
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [customOptions, setCustomOptions] = useState(['', '', '', '']);
  const [customAnswer, setCustomAnswer] = useState(0);

  // Notifications and Toast trigger
  const [toastMessage, setToastMessage] = useState('');

  const notifications = [
    { text: "Quiz Results updated: 42 students responded to 'React Hooks'.", tab: "results" },
    { text: "Announcement sent: Midterm schedules posted.", tab: "announcements" },
    { text: "System update: Classroom simulator ready.", tab: "overview" }
  ];

  // Sidebar items
  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: 'glyphicon-home' },
    { id: 'classroom', label: 'Live Classroom', icon: 'glyphicon-facetime-video' },
    { id: 'recorded', label: 'Recorded Lectures', icon: 'glyphicon-film' },
    { id: 'quiz', label: 'Quiz Manager', icon: 'glyphicon-question-sign' },
    { id: 'results', label: 'Student Results', icon: 'glyphicon-list-alt' },
    { id: 'students', label: 'Students', icon: 'glyphicon-user' },
    { id: 'announcements', label: 'Announcements', icon: 'glyphicon-bullhorn', hasSubmenu: true },
    { id: 'analytics', label: 'Analytics', icon: 'glyphicon-stats' },
    { id: 'settings', label: 'Settings', icon: 'glyphicon-cog' }
  ];

  // Students list
  const [connectedStudents, setConnectedStudents] = useState([
    { id: 1, name: 'Amit Sharma', score: 20, lastAnswer: null, speed: 0, roll: '24103001', status: 'Online' },
    { id: 2, name: 'Priya Patel', score: 30, lastAnswer: null, speed: 0, roll: '24103002', status: 'Online' },
    { id: 3, name: 'Rohan Gupta', score: 10, lastAnswer: null, speed: 0, roll: '24103003', status: 'Online' },
    { id: 4, name: 'Anjali Verma', score: 40, lastAnswer: null, speed: 0, roll: '24103004', status: 'Online' },
    { id: 5, name: 'Vikram Singh', score: 0, lastAnswer: null, speed: 0, roll: '24103005', status: 'Online' },
  ]);
  
  const [quizResults, setQuizResults] = useState({ A: 0, B: 0, C: 0, D: 0, total: 0 });

  // Upcoming classes mock schedule
  const [upcomingClasses] = useState([
    { time: '11:30 AM - 12:30 PM', class: 'CSE - 2B', subject: 'Web Development', section: 'Section B' },
    { time: '02:00 PM - 03:00 PM', class: 'IT - 2A', subject: 'Web Development', section: 'Section A' }
  ]);

  // Toast helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Timer for active stream
  useEffect(() => {
    let interval;
    if (isStreaming) {
      interval = setInterval(() => setStreamDuration(p => p + 1), 1000);
    } else {
      setStreamDuration(0);
    }
    return () => clearInterval(interval);
  }, [isStreaming]);

  // Topic Scripts & Quiz references
  const TOPIC_SCRIPTS = {
    react: [
      { text: "Good morning class! Today we will learn about React Hooks.", keyword: "react" },
      { text: "The most fundamental Hook is useState. It returns a state variable and an updater function.", keyword: "state" },
      { text: "Next, we have useEffect, which lets us perform side effects in functional components.", keyword: "effect" },
    ],
    security: [
      { text: "Today we will cover Web Application Security basics.", keyword: "security" },
      { text: "We often use JWT (JSON Web Tokens) to verify users securely.", keyword: "jwt" },
      { text: "Let's talk about Cross-Site Request Forgery, or CSRF.", keyword: "csrf" },
    ],
    physics: [
      { text: "Let's explore Newton's Laws of Motion.", keyword: "motion" },
      { text: "The First Law states that an object stays at rest unless acted on by a force.", keyword: "force" },
      { text: "The Second Law: force equals mass times acceleration.", keyword: "mass" },
    ],
  };

  const TOPIC_QUIZZES = {
    react: [
      { id: 'q1', keyword: 'state', question: 'What does the useState Hook return?', options: ['A: A single state value', 'B: A function to update state only', 'C: An array with current state and updater', 'D: A DOM reference'], correctIndex: 2, explanation: 'useState returns [currentState, setStateFunction].' },
      { id: 'q2', keyword: 'effect', question: 'Which Hook handles side-effects?', options: ['A: useState', 'B: useEffect', 'C: useContext', 'D: useReducer'], correctIndex: 1, explanation: 'useEffect handles side-effects like API calls.' },
    ],
    security: [
      { id: 'q3', keyword: 'jwt', question: 'What are the three parts of a JWT?', options: ['A: Username, Password, Captcha', 'B: Header, Payload, Signature', 'C: ClientID, Secret, Scope', 'D: Request, Response, Cookies'], correctIndex: 1, explanation: 'JWT = Header.Payload.Signature' },
      { id: 'q4', keyword: 'csrf', question: 'What prevents Cross-Site Request Forgery?', options: ['A: Anti-CSRF Tokens', 'B: Hashing Passwords', 'C: Captcha only', 'D: HTTPS only'], correctIndex: 0, explanation: 'Anti-CSRF tokens validate request origin.' },
    ],
    physics: [
      { id: 'q5', keyword: 'force', question: "Newton's First Law is also known as?", options: ['A: Law of Momentum', 'B: Law of Inertia', 'C: Law of Gravity', 'D: Law of Acceleration'], correctIndex: 1, explanation: "It's the Law of Inertia." },
      { id: 'q6', keyword: 'mass', question: 'What does F = ma stand for?', options: ['A: Friction = Mass × Acceleration', 'B: Force = Mass × Acceleration', 'C: Force = Mass / Acceleration', 'D: Frequency = Mass × Amplitude'], correctIndex: 1, explanation: 'Force = Mass × Acceleration.' },
    ],
  };

  const getScriptForTopic = (topicName) => {
    const t = (topicName || '').toLowerCase();
    if (t.includes('react') || t.includes('hook') || t.includes('state') || t.includes('effect')) {
      return TOPIC_SCRIPTS.react;
    } else if (t.includes('security') || t.includes('jwt') || t.includes('csrf') || t.includes('auth')) {
      return TOPIC_SCRIPTS.security;
    } else if (t.includes('physics') || t.includes('motion') || t.includes('force') || t.includes('newton')) {
      return TOPIC_SCRIPTS.physics;
    } else {
      return [
        { text: `Good morning class! Today we will learn about ${topicName || 'our selected topic'}.`, keyword: "intro" },
        { text: `Let's dive deeper into the core principles of ${topicName || 'this subject'} and explore practical implementation details.`, keyword: "core" },
        { text: `To understand this topic thoroughly, we need to examine real-world use cases and review questions.`, keyword: "concept" },
      ];
    }
  };

  const getQuizzesForTopic = (topicName) => {
    const t = (topicName || '').toLowerCase();
    if (t.includes('react') || t.includes('hook') || t.includes('state') || t.includes('effect')) {
      return TOPIC_QUIZZES.react;
    } else if (t.includes('security') || t.includes('jwt') || t.includes('csrf') || t.includes('auth')) {
      return TOPIC_QUIZZES.security;
    } else if (t.includes('physics') || t.includes('motion') || t.includes('force') || t.includes('newton')) {
      return TOPIC_QUIZZES.physics;
    } else {
      return [
        { id: 'c_q1', keyword: 'intro', question: `What is the primary objective of studying ${topicName || 'this topic'}?`, options: ['A: Understanding foundational concepts', 'B: Avoiding testing completely', 'C: Hardcoding values directly', 'D: None of the above'], correctIndex: 0, explanation: 'Establishing foundational knowledge is the primary objective.' },
        { id: 'c_q2', keyword: 'concept', question: `Which method is best suited for deploying ${topicName || 'this topic'}?`, options: ['A: Guessing outcomes', 'B: Structured lifecycle execution and review', 'C: Deferring execution indefinitely', 'D: Manual entry without logs'], correctIndex: 1, explanation: 'Structured lifecycle execution guarantees optimal outcomes.' }
      ];
    }
  };

  const addTranscriptLine = (text, topicStr) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTranscript(prev => [...prev, { time, text }]);
    const lower = text.toLowerCase();
    const quizzes = getQuizzesForTopic(topicStr);
    quizzes.forEach(q => {
      if (lower.includes(q.keyword)) {
        setAiSuggestions(prev => prev.some(s => s.id === q.id) ? prev : [q, ...prev]);
      }
    });
  };

  // Simulated transcript engine
  useEffect(() => {
    let timer, idx = 0;
    if (isStreaming && activeLecture) {
      const script = getScriptForTopic(activeLecture.topic);
      timer = setInterval(() => {
        if (idx < script.length) {
          addTranscriptLine(script[idx].text, activeLecture.topic);
          idx++;
        } else {
          idx = 0;
        }
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [isStreaming, activeLecture]);

  // Camera settings
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setCameraStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) {
      console.warn("Camera unavailable, using simulation mode.", e);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
  };

  // Start Stream Flow
  const handleStartStream = () => {
    if (!wizardTopic.trim()) {
      triggerToast("Please write a topic name in Step 3 before starting!");
      return;
    }

    const shortSection = wizardSection.includes("A") ? "2A" : "2B";
    const shortBranch = wizardBranch.includes("CSE") ? "CSE" : "IT";

    const newLectureMeta = {
      class: `${shortBranch} - ${shortSection}`,
      subject: wizardSubject,
      topic: wizardTopic,
      startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      studentsJoined: '42 / 58',
      fullClass: `${wizardBranch} (${wizardSemester} - ${wizardSection})`
    };

    setActiveLecture(newLectureMeta);
    setIsStreaming(true);
    setTranscript([]);
    setAiSuggestions([]);
    setActiveQuiz(null);
    setQuizResults({ A: 0, B: 0, C: 0, D: 0, total: 0 });
    startCamera();
    
    triggerToast(`Lecture on "${wizardTopic}" started successfully!`);
    setActiveTab('classroom'); // switch to live feed screen
  };

  // Stop Stream Flow
  const handleStopStream = () => {
    if (window.confirm("Are you sure you want to end this lecture and archive it?")) {
      stopCamera();
      setIsStreaming(false);

      const savedLecture = {
        id: Date.now(),
        topic: activeLecture.topic,
        class: activeLecture.class,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'Short', year: 'numeric' }),
        duration: formatTime(streamDuration),
        transcript: [...transcript],
        quizzes: activeQuiz ? [{ question: activeQuiz.question, correctIndex: activeQuiz.correctIndex }] : []
      };

      setLectures([savedLecture, ...lectures]);
      setActiveLecture(null);
      setWizardTopic('');
      setWizardStep(1);
      triggerToast("Lecture archived successfully!");
      setActiveTab('overview'); // return to main Dashboard tab
    }
  };

  // Quiz pushing simulation
  const handlePushQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setQuizResults({ A: 0, B: 0, C: 0, D: 0, total: 0 });
    window.dispatchEvent(new CustomEvent('new-live-quiz', { detail: quiz }));
    setConnectedStudents(prev => prev.map(s => ({ ...s, lastAnswer: null, speed: 0 })));
    triggerToast(`Quiz "${quiz.question.substring(0, 25)}..." pushed to students!`);

    let idx = 0;
    const timer = setInterval(() => {
      if (idx < connectedStudents.length) {
        const answer = Math.random() < 0.85 ? quiz.correctIndex : Math.floor(Math.random() * 4);
        const letter = ['A', 'B', 'C', 'D'][answer];
        const speed = parseFloat((Math.random() * 2.5 + 0.8).toFixed(1));
        
        setConnectedStudents(prev => prev.map((s, i) => i === idx ? {
          ...s,
          lastAnswer: letter,
          speed,
          score: answer === quiz.correctIndex ? s.score + 10 : s.score
        } : s));

        setQuizResults(prev => ({
          ...prev,
          [letter]: prev[letter] + 1,
          total: prev.total + 1
        }));

        idx++;
      } else {
        clearInterval(timer);
      }
    }, 900);
  };

  const handleCustomQuizSubmit = (e) => {
    e.preventDefault();
    if (!customQuestion.trim() || customOptions.some(o => !o.trim())) {
      triggerToast('Please fill all options and the custom question!');
      return;
    }
    const formattedQuiz = {
      id: 'c' + Date.now(),
      question: customQuestion,
      options: customOptions.map((o, i) => `${['A', 'B', 'C', 'D'][i]}: ${o}`),
      correctIndex: customAnswer,
      explanation: 'Custom question response.'
    };
    handlePushQuiz(formattedQuiz);
    setCustomQuestion('');
    setCustomOptions(['', '', '', '']);
    triggerToast('Custom quiz pushed!');
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const currentFormattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <DashboardLayout
      user={user}
      onLogout={onLogout}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      sidebarItems={sidebarItems}
      dashboardTitle="Instructor Dashboard"
      roleLabel="Teacher"
      roleBadgeClass="teacher"
      notificationCount={3}
      notifications={notifications}
    >
      <style>{`
        /* Step tracker styling */
        .step-tracker {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          position: relative;
        }
        .step-tracker::before {
          content: '';
          position: absolute;
          top: 14px;
          left: 10px;
          right: 10px;
          height: 2px;
          background-color: #e5e7eb;
          z-index: 1;
        }
        .step-tracker-line-filled {
          position: absolute;
          top: 14px;
          left: 10px;
          height: 2px;
          background-color: #002e5b;
          z-index: 1;
          transition: width 0.3s;
        }
        .step-node {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: white;
          padding: 0 8px;
          z-index: 2;
          font-size: 12px;
          font-weight: 500;
          color: #9ca3af;
        }
        .step-circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #f3f4f6;
          border: 2px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 13px;
          color: #9ca3af;
          transition: all 0.3s;
        }
        .step-node.active .step-circle {
          background-color: #002e5b;
          border-color: #002e5b;
          color: white;
        }
        .step-node.active {
          color: #002e5b;
          font-weight: 600;
        }
        
        .form-row-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }
        .form-group-new {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group-new label {
          font-size: 12px;
          font-weight: 600;
          color: #4b5563;
        }
        .form-select-new, .form-input-new {
          padding: 8px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 13px;
          outline: none;
          background-color: white;
        }
        .form-select-new:focus, .form-input-new:focus {
          border-color: #002e5b;
        }
        
        .banner-blue-info {
          background-color: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1e40af;
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 16px;
        }
        .wizard-buttons {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 16px;
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

        .live-preview-box {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #eff6ff;
          border: 1px dashed #bfdbfe;
          border-radius: 10px;
          aspect-ratio: 1.5;
          margin-bottom: 16px;
          position: relative;
        }
        .pulsing-signal-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: rgba(29, 78, 216, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: radial-pulse 2s infinite;
        }
        @keyframes radial-pulse {
          0% { box-shadow: 0 0 0 0 rgba(29, 78, 216, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(29, 78, 216, 0); }
          100% { box-shadow: 0 0 0 0 rgba(29, 78, 216, 0); }
        }
        
        .metadata-list-vertical {
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 13px;
        }
        .metadata-item-vertical {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #f3f4f6;
          padding-bottom: 6px;
        }
        .metadata-label-vertical {
          color: #6b7280;
          font-weight: 500;
        }
        .metadata-val-vertical {
          color: #111827;
          font-weight: 600;
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
        .btn-stop-stream {
          width: 100%;
          border: 1px solid #fca5a5;
          background-color: #fef2f2;
          color: #dc2626;
          padding: 10px;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-top: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .btn-stop-stream:hover {
          background-color: #fee2e2;
        }
        .btn-table-action {
          background: none;
          border: none;
          color: #002e5b;
          cursor: pointer;
          font-size: 15px;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        .btn-table-action:hover {
          background-color: #f3f4f6;
        }
        .panels-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }
        @media (max-width: 992px) {
          .panels-grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* A. DASHBOARD (OVERVIEW) TAB */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in">
          <div className="greeting-section">
            <div>
              <h1 className="greeting-title">Welcome back, {user?.name || "Dr. Sarah Verma"}! 👋</h1>
              <p className="greeting-sub">Here's what's happening with your classes today.</p>
            </div>
            <div className="date-box">
              <span className="glyphicon glyphicon-calendar"></span>
              <span>{currentFormattedDate}</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="stats-grid">
            <StatCard 
              icon="glyphicon-film" 
              count={lectures.length} 
              label="Total Lectures" 
              subtext="+2 this week" 
              subtextColorClass="text-success"
              iconBgColorClass="color-blue-bg"
            />
            <StatCard 
              icon="glyphicon-user" 
              count={connectedStudents.length} 
              label="Students Connected" 
              subtext="+1 this week" 
              subtextColorClass="text-success"
              iconBgColorClass="color-green-bg"
            />
            <StatCard 
              icon="glyphicon-check" 
              count={aiSuggestions.length} 
              label="AI Quizzes Ready" 
              subtext="Create quizzes" 
              subtextColorClass="link-blue-new"
              iconBgColorClass="color-orange-bg"
              onClick={() => setActiveTab('quiz')}
            />
            <StatCard 
              icon="glyphicon-signal" 
              count={isStreaming ? formatTime(streamDuration) : 'OFF'} 
              label="Stream Status" 
              subtext={isStreaming ? 'LIVE NOW' : 'Currently Offline'} 
              subtextColorClass={isStreaming ? 'text-danger' : 'text-muted'}
              iconBgColorClass="color-purple-bg"
            />
          </div>

          {/* Panel rows */}
          <div className="panels-grid-2">
            {/* Start a New Lecture Card */}
            <div className="panel-card-new">
              <div className="panel-header-new">
                <h2 className="panel-title-new">
                  <span className="glyphicon glyphicon-facetime-video"></span> Start a New Lecture
                </h2>
              </div>
              
              {/* Step Tracker */}
              <div className="step-tracker">
                <div 
                  className="step-tracker-line-filled" 
                  style={{ width: `${(wizardStep - 1) * 50}%` }}
                />
                <div className={`step-node ${wizardStep >= 1 ? 'active' : ''}`}>
                  <div className="step-circle">1</div>
                  <span>Select Class</span>
                </div>
                <div className={`step-node ${wizardStep >= 2 ? 'active' : ''}`}>
                  <div className="step-circle">2</div>
                  <span>Select Subject</span>
                </div>
                <div className={`step-node ${wizardStep >= 3 ? 'active' : ''}`}>
                  <div className="step-circle">3</div>
                  <span>Select Topic</span>
                </div>
              </div>

              {/* Wizard content */}
              {wizardStep === 1 && (
                <div className="wizard-step-panel">
                  <div className="form-row-3">
                    <div className="form-group-new">
                      <label>Semester</label>
                      <select 
                        className="form-select-new" 
                        value={wizardSemester} 
                        onChange={e => setWizardSemester(e.target.value)}
                        disabled={isStreaming}
                      >
                        <option value="1st Semester">1st Semester</option>
                        <option value="2nd Semester">2nd Semester</option>
                        <option value="3rd Semester">3rd Semester</option>
                        <option value="4th Semester">4th Semester</option>
                      </select>
                    </div>
                    <div className="form-group-new">
                      <label>Branch</label>
                      <select 
                        className="form-select-new" 
                        value={wizardBranch} 
                        onChange={e => setWizardBranch(e.target.value)}
                        disabled={isStreaming}
                      >
                        <option value="Computer Science (CSE)">Computer Science (CSE)</option>
                        <option value="Information Technology (IT)">Information Technology (IT)</option>
                        <option value="Electronics (ECE)">Electronics (ECE)</option>
                      </select>
                    </div>
                    <div className="form-group-new">
                      <label>Section</label>
                      <select 
                        className="form-select-new" 
                        value={wizardSection} 
                        onChange={e => setWizardSection(e.target.value)}
                        disabled={isStreaming}
                      >
                        <option value="Section A">Section A</option>
                        <option value="Section B">Section B</option>
                        <option value="Section C">Section C</option>
                      </select>
                    </div>
                  </div>
                  <div className="banner-blue-info">
                    Subjects available for {wizardBranch} - {wizardSemester} - {wizardSection}
                  </div>
                  <div className="wizard-buttons">
                    <button className="btn-outline-new" style={{ visibility: 'hidden' }}>Back</button>
                    <button className="btn-solid-new" onClick={() => setWizardStep(2)}>Next: Select Subject →</button>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="wizard-step-panel">
                  <div className="form-group-new" style={{ marginBottom: '16px' }}>
                    <label>Select Subject</label>
                    <select 
                      className="form-select-new" 
                      value={wizardSubject} 
                      onChange={e => setWizardSubject(e.target.value)}
                      disabled={isStreaming}
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="Data Structures">Data Structures</option>
                      <option value="Database Management System">Database Management System</option>
                    </select>
                  </div>
                  <div style={{ color: '#16a34a', fontWeight: '600', fontSize: '13px', marginBottom: '16px' }}>
                    ✓ 58 Students Enrolled
                  </div>
                  <div className="wizard-buttons">
                    <button className="btn-outline-new" onClick={() => setWizardStep(1)}>← Back</button>
                    <button className="btn-solid-new" onClick={() => setWizardStep(3)}>Next: Write Topic →</button>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="wizard-step-panel">
                  <div className="form-group-new" style={{ marginBottom: '16px' }}>
                    <label>Write Topic to Teach *</label>
                    <input 
                      type="text" 
                      className="form-input-new" 
                      placeholder="e.g. React Hooks: useState & useEffect" 
                      value={wizardTopic}
                      onChange={e => setWizardTopic(e.target.value)}
                      disabled={isStreaming}
                      required
                    />
                    <span style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                      Topic names trigger matching live transcripts and quiz generators.
                    </span>
                  </div>
                  <div className="wizard-buttons">
                    <button className="btn-outline-new" onClick={() => setWizardStep(2)}>← Back</button>
                    <button 
                      className="btn-solid-new" 
                      onClick={handleStartStream} 
                      disabled={isStreaming}
                      style={{ backgroundColor: '#16a34a' }}
                    >
                      Start Live Lecture 🚀
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Current Live Lecture Monitoring Card */}
            <div className="panel-card-new">
              <div className="panel-header-new">
                <h2 className="panel-title-new">
                  <span className="glyphicon glyphicon-facetime-video"></span> Current Live Lecture
                </h2>
                {isStreaming && <span className="badge-red-pill">● LIVE NOW</span>}
              </div>
              
              {isStreaming && activeLecture ? (
                <div className="live-lecture-active-details" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div className="live-preview-box" style={{ margin: 0, height: '80px', width: '80px', flexShrink: 0 }}>
                      <div className="pulsing-signal-circle">
                        <span className="glyphicon glyphicon-signal" style={{ color: '#1d4ed8', fontSize: '20px' }}></span>
                      </div>
                    </div>
                    <div className="metadata-list-vertical">
                      <div className="metadata-item-vertical">
                        <span className="metadata-label-vertical">Class</span>
                        <span className="metadata-val-vertical">{activeLecture.class}</span>
                      </div>
                      <div className="metadata-item-vertical">
                        <span className="metadata-label-vertical">Subject</span>
                        <span className="metadata-val-vertical">{activeLecture.subject}</span>
                      </div>
                      <div className="metadata-item-vertical">
                        <span className="metadata-label-vertical">Topic</span>
                        <span className="metadata-val-vertical" style={{ color: '#1d4ed8' }}>{activeLecture.topic}</span>
                      </div>
                      <div className="metadata-item-vertical">
                        <span className="metadata-label-vertical">Started At</span>
                        <span className="metadata-val-vertical">{activeLecture.startedAt}</span>
                      </div>
                      <div className="metadata-item-vertical">
                        <span className="metadata-label-vertical">Students Joined</span>
                        <span className="metadata-val-vertical" style={{ color: '#16a34a' }}>{activeLecture.studentsJoined}</span>
                      </div>
                    </div>
                  </div>
                  <button className="btn-stop-stream" onClick={handleStopStream}>
                    <span className="glyphicon glyphicon-stop"></span> End Lecture
                  </button>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', padding: '24px 0' }}>
                  <span className="glyphicon glyphicon-off" style={{ fontSize: '48px', color: '#cbd5e1', marginBottom: '16px' }}></span>
                  <span style={{ fontWeight: 600, color: '#6b7280' }}>Stream Offline</span>
                  <span style={{ fontSize: '12px', marginTop: '4px', textAlign: 'center' }}>
                    No active classes right now. Use the setup wizard to host a lecture.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom panels (Upcoming and Recent) */}
          <div className="panels-grid-2">
            {/* Upcoming classes listing */}
            <div className="panel-card-new">
              <div className="panel-header-new">
                <h2 className="panel-title-new">
                  <span className="glyphicon glyphicon-calendar"></span> Upcoming Classes
                </h2>
                <span className="link-blue-new" onClick={() => triggerToast("Calendar sync initialized")}>View Calendar</span>
              </div>
              
              <div className="table-responsive-new" style={{ flex: 1 }}>
                <table className="custom-table-new">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Class</th>
                      <th>Subject</th>
                      <th>Section</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingClasses.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: '600' }}>{item.time}</td>
                        <td>{item.class}</td>
                        <td>{item.subject}</td>
                        <td>{item.section}</td>
                        <td>
                          <button 
                            className="btn-table-action" 
                            title="Edit Schedule" 
                            onClick={() => triggerToast(`Class config: ${item.class}`)}
                          >
                            <span className="glyphicon glyphicon-chevron-right"></span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Lectures archived */}
            <div className="panel-card-new">
              <div className="panel-header-new">
                <h2 className="panel-title-new">
                  <span className="glyphicon glyphicon-file"></span> Recent Lectures
                </h2>
                <span className="link-blue-new" onClick={() => setActiveTab('recorded')}>View All</span>
              </div>
              
              <div className="table-responsive-new" style={{ flex: 1 }}>
                {lectures.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 0', color: '#9ca3af', fontSize: '13px' }}>
                    No lectures archived yet.
                  </div>
                ) : (
                  <table className="custom-table-new">
                    <thead>
                      <tr>
                        <th>Topic</th>
                        <th>Class</th>
                        <th>Date</th>
                        <th>Duration</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lectures.slice(0, 3).map((lec, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: '600', color: '#002e5b' }}>{lec.topic}</td>
                          <td>{lec.class || 'CSE - 2A'}</td>
                          <td>{lec.date}</td>
                          <td>{lec.duration}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button 
                                className="btn-table-action" 
                                title="Play Recording" 
                                onClick={() => {
                                  setActiveTab('recorded');
                                  triggerToast(`Playing recording of "${lec.topic}"`);
                                }}
                              >
                                <span className="glyphicon glyphicon-play"></span>
                              </button>
                              <button 
                                className="btn-table-action" 
                                title="View Analytics" 
                                onClick={() => {
                                  setActiveTab('analytics');
                                  triggerToast(`Analytics for: ${lec.topic}`);
                                }}
                              >
                                <span className="glyphicon glyphicon-stats"></span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* B. LIVE CLASSROOM TAB */}
      {activeTab === 'classroom' && (
        <div className="animate-fade-in">
          <h2 className="erp-page-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              <span className="glyphicon glyphicon-facetime-video"></span> Live Streaming Panel
            </span>
            {isStreaming && (
              <span className="badge-red-pill">
                ● LIVE — {formatTime(streamDuration)}
              </span>
            )}
          </h2>

          <div className="row">
            <div className="col-md-7">
              <div className="panel-card-new" style={{ padding: 0, overflow: 'hidden', marginBottom: '20px' }}>
                <div className="panel-header-new" style={{ padding: '16px 20px', margin: 0, backgroundColor: '#002e5b', color: 'white' }}>
                  <h3 className="panel-title-new" style={{ color: 'white' }}>
                    <span className="glyphicon glyphicon-camera"></span> Video Feed Output
                  </h3>
                </div>
                
                <div style={{ backgroundColor: '#0f172a', aspectRatio: '1.6', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cameraStream ? (
                    <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>
                      <span className="glyphicon glyphicon-facetime-video" style={{ fontSize: '64px', color: '#475569', marginBottom: '16px', display: 'block' }}></span>
                      <span style={{ fontSize: '15px', fontWeight: '500' }}>
                        {isStreaming ? 'Webcam unavailable. Rendering simulation stream.' : 'Stream currently offline.'}
                      </span>
                    </div>
                  )}
                  
                  {isStreaming && (
                    <div style={{ position: 'absolute', bottom: '15px', left: '15px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: '4px', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                      🎤 DR. SARAH VERMA — {activeLecture?.fullClass || 'CSE - Section A'}
                    </div>
                  )}
                </div>
              </div>

              {isStreaming && (
                <button className="btn-stop-stream" style={{ height: '45px', fontSize: '15px' }} onClick={handleStopStream}>
                  <span className="glyphicon glyphicon-stop"></span> End Lecture & Stop Stream
                </button>
              )}
            </div>

            {/* Captions transcript box */}
            <div className="col-md-5">
              <div className="panel-card-new" style={{ height: '460px' }}>
                <div className="panel-header-new">
                  <h2 className="panel-title-new">
                    <span className="glyphicon glyphicon-comment"></span> Live Captions Transcript
                  </h2>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '6px' }}>
                  {transcript.length === 0 ? (
                    <div style={{ display: 'flex', height: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', textAlign: 'center' }}>
                      <span className="glyphicon glyphicon-bullhorn" style={{ fontSize: '40px', color: '#cbd5e1', marginBottom: '12px' }}></span>
                      <span>{isStreaming ? 'Listening for speech input...' : 'Start the lecture stream to monitor transcript.'}</span>
                    </div>
                  ) : (
                    transcript.map((line, idx) => (
                      <div key={idx} style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9', fontSize: '13px' }}>
                        <span style={{ color: '#2563eb', fontFamily: 'monospace', fontSize: '11px', marginRight: '8px', fontWeight: 'bold' }}>
                          [{line.time}]
                        </span>
                        <span style={{ color: '#334155' }}>{line.text}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* C. RECORDED LECTURES TAB */}
      {activeTab === 'recorded' && (
        <div className="animate-fade-in">
          <h2 className="erp-page-title">
            <span className="glyphicon glyphicon-film"></span> Archived Learning Lectures
          </h2>
          
          <div className="panel-card-new">
            {lectures.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>
                No recorded lectures found. Open a live classroom session to record!
              </div>
            ) : (
              <div className="table-responsive-new">
                <table className="custom-table-new">
                  <thead>
                    <tr>
                      <th>Lecture Topic</th>
                      <th>Assigned Class</th>
                      <th>Publish Date</th>
                      <th>Duration</th>
                      <th>Interactive Log</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lectures.map((lec, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 'bold', color: '#002e5b' }}>{lec.topic}</td>
                        <td>{lec.class || 'CSE - 2A'}</td>
                        <td>{lec.date}</td>
                        <td>{lec.duration}</td>
                        <td style={{ maxWidth: '280px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: '#64748b', fontSize: '12px' }}>
                          {lec.transcript && lec.transcript.length > 0 ? lec.transcript.map(t => t.text).join(' ') : 'No captions compiled.'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn-solid-new" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => triggerToast(`Streaming: ${lec.topic}`)}>
                              Play
                            </button>
                            <button className="btn-outline-new" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => triggerToast(`PDF transcript downloaded`)}>
                              PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* D. QUIZ MANAGER TAB */}
      {activeTab === 'quiz' && (
        <div className="animate-fade-in">
          <h2 className="erp-page-title">
            <span className="glyphicon glyphicon-question-sign"></span> Classroom Quiz Control Centre
          </h2>

          <div className="row">
            {/* AI generated suggestions based on transcripts */}
            <div className="col-md-6">
              <div className="panel-card-new" style={{ minHeight: '380px' }}>
                <div className="panel-header-new">
                  <h2 className="panel-title-new" style={{ color: '#d97706' }}>
                    <span className="glyphicon glyphicon-flash"></span> AI suggested Quizzes
                  </h2>
                </div>
                
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {aiSuggestions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af', fontSize: '13px' }}>
                      <span className="glyphicon glyphicon-refresh" style={{ fontSize: '32px', color: '#e2e8f0', display: 'block', marginBottom: '12px' }}></span>
                      Host a lecture and explain the keywords to generate automated AI quiz suggestions.
                    </div>
                  ) : (
                    aiSuggestions.map((q, idx) => (
                      <div key={q.id} style={{ border: '1px solid #fef08a', backgroundColor: '#fefcbf', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '11px' }}>
                          <span style={{ backgroundColor: '#fef3c7', color: '#d97706', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' }}>AI RECOMMENDATION</span>
                          <span style={{ color: '#b45309', fontWeight: 600 }}>keyword: "{q.keyword}"</span>
                        </div>
                        <p style={{ fontWeight: 'bold', fontSize: '13px', margin: '0 0 10px 0', color: '#78350f' }}>{q.question}</p>
                        <button 
                          className="btn-solid-new" 
                          style={{ backgroundColor: '#d97706', fontSize: '11px', padding: '4px 12px' }}
                          disabled={activeQuiz?.id === q.id}
                          onClick={() => handlePushQuiz(q)}
                        >
                          {activeQuiz?.id === q.id ? 'Pushed Live ✓' : 'Push to Students'}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Custom Quiz Constructor */}
            <div className="col-md-6">
              <div className="panel-card-new" style={{ marginBottom: '20px' }}>
                <div className="panel-header-new">
                  <h2 className="panel-title-new">
                    <span className="glyphicon glyphicon-plus"></span> Create Custom Quiz
                  </h2>
                </div>

                <form onSubmit={handleCustomQuizSubmit}>
                  <div className="form-group-new" style={{ marginBottom: '12px' }}>
                    <label>Question Body</label>
                    <input 
                      type="text" 
                      className="form-input-new" 
                      placeholder="e.g. Which Hook is used for state synchronization?" 
                      value={customQuestion}
                      onChange={e => setCustomQuestion(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                    {customOptions.map((opt, i) => (
                      <div key={i} className="form-group-new">
                        <label>Option {['A','B','C','D'][i]}</label>
                        <input 
                          type="text" 
                          className="form-input-new" 
                          value={opt} 
                          onChange={e => {
                            const copy = [...customOptions];
                            copy[i] = e.target.value;
                            setCustomOptions(copy);
                          }}
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="form-group-new">
                      <label>Correct Answer</label>
                      <select 
                        className="form-select-new" 
                        style={{ width: '120px' }} 
                        value={customAnswer} 
                        onChange={e => setCustomAnswer(parseInt(e.target.value))}
                      >
                        <option value={0}>Option A</option>
                        <option value={1}>Option B</option>
                        <option value={2}>Option C</option>
                        <option value={3}>Option D</option>
                      </select>
                    </div>

                    <button type="submit" className="btn-solid-new">
                      <span className="glyphicon glyphicon-send"></span> Push Quiz Live
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Quiz live results stats chart */}
              {activeQuiz && (
                <div className="panel-card-new">
                  <div className="panel-header-new">
                    <h2 className="panel-title-new">
                      <span className="glyphicon glyphicon-stats"></span> Live Student Response Statistics
                    </h2>
                  </div>
                  
                  <p style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 14px 0', color: '#002e5b' }}>
                    Q: {activeQuiz.question}
                  </p>
                  
                  {['A','B','C','D'].map((letter, idx) => {
                    const count = quizResults[letter];
                    const pct = quizResults.total > 0 ? Math.round((count / quizResults.total) * 100) : 0;
                    const correct = idx === activeQuiz.correctIndex;
                    return (
                      <div key={letter} style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: correct ? 'bold' : 'normal', color: correct ? '#16a34a' : '#4b5563' }}>
                            Option {letter} {correct ? '✓ (Correct)' : ''}
                          </span>
                          <span style={{ color: '#6b7280', fontWeight: '600' }}>{count} answers ({pct}%)</span>
                        </div>
                        <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              height: '100%', 
                              width: `${pct}%`, 
                              backgroundColor: correct ? '#16a34a' : '#002e5b',
                              transition: 'width 0.4s ease-out' 
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* E. STUDENT RESULTS TAB */}
      {activeTab === 'results' && (
        <div className="animate-fade-in">
          <h2 className="erp-page-title">
            <span className="glyphicon glyphicon-list-alt"></span> Student Performance Scorecard
          </h2>

          <div className="panel-card-new">
            <div className="table-responsive-new">
              <table className="custom-table-new">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student Name</th>
                    <th>Roll Number</th>
                    <th>Active Lecture Answer</th>
                    <th>Response Time</th>
                    <th>Cumulative Score</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...connectedStudents].sort((a,b) => b.score - a.score).map((s, idx) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 'bold' }}>{idx + 1}</td>
                      <td style={{ fontWeight: '600', color: '#002e5b' }}>{s.name}</td>
                      <td>{s.roll}</td>
                      <td>
                        {s.lastAnswer ? (
                          <span 
                            style={{ 
                              backgroundColor: s.lastAnswer === ['A','B','C','D'][activeQuiz?.correctIndex] ? '#dcfce7' : '#fee2e2',
                              color: s.lastAnswer === ['A','B','C','D'][activeQuiz?.correctIndex] ? '#15803d' : '#b91c1c',
                              padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' 
                            }}
                          >
                            Option {s.lastAnswer}
                          </span>
                        ) : (
                          <span style={{ color: '#9ca3af' }}>No answer</span>
                        )}
                      </td>
                      <td>{s.speed ? `${s.speed}s` : '—'}</td>
                      <td style={{ fontWeight: '700', color: '#1d4ed8' }}>{s.score} pts</td>
                      <td>
                        <button className="btn-outline-new" style={{ padding: '3px 8px', fontSize: '11px' }} onClick={() => triggerToast(`Contacting student ${s.name}...`)}>
                          Message
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* F. STUDENTS TAB */}
      {activeTab === 'students' && (
        <div className="animate-fade-in">
          <h2 className="erp-page-title">
            <span className="glyphicon glyphicon-user"></span> Students Directory
          </h2>

          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {connectedStudents.map(student => (
              <div className="stat-card-new" key={student.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '24px' }}>
                <div className="user-avatar-circle" style={{ width: '64px', height: '64px', fontSize: '24px', backgroundColor: '#eff6ff', color: '#002e5b', border: '3px solid #cbd5e1', marginBottom: '12px' }}>
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#002e5b' }}>{student.name}</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Roll: {student.roll}</div>
                <div style={{ fontSize: '12px', color: '#1e40af', fontWeight: '600', marginTop: '8px' }}>
                  Score: {student.score} pts
                </div>
                
                <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '16px' }}>
                  <button className="btn-outline-new" style={{ flex: 1, padding: '4px' }} onClick={() => triggerToast(`Viewing records for ${student.name}`)}>Profile</button>
                  <button className="btn-solid-new" style={{ flex: 1, padding: '4px', backgroundColor: '#16a34a' }} onClick={() => triggerToast(`Message sent to ${student.name}`)}>Message</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* G. ANNOUNCEMENTS TAB */}
      {activeTab === 'announcements' && (
        <div className="animate-fade-in">
          <h2 className="erp-page-title">
            <span className="glyphicon glyphicon-bullhorn"></span> Announcements Board
          </h2>

          <div className="row">
            <div className="col-md-8">
              <div className="panel-card-new" style={{ gap: '16px' }}>
                <div className="announcement-item" style={{ borderLeft: '4px solid #002e5b', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '0 8px 8px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                    <strong>COURSE: WEB DEVELOPMENT</strong>
                    <span>12 June 2026</span>
                  </div>
                  <h4 style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: '#002e5b' }}>Web Design Mockup Review Scheduled</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#4b5563' }}>
                    Please review the Teacher and Student dashboard mockups shared during classes. Final implementations are being evaluated.
                  </p>
                </div>

                <div className="announcement-item" style={{ borderLeft: '4px solid #002e5b', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '0 8px 8px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                    <strong>COURSE: GENERAL COMPUTER SCIENCE</strong>
                    <span>08 June 2026</span>
                  </div>
                  <h4 style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: '#002e5b' }}>Midterm Quiz Release</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#4b5563' }}>
                    Automated AI-quizzes are now pushed during every live classroom stream. Join the stream on time.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="panel-card-new">
                <div className="panel-header-new">
                  <h3 className="panel-title-new">📢 Broadcast Alert</h3>
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  triggerToast("Announcement broadcasted successfully to all sections!");
                  e.target.reset();
                }}>
                  <div className="form-group-new" style={{ marginBottom: '12px' }}>
                    <label>Target Course</label>
                    <select className="form-select-new">
                      <option>Web Development</option>
                      <option>Data Structures</option>
                    </select>
                  </div>
                  <div className="form-group-new" style={{ marginBottom: '12px' }}>
                    <label>Alert Title</label>
                    <input type="text" className="form-input-new" placeholder="e.g. Class Rescheduled" required />
                  </div>
                  <div className="form-group-new" style={{ marginBottom: '16px' }}>
                    <label>Message Content</label>
                    <textarea className="form-input-new" rows="4" style={{ resize: 'none' }} placeholder="Write notice here..." required />
                  </div>
                  <button className="btn-solid-new" style={{ width: '100%' }}>Broadcast Notice</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* H. ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="animate-fade-in">
          <h2 className="erp-page-title">
            <span className="glyphicon glyphicon-stats"></span> Performance & Analytics Summary
          </h2>

          <div className="row">
            <div className="col-md-6">
              <div className="panel-card-new">
                <div className="panel-header-new">
                  <h3 className="panel-title-new">Average Student Score Distributions</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span>Web Development (CSE-2A)</span>
                      <span style={{ fontWeight: 'bold' }}>88% Avg</span>
                    </div>
                    <div style={{ height: '12px', backgroundColor: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '88%', backgroundColor: '#002e5b' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span>Data Structures (CSE-2B)</span>
                      <span style={{ fontWeight: 'bold' }}>74% Avg</span>
                    </div>
                    <div style={{ height: '12px', backgroundColor: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '74%', backgroundColor: '#1d4ed8' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span>Database Management System (IT-2A)</span>
                      <span style={{ fontWeight: 'bold' }}>82% Avg</span>
                    </div>
                    <div style={{ height: '12px', backgroundColor: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '82%', backgroundColor: '#16a34a' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="panel-card-new">
                <div className="panel-header-new">
                  <h3 className="panel-title-new">Live Classroom Participation Rates</h3>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center', padding: '20px 0' }}>
                  <div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#002e5b' }}>94%</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Average Attendance</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>82s</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Response Time</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#c2410c' }}>64%</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Quiz Accuracy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* I. SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="animate-fade-in">
          <h2 className="erp-page-title">
            <span className="glyphicon glyphicon-cog"></span> Dashboard Configurations
          </h2>

          <div className="panel-card-new" style={{ maxWidth: '600px' }}>
            <form onSubmit={(e) => { e.preventDefault(); triggerToast("Settings saved successfully!"); }}>
              <h4 style={{ margin: '0 0 16px 0', color: '#002e5b', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>Faculty Account Preferences</h4>
              
              <div className="form-group-new" style={{ marginBottom: '12px' }}>
                <label>Assigned Department</label>
                <input type="text" className="form-input-new" defaultValue="Computer Science & Engineering" disabled />
              </div>

              <div className="form-group-new" style={{ marginBottom: '12px' }}>
                <label>Preferred Video Feed Source</label>
                <select className="form-select-new">
                  <option>Default Integrated Webcam</option>
                  <option>Simulated Virtual Classroom Screen</option>
                </select>
              </div>

              <div className="form-group-new" style={{ marginBottom: '16px' }}>
                <label>Auto-archive stream on exit</label>
                <select className="form-select-new">
                  <option>Enabled (Save transcript and video to portal)</option>
                  <option>Disabled (Exit without saving record)</option>
                </select>
              </div>

              <button className="btn-solid-new">Save Configuration</button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="floating-toast-new">
          <span className="glyphicon glyphicon-info-sign" style={{ marginRight: '8px' }}></span>
          {toastMessage}
        </div>
      )}
    </DashboardLayout>
  );
};

export default TeacherDashboard;
