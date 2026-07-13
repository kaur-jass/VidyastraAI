import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  Video, 
  Tv, 
  FileText, 
  Users, 
  ClipboardList, 
  BarChart2, 
  MessageSquare, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

// Subcomponents imports
import FacultyHome from './FacultyHome';
import MyCourses from './MyCourses';
import LiveClass from './LiveClass';
import LectureRecorder from './LectureRecorder';
import LectureCenter from './LectureCenter';
import ContentLibrary from './ContentLibrary';
import StudentManagement from './StudentManagement';
import AssignmentAssess from './AssignmentAssess';
import Analytics from './Analytics';
import AIAssistant from './AIAssistant';
import MessagesAnnounce from './MessagesAnnounce';
import ProfileSettings from './ProfileSettings';

const FacultyLayout = ({ user, onLogout }) => {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Toast Helper
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Profile Info State
  const [profile, setProfile] = useState({
    name: user?.name || '',
    department: '',
    email: '',
    phone: '',
    office: '',
    smsAlerts: true,
    autoGrader: false
  });

  // Scheduled Timetable
  const [todayClasses, setTodayClasses] = useState([]);

  // Video Streaming Simulator Configs
  const [recCourse, setRecCourse] = useState('CS201');
  const [recTopic, setRecTopic] = useState('');
  const [recQuality, setRecQuality] = useState('1080p');
  const [recMic, setRecMic] = useState('Default Input');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingIntervalId, setRecordingIntervalId] = useState(null);

  const startMockRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    const interval = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
    setRecordingIntervalId(interval);
    triggerToast("Live classroom recording initiated.");
  };

  const stopMockRecording = () => {
    setIsRecording(false);
    clearInterval(recordingIntervalId);
    setRecordingIntervalId(null);
    triggerToast("Recording paused. Syncing file to processing stream...");
  };

  const formatRecTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // AI Pipeline Tasks
  const [processingTasks, setProcessingTasks] = useState([]);
  const [refreshingQueue, setRefreshingQueue] = useState(false);

  const refreshProcessingQueue = async () => {
    setRefreshingQueue(true);
    try {
      const tasksRes = await api.getFacultyProcessingCenter();
      if (tasksRes && tasksRes.data) {
        setProcessingTasks(tasksRes.data);
      } else if (Array.isArray(tasksRes)) {
        setProcessingTasks(tasksRes);
      }
      triggerToast("AI compilation pipelines synced.");
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshingQueue(false);
    }
  };

  // Resources Inventory
  const [libraryResources, setLibraryResources] = useState([]);
  const [libSearch, setLibSearch] = useState('');

  const togglePublishStatus = (id) => {
    setLibraryResources((prev) =>
      prev.map((res) => {
        if (res.id === id) {
          const next = res.status === 'Published' ? 'Draft' : 'Published';
          triggerToast(`Resource status updated to: ${next}`);
          return { ...res, status: next };
        }
        return res;
      })
    );
  };

  const deleteLibraryResource = (id) => {
    setLibraryResources((prev) => prev.filter((res) => res.id !== id));
    triggerToast("Document purged from syllabus inventory.");
  };

  // Student directory & roster metrics
  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');

  // Course management list
  const [courses, setCourses] = useState([]);

  // Tasks grading panel
  const [assignments, setAssignments] = useState([]);
  const [activeGradeAssignment, setActiveGradeAssignment] = useState(null);
  const [gradingScore, setGradingScore] = useState('');
  const [gradingFeedback, setGradingFeedback] = useState('');

  // Fetch real data on mount
  useEffect(() => {
    const loadFacultyData = async () => {
      try {
        const profRes = await api.getTeacherProfile();
        if (profRes && profRes.data) {
          setProfile(prev => ({
            ...prev,
            name: profRes.data.name || prev.name,
            email: profRes.data.email || prev.email,
            department: profRes.data.department || prev.department,
            phone: profRes.data.phone || prev.phone,
            office: profRes.data.office || prev.office
          }));
        }

        const studentsRes = await api.getFacultyStudents();
        if (studentsRes && studentsRes.data) {
          setStudents(studentsRes.data);
        } else if (Array.isArray(studentsRes)) {
          setStudents(studentsRes);
        }

        const assignmentsRes = await api.getFacultyAssignments();
        if (assignmentsRes && assignmentsRes.data) {
          const mappedAssignments = assignmentsRes.data.map(ass => ({
            id: ass._id || ass.id,
            student: ass.studentId || 'Student',
            assignment: ass.title || ass.assignment || 'Assignment',
            date: new Date(ass.createdAt || ass.date).toLocaleDateString(),
            status: ass.status || 'Pending',
            grade: ass.marks ? `${ass.marks} / 50` : ''
          }));
          setAssignments(mappedAssignments);
        }

        const tasksRes = await api.getFacultyProcessingCenter();
        if (tasksRes && tasksRes.data) {
          setProcessingTasks(tasksRes.data);
        } else if (Array.isArray(tasksRes)) {
          setProcessingTasks(tasksRes);
        }

        const msgsRes = await api.getFacultyMessages();
        if (msgsRes && msgsRes.data) {
          setChatThreads(msgsRes.data);
        } else if (Array.isArray(msgsRes)) {
          setChatThreads(msgsRes);
        }

        const coursesRes = await api.getCourses();
        if (coursesRes) {
          const mappedCourses = coursesRes.map(c => ({
            code: c.code,
            name: c.name,
            studentsCount: c.enrollments || 0,
            progress: c.progress || 0,
            bgGradient: 'from-blue-500 to-indigo-600'
          }));
          setCourses(mappedCourses);
        }
      } catch (err) {
        console.error("Failed to load faculty dashboard data", err);
      }
    };

    loadFacultyData();
  }, []);

  const submitGradeAction = async () => {
    if (!gradingScore.trim()) {
      alert("Please specify a score!");
      return;
    }
    try {
      await api.gradeSubmission(activeGradeAssignment.id, parseFloat(gradingScore), gradingFeedback);
      setAssignments((prev) =>
        prev.map((ass) => {
          if (ass.id === activeGradeAssignment.id) {
            return {
              ...ass,
              status: 'Graded',
              grade: `${gradingScore} / 50`,
            };
          }
          return ass;
        })
      );
      triggerToast(`Submission successfully marked! Score: ${gradingScore}/50.`);
    } catch (err) {
      console.error(err);
      triggerToast("Failed to submit grade.", "error");
    } finally {
      setActiveGradeAssignment(null);
      setGradingScore('');
      setGradingFeedback('');
    }
  };

  // Chat/Assistant parameters
  const [aiChatMessages, setAiChatMessages] = useState([
    { sender: 'ai', text: `Hello ${user?.name || 'Professor'}! I am your Vidyastra Faculty Copilot. ✦\nHow can I support your classroom prep today? I can auto-draft announcements, generate SQL/DSA quizzes, or compile transcripts.`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [aiChatInput, setAiChatInput] = useState('');
  const [aiChatTyping, setAiChatTyping] = useState(false);

  const facultyAiSuggestions = [
    { label: "Draft class announcement for DSA assignment postponement", prompt: "Write an email draft postponing assignment 4 deadline by 2 days." },
    { label: "Generate 3 SQL Joins practice questions", prompt: "Generate 3 database SQL practice questions on Joins and Subqueries." },
    { label: "Outline next lecture: Process Synchronization", prompt: "Provide a quick 5-bullet lecture outline for Operating Systems Process Synchronization concepts." }
  ];

  const handleSendAiAssistantMessage = async (textToSend) => {
    if (!textToSend.trim()) return;
    const userMsg = { sender: 'user', text: textToSend, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setAiChatMessages(prev => [...prev, userMsg]);
    setAiChatInput('');
    setAiChatTyping(true);

    try {
      const res = await api.askAI(textToSend);
      const reply = res.answer || res.content || JSON.stringify(res);
      setAiChatMessages(prev => [...prev, {
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      setAiChatMessages(prev => [...prev, {
        sender: 'ai',
        text: "Error connecting to Vidyastra AI system: " + (err.message || err),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setAiChatTyping(false);
    }
  };

  // Student messaging threads
  const [chatThreads, setChatThreads] = useState([]);
  const [activeMessageThread, setActiveMessageThread] = useState(null);
  const [messageReplyText, setMessageReplyText] = useState('');

  const sendFacultyMessageReply = () => {
    if (!messageReplyText.trim()) return;
    setChatThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === activeMessageThread) {
          return {
            ...thread,
            messages: [
              ...thread.messages,
              {
                sender: 'teacher',
                text: messageReplyText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ],
          };
        }
        return thread;
      })
    );
    setMessageReplyText('');
    triggerToast("Message sent to student inbox.");
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    triggerToast("Profile configurations updated.");
  };

  return (
    <div className="vidyastra-container">
      {/* Global CSS Embedded Styles */}
      <style>{`
        .vidyastra-container {
          display: flex;
          min-height: 100vh;
          font-family: var(--sans-font);
          background-color: var(--bg);
          color: var(--text);
          position: relative;
        }
        .sidebar {
          width: 260px;
          background: #0F172A;
          color: white;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 1000;
          transition: transform 0.3s ease;
          border-right: 1px solid rgba(255,255,255,0.08);
          box-shadow: 4px 0 20px rgba(15, 23, 42, 0.15);
        }
        .sidebar-brand {
          padding: 24px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .brand-logo-circle {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--primary) 0%, #6366F1 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }
        .brand-name {
          font-family: var(--heading-font);
          font-size: 18px;
          font-weight: 700;
          background: linear-gradient(to right, #FFFFFF, #E2E8F0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 0.5px;
        }
        .sidebar-menu {
          flex: 1;
          padding: 24px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow-y: auto;
        }
        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 16px;
          border-radius: 8px;
          color: #94A3B8;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
        }
        .menu-item:hover {
          color: white;
          background-color: rgba(255,255,255,0.04);
        }
        .menu-item.active {
          color: white;
          background: var(--primary);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
        }
        .sidebar-footer {
          padding: 20px 12px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          color: #EF4444;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          width: 100%;
          background: transparent;
          border: none;
        }
        .logout-btn:hover {
          background-color: rgba(239, 68, 68, 0.08);
        }
        .main-workspace {
          flex: 1;
          margin-left: 260px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg);
          transition: margin-left 0.3s ease;
        }
        .workspace-header {
          height: 70px;
          background-color: white;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 900;
        }
        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--text);
          cursor: pointer;
          padding: 4px;
        }
        .header-title {
          font-family: var(--heading-font);
          font-size: 20px;
          font-weight: 700;
          color: var(--text);
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .bell-trigger {
          position: relative;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: background-color var(--transition-fast);
          border: none;
          background: none;
          color: var(--text-muted);
        }
        .bell-trigger:hover {
          background-color: #F1F5F9;
          color: var(--text);
        }
        .bell-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          background-color: var(--danger);
          color: white;
          font-size: 10px;
          font-weight: bold;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }
        .user-avatar-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }
        .avatar-circle-sm {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4F46E5 0%, #818CF8 100%);
          color: white;
          font-weight: 700;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(79, 70, 229, 0.2);
        }
        .user-meta-header {
          display: flex;
          flex-direction: column;
        }
        .user-name-txt {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
        }
        .user-role-txt {
          font-size: 11px;
          color: var(--text-muted);
        }
        .workspace-content {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }
        @media (max-width: 1024px) {
          .sidebar { transform: translateX(-260px); }
          .sidebar.open { transform: translateX(0); }
          .main-workspace { margin-left: 0; }
          .mobile-menu-toggle { display: block; }
          .workspace-header { padding: 0 16px; }
          .workspace-content { padding: 20px 16px; }
        }
        .gorgeous-card {
          background-color: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          padding: 24px;
          transition: all var(--transition-normal);
        }
        .gorgeous-card:hover { box-shadow: var(--shadow-md); }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }
        .metric-card-styled {
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: var(--shadow-sm);
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }
        .metric-card-styled:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .metric-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        .metric-value {
          font-family: var(--heading-font);
          font-size: 22px;
          font-weight: 700;
          color: var(--text);
        }
        .metric-label {
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .dashboard-main-grid {
          display: grid;
          grid-template-columns: 2fr 1.2fr;
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .dashboard-main-grid { grid-template-columns: 1fr; }
        }
        .section-header-title {
          font-family: var(--heading-font);
          font-size: 16px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .faculty-action-btn-styled {
          background-color: var(--primary);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .faculty-action-btn-styled:hover { opacity: 0.95; }
        .vidyastra-toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background-color: #0F172A;
          color: white;
          padding: 12px 24px;
          border-radius: 10px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          z-index: 2000;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 500;
          border-left: 4px solid var(--primary);
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .courses-grid-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
        }
        .course-fancy-card {
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-normal);
        }
        .course-fancy-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        .course-fancy-header {
          padding: 24px;
          color: white;
          position: relative;
        }
        .course-fancy-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .fancy-progress-bar-container {
          background-color: #F1F5F9;
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
          width: 100%;
        }
        .fancy-progress-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.8s ease-out;
        }
        .fancy-table-container {
          width: 100%;
          overflow-x: auto;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          background-color: white;
        }
        .fancy-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 14px;
        }
        .fancy-table th {
          background-color: #F8FAFC;
          padding: 16px;
          font-weight: 600;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .fancy-table td {
          padding: 16px;
          border-bottom: 1px solid var(--border);
          vertical-align: middle;
        }
        .fancy-table tr:last-child td { border-bottom: none; }
        .camera-simulation-preview {
          background-color: #0F172A;
          border-radius: var(--radius-md);
          height: 280px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          margin-bottom: 20px;
        }
        .camera-active-signal {
          position: absolute;
          top: 16px;
          left: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: rgba(0,0,0,0.5);
          padding: 4px 10px;
          border-radius: 20px;
          color: white;
          font-size: 11px;
          font-weight: 700;
        }
        .record-dot-blinking {
          width: 8px;
          height: 8px;
          background-color: #EF4444;
          border-radius: 50%;
          animation: blink 1s infinite alternate;
        }
        @keyframes blink {
          0% { opacity: 0.2; }
          100% { opacity: 1; }
        }
        .badge-status {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
        }
        .badge-status.success { background-color: #ECFDF5; color: #10B981; }
        .badge-status.processing { background-color: #EFF6FF; color: #3B82F6; }
        .badge-status.queue { background-color: #F1F5F9; color: #64748B; }
        .chat-container {
          background-color: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          height: 520px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .chat-messages-scroll {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background-color: #F8FAFC;
        }
        .chat-bubble {
          max-width: 75%;
          padding: 14px 18px;
          border-radius: 14px;
          font-size: 14px;
          line-height: 1.5;
          position: relative;
        }
        .chat-bubble.ai {
          background-color: white;
          color: var(--text);
          border: 1px solid var(--border);
          align-self: flex-start;
          border-top-left-radius: 2px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .chat-bubble.user {
          background-color: var(--primary);
          color: white;
          align-self: flex-end;
          border-top-right-radius: 2px;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
        }
        .chat-time {
          font-size: 10px;
          color: var(--text-muted);
          margin-top: 4px;
          display: block;
          text-align: right;
        }
        .chat-bubble.user .chat-time { color: rgba(255, 255, 255, 0.7); }
        .chat-chips-container {
          padding: 12px 24px;
          background-color: white;
          border-top: 1px solid var(--border);
          display: flex;
          gap: 8px;
          overflow-x: auto;
          flex-shrink: 0;
        }
        .chat-chip {
          padding: 6px 12px;
          border-radius: 9999px;
          background-color: #EEF2FF;
          color: var(--primary);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          border: 1px solid #E0E7FF;
          white-space: nowrap;
        }
        .chat-chip:hover {
          background-color: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        .chat-input-bar {
          padding: 16px 24px;
          background-color: white;
          border-top: 1px solid var(--border);
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .chat-input-field {
          flex: 1;
          height: 40px;
          border-radius: 8px;
          border: 1px solid var(--border);
          padding: 0 16px;
          font-size: 14px;
          outline: none;
        }
        .chat-input-field:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
        }
        .chat-send-btn {
          height: 40px;
          width: 40px;
          border-radius: 8px;
          background-color: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: none;
          transition: opacity var(--transition-fast);
        }
        .chat-send-btn:hover { opacity: 0.9; }
        .messages-split-view {
          display: grid;
          grid-template-columns: 1fr 2fr;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background-color: white;
          height: 520px;
          overflow: hidden;
        }
        .thread-sidebar {
          border-right: 1px solid var(--border);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        .thread-item-wrapper {
          padding: 16px;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: background-color 0.15s;
        }
        .thread-item-wrapper:hover { background-color: #F8FAFC; }
        .thread-item-wrapper.active {
          background-color: var(--primary-light);
          border-left: 3px solid var(--primary);
        }
        .active-thread-chat {
          display: flex;
          flex-direction: column;
          background-color: #F8FAFC;
        }
        .active-thread-body-scroll {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .settings-grid {
          display: grid;
          grid-template-columns: 1.2fr 2fr;
          gap: 32px;
        }
        @media (max-width: 900px) {
          .settings-grid { grid-template-columns: 1fr; }
        }
        .profile-side-card {
          background: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 24px;
          text-align: center;
          box-shadow: var(--shadow-sm);
        }
        .profile-avatar-large {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4F46E5 0%, #818CF8 100%);
          color: white;
          font-size: 32px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
        }
        .settings-form-group { margin-bottom: 16px; }
        .settings-form-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 6px;
        }
        .settings-input-control {
          width: 100%;
          height: 40px;
          border-radius: 8px;
          border: 1px solid var(--border);
          padding: 0 16px;
          font-size: 14px;
          outline: none;
          color: var(--text);
        }
        .settings-input-control:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
        }
        .btn-submit-settings {
          background-color: var(--primary);
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity var(--transition-fast);
        }
        .btn-submit-settings:hover { opacity: 0.9; }
        .form-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }
        .toggle-switch-input { cursor: pointer; height: 20px; width: 38px; }
        .typing-dots {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 10px 16px;
          background-color: white;
          border: 1px solid var(--border);
          border-radius: 14px;
          align-self: flex-start;
          border-top-left-radius: 2px;
        }
        .typing-dot {
          width: 6px;
          height: 6px;
          background-color: var(--text-muted);
          border-radius: 50%;
          animation: bounce-dot 1.2s infinite ease-in-out;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce-dot {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .chart-svg-container {
          width: 100%;
          height: 200px;
          background-color: #F8FAFC;
          border-radius: 8px;
          border: 1px solid var(--border);
          position: relative;
          overflow: hidden;
          padding: 16px;
        }
      `}</style>

      {/* Persistent Left-Aligned Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo-circle">
            <GraduationCap className="text-white h-5 w-5" />
          </div>
          <span className="brand-name">Vidyastra AI</span>
        </div>

        <nav className="sidebar-menu">
          <button className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}>
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </button>
          
          <button className={`menu-item ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => { setActiveTab('courses'); setSidebarOpen(false); }}>
            <BookOpen className="h-4 w-4" />
            <span>My Courses</span>
          </button>

          <button className={`menu-item ${activeTab === 'live' ? 'active' : ''}`} onClick={() => { setActiveTab('live'); setSidebarOpen(false); }}>
            <Tv className="h-4 w-4" />
            <span>Live Class</span>
          </button>

          <button className={`menu-item ${activeTab === 'record' ? 'active' : ''}`} onClick={() => { setActiveTab('record'); setSidebarOpen(false); }}>
            <Video className="h-4 w-4" />
            <span>Lecture Recorder</span>
          </button>

          <button className={`menu-item ${activeTab === 'processing' ? 'active' : ''}`} onClick={() => { setActiveTab('processing'); setSidebarOpen(false); }}>
            <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Sparkles className="h-4 w-4" />
                <span>Processing Center</span>
              </span>
            </span>
          </button>

          <button className={`menu-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => { setActiveTab('library'); setSidebarOpen(false); }}>
            <FileText className="h-4 w-4" />
            <span>Content Library</span>
          </button>

          <button className={`menu-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => { setActiveTab('students'); setSidebarOpen(false); }}>
            <Users className="h-4 w-4" />
            <span>Student Roster</span>
          </button>

          <button className={`menu-item ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => { setActiveTab('assignments'); setSidebarOpen(false); }}>
            <ClipboardList className="h-4 w-4" />
            <span>Assignments</span>
          </button>

          <button className={`menu-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => { setActiveTab('analytics'); setSidebarOpen(false); }}>
            <BarChart2 className="h-4 w-4" />
            <span>Analytics</span>
          </button>

          <button className={`menu-item ${activeTab === 'assistant' ? 'active' : ''}`} onClick={() => { setActiveTab('assistant'); setSidebarOpen(false); }}>
            <MessageSquare className="h-4 w-4" />
            <span>AI Assistant</span>
          </button>

          <button className={`menu-item ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => { setActiveTab('messages'); setSidebarOpen(false); }}>
            <Bell className="h-4 w-4" />
            <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <span>Messages</span>
            </span>
          </button>

          <button className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}>
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="main-workspace">
        {/* Top Header Navigation */}
        <header className="workspace-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="mobile-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="header-title">
              {activeTab === 'dashboard' && 'Faculty Dashboard Overview'}
              {activeTab === 'courses' && 'My Active Courses'}
              {activeTab === 'live' && 'Upcoming Broadcast Schedules'}
              {activeTab === 'record' && 'Virtual Streaming Classroom'}
              {activeTab === 'processing' && 'AI Pipeline Synthesis Status'}
              {activeTab === 'library' && 'Resource Repository Archive'}
              {activeTab === 'students' && 'Enrolled Students Performance'}
              {activeTab === 'assignments' && 'Student Task Submissions Evaluation'}
              {activeTab === 'analytics' && 'Platform Performance Analytics'}
              {activeTab === 'assistant' && 'AI Classroom Assistant'}
              {activeTab === 'messages' && 'Student Inboxes Messages Thread'}
              {activeTab === 'settings' && 'Profile Settings Manager'}
            </h1>
          </div>

          <div className="header-actions">
            <div className="user-avatar-profile" onClick={() => setActiveTab('settings')}>
              <div className="avatar-circle-sm">SV</div>
              <div className="user-meta-header">
                <span className="user-name-txt">{profile.name}</span>
                <span className="user-role-txt">Faculty Instructor</span>
              </div>
            </div>
          </div>
        </header>

        {/* Workspace Content Scrollable Area */}
        <div className="workspace-content">
          {activeTab === 'dashboard' && (
            <FacultyHome 
              user={user}
              profile={profile}
              todayClasses={todayClasses}
              students={students}
              processingTasks={processingTasks}
              libraryResources={libraryResources}
              courses={courses}
              aiSettings={aiSettings}
              setRecCourse={setRecCourse}
              setRecTopic={setRecTopic}
              setActiveTab={setActiveTab}
              triggerToast={triggerToast}
            />
          )}

          {activeTab === 'courses' && (
            <MyCourses 
              courses={courses}
              setLibSearch={setLibSearch}
              setActiveTab={setActiveTab}
              triggerToast={triggerToast}
            />
          )}

          {activeTab === 'live' && (
            <LiveClass 
              setActiveTab={setActiveTab}
              todayClasses={todayClasses}
              courses={courses}
            />
          )}

          {activeTab === 'record' && (
            <LectureRecorder 
              isRecording={isRecording}
              recordingSeconds={recordingSeconds}
              formatRecTime={formatRecTime}
              recCourse={recCourse}
              setRecCourse={setRecCourse}
              recTopic={recTopic}
              setRecTopic={setRecTopic}
              recQuality={recQuality}
              setRecQuality={setRecQuality}
              recMic={recMic}
              setRecMic={setRecMic}
              startMockRecording={startMockRecording}
              stopMockRecording={stopMockRecording}
            />
          )}

          {activeTab === 'processing' && (
            <LectureCenter 
              refreshProcessingQueue={refreshProcessingQueue}
              refreshingQueue={refreshingQueue}
              processingTasks={processingTasks}
            />
          )}

          {activeTab === 'library' && (
            <ContentLibrary 
              libSearch={libSearch}
              setLibSearch={setLibSearch}
              libraryResources={libraryResources}
              togglePublishStatus={togglePublishStatus}
              deleteLibraryResource={deleteLibraryResource}
            />
          )}

          {activeTab === 'students' && (
            <StudentManagement 
              studentSearch={studentSearch}
              setStudentSearch={setStudentSearch}
              students={students}
            />
          )}

          {activeTab === 'assignments' && (
            <AssignmentAssess 
              assignments={assignments}
              activeGradeAssignment={activeGradeAssignment}
              setActiveGradeAssignment={setActiveGradeAssignment}
              gradingScore={gradingScore}
              setGradingScore={setGradingScore}
              gradingFeedback={gradingFeedback}
              setGradingFeedback={setGradingFeedback}
              submitGradeAction={submitGradeAction}
            />
          )}

          {activeTab === 'analytics' && (
            <Analytics />
          )}

          {activeTab === 'assistant' && (
            <AIAssistant 
              aiChatMessages={aiChatMessages}
              aiChatTyping={aiChatTyping}
              facultyAiSuggestions={facultyAiSuggestions}
              aiChatInput={aiChatInput}
              setAiChatInput={setAiChatInput}
              handleSendAiAssistantMessage={handleSendAiAssistantMessage}
            />
          )}

          {activeTab === 'messages' && (
            <MessagesAnnounce 
              chatThreads={chatThreads}
              activeMessageThread={activeMessageThread}
              setActiveMessageThread={setActiveMessageThread}
              messageReplyText={messageReplyText}
              setMessageReplyText={setMessageReplyText}
              sendFacultyMessageReply={sendFacultyMessageReply}
            />
          )}

          {activeTab === 'settings' && (
            <ProfileSettings 
              profile={profile}
              setProfile={setProfile}
              handleSaveProfile={handleSaveProfile}
            />
          )}
        </div>
      </main>

      {/* Floating Status Toast Alert */}
      {toast && (
        <div className={`vidyastra-toast ${toast.type}`}>
          <Sparkles className="h-4 w-4" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default FacultyLayout;
