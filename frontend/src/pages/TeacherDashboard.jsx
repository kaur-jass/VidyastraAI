import { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  Video, 
  Tv, 
  Cpu, 
  FolderOpen, 
  Users, 
  ClipboardList, 
  BarChart2, 
  Sparkles, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  RefreshCw, 
  Send, 
  X, 
  Calendar, 
  Camera, 
  TrendingUp,
  Menu
} from 'lucide-react';

// Helper functions defined outside the component to ensure component render purity
const generateTaskId = () => Date.now();
const getFormattedLocalDate = () => new Date().toLocaleDateString();

const TeacherDashboard = ({ user, onLogout }) => {
  // Navigation and Layout state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Toast Helper
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Profile data
  const [profile, setProfile] = useState({
    name: user?.name || 'Dr. Sarah Verma',
    department: 'Computer Science & Engineering',
    email: 'sarah.verma@vidyastra.ai',
    office: 'Block-VI, Room 402',
    phone: '+91 94432 10987',
    smsAlerts: true,
    autoGrader: false
  });


  // Real-time courses list
  const [courses] = useState([
    { code: 'CS201', name: 'Data Structures & Algorithms', studentsCount: 58, progress: 75, bgGradient: 'from-blue-500 to-indigo-600' },
    { code: 'CS202', name: 'Database Management Systems', studentsCount: 62, progress: 60, bgGradient: 'from-purple-500 to-pink-600' },
    { code: 'CS203', name: 'Operating Systems', studentsCount: 65, progress: 40, bgGradient: 'from-amber-500 to-orange-600' },
    { code: 'CS204', name: 'Computer Networks', studentsCount: 55, progress: 20, bgGradient: 'from-emerald-500 to-teal-600' }
  ]);

  // Today's classes
  const [todayClasses] = useState([
    { id: 1, time: '09:00 AM - 10:00 AM', subject: 'Data Structures & Algorithms', code: 'CS201', room: 'LHC-102', status: 'Completed' },
    { id: 2, time: '10:15 AM - 11:15 AM', subject: 'Database Management Systems', code: 'CS202', room: 'LHC-204', status: 'Live' },
    { id: 3, time: '02:00 PM - 03:00 PM', subject: 'Operating Systems', code: 'CS203', room: 'LHC-101', status: 'Scheduled' }
  ]);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recQuality, setRecQuality] = useState('1080p');
  const [recMic, setRecMic] = useState('Default Input');

  const [recCourse, setRecCourse] = useState('CS201');
  const [recTopic, setRecTopic] = useState('');
  const recIntervalRef = useRef(null);

  const formatRecTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startMockRecording = () => {
    if (!recTopic.trim()) {
      alert("Please provide a lecture topic name before starting the recording!");
      return;
    }
    setIsRecording(true);
    setRecordingSeconds(0);
    triggerToast("Lecture recording started successfully!");
    recIntervalRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopMockRecording = () => {
    clearInterval(recIntervalRef.current);
    setIsRecording(false);
    triggerToast(`Lecture "${recTopic}" recorded successfully! Sending to processing center...`);
    
    // Add to processing queue
    const newTask = {
      id: generateTaskId(),
      topic: recTopic,
      course: recCourse,
      transcript: 'Processing',
      summary: 'In Queue',
      quiz: 'In Queue',
      date: getFormattedLocalDate()
    };
    setProcessingTasks(prev => [newTask, ...prev]);
    setRecTopic('');
    setRecordingSeconds(0);
    setActiveTab('processing');
  };

  useEffect(() => {
    return () => clearInterval(recIntervalRef.current);
  }, []);

  // Processing Center State
  const [processingTasks, setProcessingTasks] = useState([
    { id: 101, topic: 'Lecture 12: Binary Tree Traversals', course: 'CS201', transcript: 'Success', summary: 'Success', quiz: 'Success', date: '12 Jun 2026' },
    { id: 102, topic: 'Lecture 13: Normalization & Keys', course: 'CS202', transcript: 'Success', summary: 'Success', quiz: 'Success', date: '13 Jun 2026' },
    { id: 103, topic: 'Lecture 14: CPU Scheduling Algorithms', course: 'CS203', transcript: 'Processing (60%)', summary: 'In Queue', quiz: 'In Queue', date: '14 Jun 2026' }
  ]);

  const [refreshingQueue, setRefreshingQueue] = useState(false);

  const refreshProcessingQueue = () => {
    setRefreshingQueue(true);
    setTimeout(() => {
      setProcessingTasks(prev => prev.map(t => {
        if (t.id === 103) {
          return { ...t, transcript: 'Success', summary: 'Processing (40%)' };
        }
        return t;
      }));
      setRefreshingQueue(false);
      triggerToast("AI Processing Pipeline synched!");
    }, 1200);
  };

  // Content Library state
  const [libraryResources, setLibraryResources] = useState([
    { id: 1, title: 'Introduction to Stacks & Queues.pdf', subject: 'DSA', size: '2.4 MB', date: '12 Jun 2026', status: 'Published' },
    { id: 2, title: 'Normal Forms Cheat Sheet.pdf', subject: 'DBMS', size: '1.8 MB', date: '10 Jun 2026', status: 'Published' },
    { id: 3, title: 'CPU Scheduling Algorithms.pptx', subject: 'OS', size: '4.5 MB', date: '08 Jun 2026', status: 'Draft' },
    { id: 4, title: 'OSI Layer Diagram.png', subject: 'CN', size: '950 KB', date: '05 Jun 2026', status: 'Published' }
  ]);

  const [libSearch, setLibSearch] = useState('');

  const togglePublishStatus = (id) => {
    setLibraryResources(prev => prev.map(res => {
      if (res.id === id) {
        const nextStatus = res.status === 'Published' ? 'Draft' : 'Published';
        triggerToast(`Resource changed to ${nextStatus}!`);
        return { ...res, status: nextStatus };
      }
      return res;
    }));
  };

  const deleteLibraryResource = (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      setLibraryResources(prev => prev.filter(res => res.id !== id));
      triggerToast("Resource deleted successfully.");
    }
  };

  // Student roster state
  const [students] = useState([
    { roll: '2026CSE1045', name: 'Rohan Sharma', attendance: 92, progress: 75, status: 'Active' },
    { roll: '2026CSE1046', name: 'Priya Patel', attendance: 95, progress: 82, status: 'Active' },
    { roll: '2026CSE1047', name: 'Amit Kumar', attendance: 88, progress: 60, status: 'Active' },
    { roll: '2026CSE1048', name: 'Sneha Reddy', attendance: 94, progress: 70, status: 'Active' },
    { roll: '2026CSE1049', name: 'Vikram Singh', attendance: 78, progress: 40, status: 'Warning' }
  ]);

  const [studentSearch, setStudentSearch] = useState('');

  // Assignments assessments state
  const [assignments, setAssignments] = useState([
    { id: 1, student: 'Rohan Sharma', assignment: 'Red-Black Trees Implementation', date: '14 Jun 2026', status: 'Pending', grade: null },
    { id: 2, student: 'Priya Patel', assignment: 'SQL Practice Set - Joins', date: '13 Jun 2026', status: 'Graded', grade: '48 / 50' },
    { id: 3, student: 'Amit Kumar', assignment: 'Red-Black Trees Implementation', date: '14 Jun 2026', status: 'Pending', grade: null },
    { id: 4, student: 'Sneha Reddy', assignment: 'IP Subnetting Worksheet', date: '11 Jun 2026', status: 'Graded', grade: '55 / 60' }
  ]);

  const [activeGradeAssignment, setActiveGradeAssignment] = useState(null);
  const [gradingScore, setGradingScore] = useState('');
  const [gradingFeedback, setGradingFeedback] = useState('');

  const submitGradeAction = () => {
    if (!gradingScore.trim()) {
      alert("Please provide a score before saving!");
      return;
    }
    setAssignments(prev => prev.map(a => {
      if (a.id === activeGradeAssignment.id) {
        return { ...a, status: 'Graded', grade: `${gradingScore} / 50` };
      }
      return a;
    }));
    triggerToast(`Graded submission for ${activeGradeAssignment.student}! Score: ${gradingScore}`);
    setActiveGradeAssignment(null);
    setGradingScore('');
    setGradingFeedback('');
  };

  // AI Assistant Tab Chat State
  const [aiChatMessages, setAiChatMessages] = useState([
    { sender: 'ai', text: "Hello Dr. Sarah Verma! I am your Vidyastra Faculty Assistant. ✦\nHow can I support your classroom planning today? You can command me to generate lecture outlines, compile quick quiz questions, or draft student announcements.", time: "11:50 AM" }
  ]);

  const [aiChatInput, setAiChatInput] = useState('');
  const [aiChatTyping, setAiChatTyping] = useState(false);

  const facultyAiSuggestions = [
    { label: "Generate quiz questions on AVL Trees", response: "### AI-Generated AVL Tree Quiz Questions\n\n1. **Which rotation is performed when a node is inserted in the left subtree of the left child?**\n   - A) Right-Left (RL)\n   - B) Single Right (LL)\n   - C) Single Left (RR)\n   - D) Left-Right (LR)\n   - *Answer: B (LL Rotation)*\n\n2. **What is the maximum height difference allowed between left and right subtrees in AVL?**\n   - A) 0\n   - B) 1\n   - C) 2\n   - D) Log N\n   - *Answer: B (height balance factor range is {-1, 0, 1})*" },
    { label: "Summarize feedback for OS assignment", response: "### Assignment Feedback Summary: Shell Scripting\n\n- **Total Submissions**: 52 / 58\n- **Common Strengths**: Strong execution flow, clean folder creation scripts.\n- **Identified Weaknesses**: Minor syntax errors in handling child processes, missing validation checks for command inputs.\n- **Recommended Focus**: Spend 10 minutes covering standard file descriptors and process bounds in tomorrow's lecture." },
    { label: "Create outline for Database Indexing lecture", response: "### Lecture Outline: Database Indexing & B-Trees\n\n- **Slide 1**: Introduction (Why indexes speed up select queries)\n- **Slide 2**: Dense vs. Sparse Indexes\n- **Slide 3**: B-Tree structures (balancing nodes, leaf expansions)\n- **Slide 4**: B+ Trees (why sequential keys are stored in leaves)\n- **Slide 5**: Coding demo (SQL explain query analysis)" }
  ];

  const handleSendAiAssistantMessage = (textToSend) => {
    if (!textToSend.trim()) return;

    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAiChatMessages(prev => [...prev, { sender: 'user', text: textToSend, time: formattedTime }]);
    setAiChatInput('');
    setAiChatTyping(true);

    setTimeout(() => {
      const matched = facultyAiSuggestions.find(s => s.label === textToSend);
      let replyText = "";
      if (matched) {
        replyText = matched.response;
      } else {
        replyText = `Understood. I will parse your command "${textToSend}". Preparing AI outlines for your syllabus. You can review and deploy these directly to the Student Portal!`;
      }
      setAiChatMessages(prev => [...prev, {
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setAiChatTyping(false);
    }, 1200);
  };

  // Messages State
  const [activeMessageThread, setActiveMessageThread] = useState(1);
  const [chatThreads, setChatThreads] = useState([
    {
      id: 1,
      studentName: 'Rohan Sharma',
      subject: 'Query on Red-Black Tree Rotation',
      unread: true,
      messages: [
        { sender: 'student', text: "Hello Ma'am, I am experiencing stack overflows in my Red-Black Tree recursive balancing routine. Is it fine if I use iterative swaps?", time: "Yesterday" }
      ]
    },
    {
      id: 2,
      studentName: 'Priya Patel',
      subject: 'Normal Forms Homework deadline',
      unread: false,
      messages: [
        { sender: 'student', text: "Thank you for the normal forms slides! They really helped with the normalization practice quiz.", time: "2 days ago" }
      ]
    }
  ]);

  const [messageReplyText, setMessageReplyText] = useState('');

  const sendFacultyMessageReply = () => {
    if (!messageReplyText.trim()) return;
    setChatThreads(prev => prev.map(t => {
      if (t.id === activeMessageThread) {
        return {
          ...t,
          unread: false,
          messages: [
            ...t.messages,
            { sender: 'teacher', text: messageReplyText, time: 'Now' }
          ]
        };
      }
      return t;
    }));
    triggerToast("Response sent successfully!");
    setMessageReplyText('');
  };

  // Profile save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    triggerToast("Saving settings configurations...");
    setTimeout(() => {
      triggerToast("Faculty configurations updated!");
    }, 1000);
  };

  return (
    <div className="vidyastra-container">
      {/* Page Scoped Embedded CSS */}
      <style>{`
        /* Reset and Base container */
        .vidyastra-container {
          display: flex;
          min-height: 100vh;
          font-family: var(--sans-font);
          background-color: var(--bg);
          color: var(--text);
          position: relative;
        }

        /* Sidebar Styling */
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
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 9px 16px;
          border-radius: 8px;
          color: #94A3B8;
          font-size: 13.5px;
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
          padding: 16px 12px;
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

        /* Main Workspace View */
        .main-workspace {
          flex: 1;
          margin-left: 260px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg);
          transition: margin-left 0.3s ease;
        }

        /* Top Header Navigation */
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

        /* Workspace Content Scrollable Area */
        .workspace-content {
          flex: 1;
          padding: 32px;
          overflow-y: auto;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-260px);
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .main-workspace {
            margin-left: 0;
          }
          .mobile-menu-toggle {
            display: block;
          }
          .workspace-header {
            padding: 0 16px;
          }
          .workspace-content {
            padding: 20px 16px;
          }
        }

        /* Styled Premium Cards */
        .gorgeous-card {
          background-color: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          padding: 24px;
          transition: all var(--transition-normal);
        }

        .gorgeous-card:hover {
          box-shadow: var(--shadow-md);
        }

        .gradient-banner {
          background: linear-gradient(135deg, #4F46E5 0%, #312E81 100%);
          border-radius: var(--radius-md);
          padding: 24px 32px;
          color: white;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .gradient-banner-bg-sparks {
          position: absolute;
          right: -10px;
          bottom: -20px;
          opacity: 0.15;
          width: 240px;
          height: auto;
          color: white;
        }

        /* Metric Grid */
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

        /* Subview Specific layouts */
        .dashboard-main-grid {
          display: grid;
          grid-template-columns: 2fr 1.2fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .dashboard-main-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Section Headings */
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

        /* Custom Float Toast Alert */
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

        .vidyastra-toast.info {
          border-left-color: var(--info);
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Courses grid styling */
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

        /* Table custom styling */
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

        .fancy-table tr:last-child td {
          border-bottom: none;
        }

        .badge-status {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .badge-status.success {
          background-color: #D1FAE5;
          color: #059669;
        }

        .badge-status.processing {
          background-color: #DBEAFE;
          color: #2563EB;
        }

        .badge-status.queue {
          background-color: #FEF3C7;
          color: #D97706;
        }

        /* AI Tutor Chat view styling */
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

        .chat-bubble.user .chat-time {
          color: rgba(255, 255, 255, 0.7);
        }

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

        .chat-send-btn:hover {
          opacity: 0.9;
        }

        /* Study Hours Chart Mockup */
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

        /* Settings split layout */
        .settings-grid {
          display: grid;
          grid-template-columns: 1.2fr 2fr;
          gap: 32px;
        }

        @media (max-width: 900px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Profile Left card */
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

        /* Settings Form input controls */
        .settings-form-group {
          margin-bottom: 16px;
        }

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

        .btn-submit-settings:hover {
          opacity: 0.9;
        }

        .form-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }

        .toggle-switch-input {
          cursor: pointer;
          height: 20px;
          width: 38px;
        }

        /* Camera Simulator styling */
        .camera-simulation-preview {
          background-color: #1E293B;
          border-radius: var(--radius-md);
          width: 100%;
          height: 260px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #64748B;
          position: relative;
          overflow: hidden;
          border: 1px solid var(--border);
        }

        .camera-active-signal {
          position: absolute;
          top: 16px;
          left: 16px;
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: rgba(0,0,0,0.6);
          color: white;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
        }

        .record-dot-blinking {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #EF4444;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }

        /* Messaging structure */
        .messages-split-view {
          display: grid;
          grid-template-columns: 1.2fr 2fr;
          background-color: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          height: 520px;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .messages-split-view {
            grid-template-columns: 1fr;
          }
        }

        .thread-sidebar {
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .thread-item-wrapper {
          padding: 16px;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }

        .thread-item-wrapper:hover {
          background-color: #F8FAFC;
        }

        .thread-item-wrapper.active {
          background-color: #EEF2FF;
          border-left: 4px solid var(--primary);
        }

        .active-thread-chat {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .active-thread-body-scroll {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          background-color: #F8FAFC;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .faculty-action-btn-styled {
          background: linear-gradient(135deg, var(--primary) 0%, #6366F1 100%);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: opacity var(--transition-fast);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .faculty-action-btn-styled:hover {
          opacity: 0.9;
        }

        .btn-ai-spark {
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #C084FC 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
          transition: all var(--transition-fast);
        }

        .btn-ai-spark:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(124, 58, 237, 0.5);
        }

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
      `}</style>

      {/* Persistent Left-Aligned Sidebar Navigation */}
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
            <Video className="h-4 w-4" />
            <span>Live Class</span>
          </button>

          <button className={`menu-item ${activeTab === 'record' ? 'active' : ''}`} onClick={() => { setActiveTab('record'); setSidebarOpen(false); }}>
            <Tv className="h-4 w-4" />
            <span>Record / Upload</span>
          </button>

          <button className={`menu-item ${activeTab === 'processing' ? 'active' : ''}`} onClick={() => { setActiveTab('processing'); setSidebarOpen(false); }}>
            <Cpu className="h-4 w-4" />
            <span>Processing Center</span>
          </button>

          <button className={`menu-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => { setActiveTab('library'); setSidebarOpen(false); }}>
            <FolderOpen className="h-4 w-4" />
            <span>Content Library</span>
          </button>

          <button className={`menu-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => { setActiveTab('students'); setSidebarOpen(false); }}>
            <Users className="h-4 w-4" />
            <span>Students</span>
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
            <Sparkles className="h-4 w-4" />
            <span>AI Assistant</span>
          </button>

          <button className={`menu-item ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => { setActiveTab('messages'); setSidebarOpen(false); }}>
            <MessageSquare className="h-4 w-4" />
            <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <span>Messages</span>
              <span style={{ backgroundColor: '#EF4444', color: 'white', fontSize: '10px', padding: '1px 6px', borderRadius: '10px', fontWeight: 'bold' }}>1</span>
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
        {/* Workspace Header */}
        <header className="workspace-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="mobile-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="header-title">
              {activeTab === 'dashboard' && 'Faculty Dashboard Overview'}
              {activeTab === 'courses' && 'Curriculum Management'}
              {activeTab === 'live' && 'Active Virtual Classrooms'}
              {activeTab === 'record' && 'Lecture Recorder'}
              {activeTab === 'processing' && 'AI Task Processing Center'}
              {activeTab === 'library' && 'Resource Content Library'}
              {activeTab === 'students' && 'Enrolled Students Roster'}
              {activeTab === 'assignments' && 'Assignments Evaluation'}
              {activeTab === 'analytics' && 'Engagement Analytics'}
              {activeTab === 'assistant' && 'AI Assistant Panel'}
              {activeTab === 'messages' && 'Student Communications'}
              {activeTab === 'settings' && 'Account Settings'}
            </h1>
          </div>

          <div className="header-actions">
            {/* Notification trigger */}
            <button className="bell-trigger" onClick={() => setActiveTab('messages')}>
              <MessageSquare className="h-5 w-5" />
              <span className="bell-badge">1</span>
            </button>

            {/* Profile trigger */}
            <div className="user-avatar-profile" onClick={() => setActiveTab('settings')}>
              <div className="avatar-circle-sm">
                SV
              </div>
              <div className="user-meta-header" style={{ display: 'none', md: 'flex' }}>
                <span className="user-name-txt">{profile.name}</span>
                <span className="user-role-txt">{profile.department}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Workspace Content Scrollable Area */}
        <div className="workspace-content">

          {/* 1. DASHBOARD VIEW (HOME) */}
          {activeTab === 'dashboard' && (
            <div className="view-fade-in">
              {/* Stats Counters Grid */}
              <div className="metrics-grid">
                <div className="metric-card-styled">
                  <div className="metric-icon-box" style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)' }}>
                    <Video className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="metric-value">{todayClasses.length} Sessions</div>
                    <div className="metric-label">Today's Classes</div>
                  </div>
                </div>

                <div className="metric-card-styled">
                  <div className="metric-icon-box" style={{ backgroundColor: '#ECFDF5', color: '#10B981' }}>
                    <Tv className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="metric-value">14 Lectures</div>
                    <div className="metric-label">Recorded Lectures</div>
                  </div>
                </div>

                <div className="metric-card-styled">
                  <div className="metric-icon-box" style={{ backgroundColor: '#FAF5FF', color: '#8B5CF6' }}>
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="metric-value">185 Active</div>
                    <div className="metric-label">Enrolled Students</div>
                  </div>
                </div>

                <div className="metric-card-styled">
                  <div className="metric-icon-box" style={{ backgroundColor: '#FFF7ED', color: '#F59E0B' }}>
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="metric-value">840 / 1000</div>
                    <div className="metric-label">AI Tokens Used</div>
                  </div>
                </div>
              </div>

              {/* Main row grid */}
              <div className="dashboard-main-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Today's schedule */}
                  <div className="gorgeous-card">
                    <h3 className="section-header-title">
                      <Clock className="h-4 w-4 text-indigo-500" /> Today's Class Schedule
                    </h3>
                    <div className="fancy-table-container">
                      <table className="fancy-table">
                        <thead>
                          <tr>
                            <th>Syllabus Course</th>
                            <th>Time slot</th>
                            <th>Location / Code</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {todayClasses.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <span style={{ fontWeight: '700', color: '#1E293B' }}>{item.subject}</span>
                                <span style={{ fontSize: '11px', display: 'block', color: 'var(--text-muted)' }}>{item.code} • Theory Lecture</span>
                              </td>
                              <td>{item.time}</td>
                              <td>{item.room}</td>
                              <td>
                                {item.status === 'Completed' ? (
                                  <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '700' }}>✓ Completed</span>
                                ) : item.status === 'Live' ? (
                                  <button 
                                    className="faculty-action-btn-styled"
                                    onClick={() => {
                                      setRecCourse(item.code);
                                      setRecTopic(`Live lecture: ${item.subject} Concepts`);
                                      setActiveTab('record');
                                      triggerToast(`Initializing Virtual Streaming Classroom...`);
                                    }}
                                  >
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                    Start Stream
                                  </button>
                                ) : (
                                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Scheduled</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* AI Content tracker summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="gorgeous-card" style={{ border: '1px dashed #A5B4FC', backgroundColor: '#F5F3FF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#6D28D9' }}>
                      <Sparkles className="h-5 w-5" />
                      <h3 style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>AI Study Resource Tracker</h3>
                    </div>
                    <p style={{ fontSize: '13px', color: '#5B21B6', lineHeight: '1.4', marginBottom: '16px' }}>
                      AI processes lecture uploads to generate student materials. Current pipeline summary:
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #E9D5FF' }}>
                        <div>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>LECTURE 13: Normalization</span>
                          <span style={{ fontSize: '13px', fontWeight: '600' }}>Transcripts & Quizzes</span>
                        </div>
                        <span className="badge-status success" style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
                          <CheckCircle2 className="h-3 w-3" /> Ready
                        </span>
                      </div>

                      <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #E9D5FF' }}>
                        <div>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>LECTURE 14: CPU Scheduling</span>
                          <span style={{ fontSize: '13px', fontWeight: '600' }}>AI Lecture Summaries</span>
                        </div>
                        <span className="badge-status processing" style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
                          <RefreshCw className="h-3 w-3 animate-spin" /> 60%
                        </span>
                      </div>

                      <button 
                        onClick={() => setActiveTab('processing')}
                        style={{ backgroundColor: '#7C3AED', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', textAlign: 'center' }}
                      >
                        Launch Processing Center →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. MY COURSES VIEW */}
          {activeTab === 'courses' && (
            <div className="view-fade-in">
              <div className="courses-grid-cards">
                {courses.map((course, idx) => (
                  <div key={idx} className="course-fancy-card">
                    <div className={`course-fancy-header bg-gradient-to-br ${course.bgGradient}`}>
                      <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '8px' }}>
                        {course.code}
                      </span>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>{course.name}</h3>
                      <span style={{ fontSize: '12px', display: 'block', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>
                        {course.studentsCount} Students Enrolled
                      </span>
                    </div>

                    <div className="course-fancy-body">
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Syllabus Completion</span>
                          <span style={{ color: 'var(--text)' }}>{course.progress}%</span>
                        </div>
                        <div className="fancy-progress-bar-container">
                          <div className="fancy-progress-bar-fill" style={{ width: `${course.progress}%`, backgroundColor: '#4F46E5' }} />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => {
                            setLibSearch(course.code);
                            setActiveTab('library');
                            triggerToast(`Displaying documents for ${course.name}`);
                          }}
                          style={{ flex: 1, backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', padding: '8px', fontSize: '12px', fontWeight: '600', borderRadius: '6px', cursor: 'pointer', color: 'var(--text)' }}
                        >
                          Course Files
                        </button>
                        <button 
                          onClick={() => triggerToast(`Managing settings for ${course.name}`)}
                          className="faculty-action-btn-styled"
                          style={{ flex: 1, justifyContent: 'center' }}
                        >
                          Manage Course
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. LIVE CLASS VIEW */}
          {activeTab === 'live' && (
            <div className="view-fade-in">
              <div className="dashboard-main-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="gorgeous-card">
                    <h3 className="section-header-title">
                      <Calendar className="h-4 w-4 text-indigo-500" /> Scheduled Streams & Timetable
                    </h3>
                    <div className="fancy-table-container">
                      <table className="fancy-table">
                        <thead>
                          <tr>
                            <th>Class details</th>
                            <th>Scheduled Date</th>
                            <th>Time frame</th>
                            <th>Room Location</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <span style={{ fontWeight: '700' }}>CS201 • Data Structures</span>
                            </td>
                            <td>Tomorrow, 16 Jun 2026</td>
                            <td>09:00 AM - 10:00 AM</td>
                            <td>LHC-102</td>
                          </tr>
                          <tr>
                            <td>
                              <span style={{ fontWeight: '700' }}>CS202 • Database Systems</span>
                            </td>
                            <td>Tomorrow, 16 Jun 2026</td>
                            <td>10:15 AM - 11:15 AM</td>
                            <td>LHC-204</td>
                          </tr>
                          <tr>
                            <td>
                              <span style={{ fontWeight: '700' }}>CS203 • Operating Systems</span>
                            </td>
                            <td>Wed, 17 Jun 2026</td>
                            <td>02:00 PM - 03:00 PM</td>
                            <td>LHC-101</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="gorgeous-card">
                    <h3 className="section-header-title">
                      <Tv className="h-4 w-4 text-indigo-500" /> Start Streaming Room
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                      To launch a live session, select a course, key in the topic title, and start recording in the recorder page.
                    </p>
                    <button 
                      onClick={() => setActiveTab('record')}
                      className="faculty-action-btn-styled"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Open Video Recorder →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. RECORD / UPLOAD VIEW */}
          {activeTab === 'record' && (
            <div className="view-fade-in">
              <div className="dashboard-main-grid">
                {/* Left Preview Box */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="gorgeous-card">
                    <h3 className="section-header-title">
                      <Camera className="h-4 w-4 text-indigo-500" /> Video Camera Simulator
                    </h3>
                    
                    <div className="camera-simulation-preview">
                      {isRecording ? (
                        <>
                          <div className="camera-active-signal">
                            <div className="record-dot-blinking" />
                            <span>REC: {formatRecTime(recordingSeconds)}</span>
                          </div>
                          <Camera className="h-16 w-16 text-red-500 animate-pulse" />
                          <span style={{ fontSize: '14px', color: 'white', marginTop: '12px', fontWeight: '700' }}>
                            Simulated Web camera streaming active...
                          </span>
                        </>
                      ) : (
                        <>
                          <Camera className="h-16 w-16 text-slate-700" />
                          <span style={{ fontSize: '13px', color: '#64748B', marginTop: '12px', fontWeight: '600' }}>
                            Camera feeds offline. Click start recording below.
                          </span>
                        </>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      {isRecording ? (
                        <button 
                          onClick={stopMockRecording}
                          className="faculty-action-btn-styled"
                          style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }}
                        >
                          Stop Recording
                        </button>
                      ) : (
                        <button 
                          onClick={startMockRecording}
                          className="faculty-action-btn-styled"
                        >
                          Start Recording
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Form Settings */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="gorgeous-card">
                    <h3 className="section-header-title">
                      <Settings className="h-4 w-4 text-indigo-500" /> Stream Settings
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Course Select</label>
                        <select 
                          value={recCourse} 
                          onChange={(e) => setRecCourse(e.target.value)}
                          style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid var(--border)', padding: '0 10px', outline: 'none' }}
                        >
                          <option value="CS201">Data Structures & Algorithms (CS201)</option>
                          <option value="CS202">Database Management Systems (CS202)</option>
                          <option value="CS203">Operating Systems (CS203)</option>
                          <option value="CS204">Computer Networks (CS204)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Lecture Topic Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Graph Algorithms: BFS & DFS"
                          value={recTopic}
                          onChange={(e) => setRecTopic(e.target.value)}
                          style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid var(--border)', padding: '0 10px', outline: 'none' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Video Quality</label>
                          <select 
                            value={recQuality} 
                            onChange={(e) => setRecQuality(e.target.value)}
                            style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid var(--border)', padding: '0 10px', outline: 'none' }}
                          >
                            <option value="720p">HD 720p</option>
                            <option value="1080p">FHD 1080p</option>
                            <option value="4k">UHD 4K</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Audio Mic Input</label>
                          <select 
                            value={recMic} 
                            onChange={(e) => setRecMic(e.target.value)}
                            style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid var(--border)', padding: '0 10px', outline: 'none' }}
                          >
                            <option value="Default Input">System Default microphone</option>
                            <option value="USB Mic">External USB Microphone</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. PROCESSING CENTER VIEW */}
          {activeTab === 'processing' && (
            <div className="view-fade-in">
              <div className="gorgeous-card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
                    AI Pipeline converts recordings into transcripts, summaries, and assessments.
                  </p>
                  <button 
                    onClick={refreshProcessingQueue}
                    disabled={refreshingQueue}
                    className="faculty-action-btn-styled"
                    style={{ gap: '6px' }}
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshingQueue ? 'animate-spin' : ''}`} /> Sync Center
                  </button>
                </div>
              </div>

              <div className="gorgeous-card">
                <div className="fancy-table-container">
                  <table className="fancy-table">
                    <thead>
                      <tr>
                        <th>Recorded Topic</th>
                        <th>Course</th>
                        <th>AI Transcript</th>
                        <th>AI Summary Notes</th>
                        <th>AI Quiz set</th>
                        <th>Date Processed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processingTasks.map((task) => (
                        <tr key={task.id}>
                          <td>
                            <span style={{ fontWeight: '700' }}>{task.topic}</span>
                          </td>
                          <td>{task.course}</td>
                          <td>
                            <span className={`badge-status ${task.transcript === 'Success' ? 'success' : task.transcript.startsWith('Processing') ? 'processing' : 'queue'}`}>
                              {task.transcript}
                            </span>
                          </td>
                          <td>
                            <span className={`badge-status ${task.summary === 'Success' ? 'success' : task.summary.startsWith('Processing') ? 'processing' : 'queue'}`}>
                              {task.summary}
                            </span>
                          </td>
                          <td>
                            <span className={`badge-status ${task.quiz === 'Success' ? 'success' : task.quiz.startsWith('Processing') ? 'processing' : 'queue'}`}>
                              {task.quiz}
                            </span>
                          </td>
                          <td>{task.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 6. CONTENT LIBRARY VIEW */}
          {activeTab === 'library' && (
            <div className="view-fade-in">
              {/* Toolbar */}
              <div className="gorgeous-card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>Course Resource Archive</h3>
                  
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={libSearch}
                    onChange={(e) => setLibSearch(e.target.value)}
                    style={{
                      height: '36px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      padding: '0 12px',
                      fontSize: '13px',
                      outline: 'none',
                      width: '260px'
                    }}
                  />
                </div>
              </div>

              {/* Resources Table */}
              <div className="gorgeous-card">
                <div className="fancy-table-container">
                  <table className="fancy-table">
                    <thead>
                      <tr>
                        <th>Resource Name</th>
                        <th>Subject</th>
                        <th>File Size</th>
                        <th>Uploaded Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {libraryResources
                        .filter(res => res.title.toLowerCase().includes(libSearch.toLowerCase()) || res.subject.toLowerCase().includes(libSearch.toLowerCase()))
                        .map((res) => (
                          <tr key={res.id}>
                            <td>
                              <span style={{ fontWeight: '700' }}>{res.title}</span>
                            </td>
                            <td>{res.subject}</td>
                            <td>{res.size}</td>
                            <td>{res.date}</td>
                            <td>
                              <span style={{
                                fontSize: '11px',
                                fontWeight: '700',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                backgroundColor: res.status === 'Published' ? '#D1FAE5' : '#F1F5F9',
                                color: res.status === 'Published' ? '#059669' : '#64748B'
                              }}>
                                {res.status}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button 
                                  onClick={() => togglePublishStatus(res.id)}
                                  style={{ border: 'none', backgroundColor: '#EEF2FF', color: 'var(--primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                                >
                                  {res.status === 'Published' ? 'Unpublish' : 'Publish'}
                                </button>
                                <button 
                                  onClick={() => deleteLibraryResource(res.id)}
                                  style={{ border: 'none', backgroundColor: '#FEF2F2', color: '#EF4444', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 7. STUDENTS ROSTER VIEW */}
          {activeTab === 'students' && (
            <div className="view-fade-in">
              <div className="gorgeous-card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>Student Performance Dashboard</h3>
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    style={{
                      height: '36px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      padding: '0 12px',
                      fontSize: '13px',
                      outline: 'none',
                      width: '260px'
                    }}
                  />
                </div>
              </div>

              <div className="gorgeous-card">
                <div className="fancy-table-container">
                  <table className="fancy-table">
                    <thead>
                      <tr>
                        <th>Roll Number</th>
                        <th>Student Name</th>
                        <th>Attendance Rate</th>
                        <th>Syllabus Completion</th>
                        <th>Academic Standing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students
                        .filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.roll.includes(studentSearch))
                        .map((std) => (
                          <tr key={std.roll}>
                            <td>{std.roll}</td>
                            <td>
                              <span style={{ fontWeight: '700' }}>{std.name}</span>
                            </td>
                            <td>{std.attendance}%</td>
                            <td>{std.progress}%</td>
                            <td>
                              <span style={{
                                fontSize: '11px',
                                fontWeight: '700',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                backgroundColor: std.status === 'Active' ? '#D1FAE5' : '#FEE2E2',
                                color: std.status === 'Active' ? '#059669' : '#EF4444'
                              }}>
                                {std.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 8. ASSIGNMENTS EVALUATION VIEW */}
          {activeTab === 'assignments' && (
            <div className="view-fade-in">
              <div className="gorgeous-card">
                <div className="fancy-table-container">
                  <table className="fancy-table">
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Assignment Title</th>
                        <th>Submitted Date</th>
                        <th>Grading standing</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map((ass) => (
                        <tr key={ass.id}>
                          <td>
                            <span style={{ fontWeight: '700' }}>{ass.student}</span>
                          </td>
                          <td>{ass.assignment}</td>
                          <td>{ass.date}</td>
                          <td>
                            <span className={`badge-status ${ass.status === 'Graded' ? 'success' : 'queue'}`}>
                              {ass.status === 'Graded' ? `Graded (${ass.grade})` : 'Pending review'}
                            </span>
                          </td>
                          <td>
                            {ass.status === 'Pending' ? (
                              <button 
                                onClick={() => setActiveGradeAssignment(ass)}
                                className="faculty-action-btn-styled"
                              >
                                Review & Grade
                              </button>
                            ) : (
                              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Evaluated</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Floating evaluation form */}
              {activeGradeAssignment && (
                <div style={{
                  position: 'fixed',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(15, 23, 42, 0.4)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2000
                }}>
                  <div className="gorgeous-card" style={{ width: '100%', maxWidth: '500px', backgroundColor: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
                      <h3 style={{ margin: 0, fontWeight: '700', fontSize: '16px' }}>Evaluate: {activeGradeAssignment.student}</h3>
                      <button 
                        onClick={() => setActiveGradeAssignment(null)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>ASSIGNMENT TASK</span>
                        <span style={{ fontSize: '13px', fontWeight: '700' }}>{activeGradeAssignment.assignment}</span>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Score Gained (Max: 50)</label>
                        <input
                          type="number"
                          placeholder="e.g. 45"
                          value={gradingScore}
                          onChange={(e) => setGradingScore(e.target.value)}
                          style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid var(--border)', padding: '0 10px', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Feedback & Remarks</label>
                        <textarea
                          rows={3}
                          placeholder="Provide descriptive feedback notes..."
                          value={gradingFeedback}
                          onChange={(e) => setGradingFeedback(e.target.value)}
                          style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--border)', padding: '10px', fontSize: '13px', outline: 'none', resize: 'vertical' }}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button 
                          onClick={() => setActiveGradeAssignment(null)}
                          style={{ backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: 'var(--text)' }}
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={submitGradeAction}
                          className="faculty-action-btn-styled"
                        >
                          Save Grade
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 9. ANALYTICS VIEW */}
          {activeTab === 'analytics' && (
            <div className="view-fade-in">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="gorgeous-card">
                  <h3 className="section-header-title">
                    <TrendingUp className="h-4 w-4 text-indigo-500" /> Attendance Engagement Metric
                  </h3>
                  
                  <div className="chart-svg-container" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px' }}>
                    {[
                      { day: 'Mon', hrs: 88, height: '88%' },
                      { day: 'Tue', hrs: 92, height: '92%' },
                      { day: 'Wed', hrs: 85, height: '85%' },
                      { day: 'Thu', hrs: 95, height: '95%' },
                      { day: 'Fri', hrs: 90, height: '90%' },
                      { day: 'Sat', hrs: 75, height: '75%' },
                      { day: 'Sun', hrs: 82, height: '82%' }
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', marginBottom: '8px' }}>{item.hrs}%</span>
                        <div style={{ width: '100%', height: '110px', backgroundColor: '#E2E8F0', borderRadius: '4px', position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
                          <div style={{ width: '100%', height: item.height, background: 'linear-gradient(to top, var(--primary) 0%, #818CF8 100%)', borderRadius: '4px' }} />
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', fontWeight: '500' }}>{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 10. AI ASSISTANT VIEW */}
          {activeTab === 'assistant' && (
            <div className="view-fade-in">
              <div className="chat-container">
                <div className="chat-messages-scroll">
                  {aiChatMessages.map((msg, idx) => (
                    <div key={idx} className={`chat-bubble ${msg.sender}`}>
                      <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                      <span className="chat-time">{msg.time}</span>
                    </div>
                  ))}
                  
                  {aiChatTyping && (
                    <div className="typing-dots">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  )}
                </div>

                <div className="chat-chips-container">
                  {facultyAiSuggestions.map((s, idx) => (
                    <button 
                      key={idx} 
                      className="chat-chip"
                      onClick={() => handleSendAiAssistantMessage(s.label)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="chat-input-bar">
                  <input
                    type="text"
                    placeholder="Ask AI to compile quizzes, draft emails, or analyze syllabus..."
                    value={aiChatInput}
                    onChange={(e) => setAiChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendAiAssistantMessage(aiChatInput);
                    }}
                    className="chat-input-field"
                  />
                  <button 
                    onClick={() => handleSendAiAssistantMessage(aiChatInput)}
                    className="chat-send-btn"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 11. MESSAGES VIEW */}
          {activeTab === 'messages' && (
            <div className="view-fade-in">
              <div className="messages-split-view">
                {/* Message threads list */}
                <div className="thread-sidebar">
                  {chatThreads.map((thread) => (
                    <div 
                      key={thread.id}
                      className={`thread-item-wrapper ${activeMessageThread === thread.id ? 'active' : ''}`}
                      onClick={() => setActiveMessageThread(thread.id)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700' }}>{thread.studentName}</h4>
                        {thread.unread && (
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                        )}
                      </div>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontWeight: '600', color: 'var(--text)' }}>
                        {thread.subject}
                      </p>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                        {thread.messages[thread.messages.length - 1].time}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Active Message chat thread */}
                <div className="active-thread-chat">
                  {(() => {
                    const activeThread = chatThreads.find(t => t.id === activeMessageThread);
                    if (!activeThread) return null;
                    return (
                      <>
                        <div className="active-thread-body-scroll">
                          {activeThread.messages.map((m, idx) => (
                            <div key={idx} className={`chat-bubble ${m.sender === 'teacher' ? 'user' : 'ai'}`}>
                              <p style={{ margin: 0 }}>{m.text}</p>
                              <span className="chat-time">{m.time}</span>
                            </div>
                          ))}
                        </div>

                        <div className="chat-input-bar">
                          <input
                            type="text"
                            placeholder="Type reply message to student..."
                            value={messageReplyText}
                            onChange={(e) => setMessageReplyText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') sendFacultyMessageReply();
                            }}
                            className="chat-input-field"
                          />
                          <button 
                            onClick={sendFacultyMessageReply}
                            className="chat-send-btn"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* 12. SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <div className="view-fade-in">
              <div className="settings-grid">
                <div className="profile-side-card">
                  <div className="profile-avatar-large">
                    SV
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0', color: 'var(--text)' }}>{profile.name}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Faculty ID: CSE-FAC-8822</span>
                  
                  <div style={{ borderTop: '1px solid var(--border)', marginTop: '20px', paddingTop: '20px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Department</span>
                      <p style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: '600' }}>{profile.department}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Email Address</span>
                      <p style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: '600' }}>{profile.email}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Office Space</span>
                      <p style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: '600' }}>{profile.office}</p>
                    </div>
                  </div>
                </div>

                <div className="gorgeous-card">
                  <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 20px 0', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                    Configure Faculty Parameters
                  </h3>

                  <form onSubmit={handleSaveProfile}>
                    <div className="settings-form-group">
                      <label className="settings-form-label">Full Name & Title</label>
                      <input 
                        type="text" 
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="settings-input-control" 
                      />
                    </div>

                    <div className="settings-form-group">
                      <label className="settings-form-label">Office Location</label>
                      <input 
                        type="text" 
                        value={profile.office}
                        onChange={(e) => setProfile({ ...profile, office: e.target.value })}
                        className="settings-input-control" 
                      />
                    </div>

                    <div className="settings-form-group">
                      <label className="settings-form-label">Contact Mobile</label>
                      <input 
                        type="text" 
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="settings-input-control" 
                      />
                    </div>

                    <h4 style={{ fontSize: '14px', fontWeight: '700', margin: '24px 0 12px 0' }}>Syllabus Automations</h4>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div className="form-toggle-row">
                        <div>
                          <span style={{ fontSize: '13px', fontWeight: '600' }}>Direct SMS Notifications</span>
                          <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Get SMS alerts when students submit assignments</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={profile.smsAlerts}
                          onChange={(e) => setProfile({ ...profile, smsAlerts: e.target.checked })}
                          className="toggle-switch-input" 
                        />
                      </div>

                      <div className="form-toggle-row">
                        <div>
                          <span style={{ fontSize: '13px', fontWeight: '600' }}>AI Automated Grading Suggestions</span>
                          <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Pre-fill grading scores based on code compilation drafts</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={profile.autoGrader}
                          onChange={(e) => setProfile({ ...profile, autoGrader: e.target.checked })}
                          className="toggle-switch-input" 
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button type="submit" className="btn-submit-settings">
                        Save Configurations
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
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

export default TeacherDashboard;
