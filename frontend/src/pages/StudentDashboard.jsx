import { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  Video, 
  FileText, 
  Award, 
  ClipboardList, 
  MessageSquare, 
  BarChart2, 
  Bell, 
  Settings, 
  LogOut, 
  Play, 
  Check, 
  Download, 
  Send, 
  Sparkles,
  Menu,
  X,
  Clock,
  TrendingUp,
  BookOpenCheck,
  AlertCircle
} from 'lucide-react';

const StudentDashboard = ({ user, onLogout }) => {
  // Navigation & UI Layout State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Toast helper
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Mock Profile Info
  const [profile, setProfile] = useState({
    name: user?.name || 'Rohan Sharma',
    rollNo: '2026CSE1045',
    email: 'rohan.sharma@vidyastra.ai',
    degree: 'B.Tech Computer Science & Engineering',
    semester: '4th Semester',
    avatarColor: 'from-indigo-500 to-blue-600',
    phone: '+91 98765 43210',
    studyGoal: 'Full-Stack Developer & AI Enthusiast',
    studyTime: 'Night Owl (8 PM - 12 AM)',
    emailAlerts: true,
    smsAlerts: false,
    darkModeMock: false
  });

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Assignment 4: SQL Practice Set is now open.", time: "10 mins ago", read: false },
    { id: 2, text: "Dr. Sarah Verma scheduled an extra session for DSA tomorrow.", time: "2 hrs ago", read: false },
    { id: 3, text: "Your OS: Custom Shell Scripting assignment has been submitted.", time: "1 day ago", read: true },
    { id: 4, text: "New lecture added: OSI Layer Protocols.", time: "2 days ago", read: true },
    { id: 5, text: "AI generated a new study summary for DBMS Normalization.", time: "3 days ago", read: true }
  ]);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const markAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    triggerToast("All notifications marked as read!");
  };

  // Lecture Library State
  const [lectures, setLectures] = useState([
    { id: 1, topic: 'Introduction to React Hooks', subject: 'DSA', duration: '45 mins', date: '2026-06-08', watched: true },
    { id: 2, topic: 'Arrays and Linked Lists', subject: 'DSA', duration: '52 mins', date: '2026-06-09', watched: true },
    { id: 3, topic: 'Binary Search Trees & Operations', subject: 'DSA', duration: '58 mins', date: '2026-06-11', watched: true },
    { id: 4, topic: 'Graph Traversals (BFS & DFS)', subject: 'DSA', duration: '50 mins', date: '2026-06-14', watched: false },
    { id: 5, topic: 'Introduction to DBMS & Architecture', subject: 'DBMS', duration: '40 mins', date: '2026-06-05', watched: true },
    { id: 6, topic: 'Entity-Relationship Models', subject: 'DBMS', duration: '55 mins', date: '2026-06-07', watched: true },
    { id: 7, topic: 'Relational Algebra Concepts', subject: 'DBMS', duration: '48 mins', date: '2026-06-10', watched: true },
    { id: 8, topic: 'SQL Joins and Subqueries', subject: 'DBMS', duration: '60 mins', date: '2026-06-13', watched: false },
    { id: 9, topic: 'Processes, Threads & Concurrency', subject: 'OS', duration: '51 mins', date: '2026-06-04', watched: true },
    { id: 10, topic: 'CPU Scheduling Algorithms', subject: 'OS', duration: '59 mins', date: '2026-06-12', watched: false },
    { id: 11, topic: 'Introduction to Computer Networks', subject: 'CN', duration: '42 mins', date: '2026-06-03', watched: true },
    { id: 12, topic: 'OSI & TCP/IP Layer Models', subject: 'CN', duration: '56 mins', date: '2026-06-12', watched: false }
  ]);

  const [lectureSearch, setLectureSearch] = useState('');
  const [lectureFilter, setLectureFilter] = useState('All');

  const toggleLectureWatched = (id) => {
    setLectures(prev => prev.map(l => {
      if (l.id === id) {
        const nextState = !l.watched;
        triggerToast(`Marked "${l.topic}" as ${nextState ? 'Watched' : 'Unwatched'}`);
        return { ...l, watched: nextState };
      }
      return l;
    }));
  };

  // Compute stats in real-time
  const watchedLecturesCount = lectures.filter(l => l.watched).length;
  const lectureProgressPercent = Math.round((watchedLecturesCount / lectures.length) * 100);

  // My Courses state & data
  const [courses] = useState([
    { code: 'CS201', name: 'Data Structures & Algorithms', progress: 75, instructor: 'Dr. Sarah Verma', bgGradient: 'from-blue-500 to-indigo-600', codeColor: 'text-indigo-600', category: 'DSA' },
    { code: 'CS202', name: 'Database Management Systems', progress: 60, instructor: 'Dr. Sarah Verma', bgGradient: 'from-purple-500 to-pink-600', codeColor: 'text-purple-600', category: 'DBMS' },
    { code: 'CS203', name: 'Operating Systems', progress: 40, instructor: 'Dr. Amit Singh', bgGradient: 'from-amber-500 to-orange-600', codeColor: 'text-amber-600', category: 'OS' },
    { code: 'CS204', name: 'Computer Networks', progress: 20, instructor: 'Dr. Neha Gupta', bgGradient: 'from-emerald-500 to-teal-600', codeColor: 'text-emerald-600', category: 'CN' }
  ]);

  // AI Notes State
  const [notes] = useState([
    { id: 1, title: 'Binary Tree Traversals Guide', subject: 'DSA', date: '2026-06-12', tags: ['#trees', '#dfs-bfs'], summary: 'Covers Inorder, Preorder, and Postorder recursive algorithms. Includes iterative stack-based DFS and queue-based BFS queue implementations. Highly critical for coding interviews.' },
    { id: 2, title: 'Normalization & Normal Forms Cheat Sheet', subject: 'DBMS', date: '2026-06-10', tags: ['#normalization', '#sql'], summary: 'Step-by-step resolution from 1NF, 2NF, 3NF, up to BCNF. Explains dependencies, prime attributes, and lossless decompositions.' },
    { id: 3, title: 'CPU Scheduling Algorithms Overview', subject: 'OS', date: '2026-06-08', tags: ['#scheduling', '#cpu'], summary: 'Comparative analysis of FCFS, SJF, SRTF, Round Robin, and Priority Scheduling. Formulates Gantt chart drawing and turnaround/waiting time computation.' },
    { id: 4, title: 'Subnetting & IP Addressing Guide', subject: 'CN', date: '2026-06-05', tags: ['#ip-addressing', '#subnets'], summary: 'Visual guide to IPv4 network masking, CIDR notation class subdivisions, and calculating hosting subnet ranges. Demystifies variable-length subnet masking (VLSM).' }
  ]);

  const [expandedNoteId, setExpandedNoteId] = useState(null);

  const handleDownloadNote = (title) => {
    triggerToast(`Initializing AI packaging...`);
    setTimeout(() => {
      // Mock note file download
      const textContent = `# Study Guide: ${title}\n\nGenerated by Vidyastra AI\nDate: ${new Date().toLocaleDateString()}\n\nKey Concepts:\n1. Core Definitions\n2. Implementation Details\n3. Examples & Practice Tasks\n\nStudy hard!`;
      const blob = new Blob([textContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_notes.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      triggerToast(`Successfully downloaded notes!`);
    }, 1200);
  };

  // AI Quiz State
  const [practiceQuizzes] = useState([
    { id: 1, title: 'DBMS Normalization Practice', subject: 'DBMS', questions: 10, difficulty: 'Medium', taken: false },
    { id: 2, title: 'Binary Search Trees & AVL Trees', subject: 'DSA', questions: 10, difficulty: 'Medium', taken: true, prevScore: '80%' },
    { id: 3, title: 'OS Process Synchronization & Semaphores', subject: 'OS', questions: 10, difficulty: 'Hard', taken: false }
  ]);

  const [quizScorePoints, setQuizScorePoints] = useState(240);
  const [aiQuizActive, setAiQuizActive] = useState(false);
  const [quizTopic, setQuizTopic] = useState('DSA');
  const [quizDifficulty, setQuizDifficulty] = useState('Medium');
  const [quizGenerating, setQuizGenerating] = useState(false);

  // Simulated AI Quiz Questions Database
  const mockQuizQuestionsDB = {
    DSA: [
      {
        question: "What is the time complexity of searching in a balanced AVL tree in the worst case?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
        correct: 2,
        explanation: "Since an AVL tree is strictly balanced (the difference in heights of left and right subtrees is at most 1), the height of the tree is bounded by O(log n), ensuring lookup is O(log n)."
      },
      {
        question: "Which data structure is primarily used to implement Breadth-First Search (BFS)?",
        options: ["Stack", "Queue", "Priority Queue", "Heap"],
        correct: 1,
        explanation: "BFS explores vertices level-by-level. A FIFO Queue is ideal for keeping track of the nodes to visit next in order."
      },
      {
        question: "What is the space complexity of quicksort in the worst case (assuming recursive stack space)?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
        correct: 2,
        explanation: "In the worst case, the partition pivot is always the smallest or largest element, leading to n recursive calls and hence O(n) space complexity on the stack."
      }
    ],
    DBMS: [
      {
        question: "Which normal form requires resolving partial functional dependencies?",
        options: ["1NF", "2NF", "3NF", "BCNF"],
        correct: 1,
        explanation: "Second Normal Form (2NF) requires that the table is in 1NF and no non-prime attribute is functionally dependent on any proper subset of any candidate key (partial dependency)."
      },
      {
        question: "What does the 'A' stand for in ACID properties of transaction management?",
        options: ["Availability", "Atomicity", "Association", "Agreement"],
        correct: 1,
        explanation: "Atomicity ensures that all operations within a transaction are completed successfully; otherwise, the transaction is completely aborted."
      },
      {
        question: "Which join returns all rows from the left table, and matching rows from the right table?",
        options: ["Inner Join", "Full Join", "Left Outer Join", "Right Outer Join"],
        correct: 2,
        explanation: "Left Outer Join returns all rows from the left table, with nulls filled in for columns of the right table where no match exists."
      }
    ],
    OS: [
      {
        question: "What is the primary purpose of a Semaphore in Operating Systems?",
        options: ["Memory paging", "Process scheduling", "Process synchronization & mutual exclusion", "Disk partition mapping"],
        correct: 2,
        explanation: "Semaphores are integer variables used as synchronization tools to control access to shared resources in concurrent computing environments."
      },
      {
        question: "Which CPU scheduling algorithm can lead to starvation?",
        options: ["Round Robin", "First-Come First-Served", "Shortest Job First (SJF)", "None of the above"],
        correct: 2,
        explanation: "SJF can starve longer processes if shorter processes continually arrive, as it always prioritizes the shortest execution time."
      },
      {
        question: "What condition is NOT required for a deadlock to occur?",
        options: ["Mutual Exclusion", "No Preemption", "Hold and Wait", "Preemption of resources"],
        correct: 3,
        explanation: "The four Coffman conditions are Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait. Preemption breaks deadlocks."
      }
    ],
    CN: [
      {
        question: "Which layer of the OSI model handles packet routing and logical IP addressing?",
        options: ["Physical Layer", "Data Link Layer", "Network Layer", "Transport Layer"],
        correct: 2,
        explanation: "The Network Layer is responsible for packet forwarding, routing, and logical network addressing (IPv4/IPv6)."
      },
      {
        question: "What is the standard port number for HTTPS traffic?",
        options: ["80", "443", "8080", "22"],
        correct: 1,
        explanation: "Port 443 is the standard port used for secure HTTP (HTTPS) communication."
      },
      {
        question: "Which routing protocol uses the link-state routing algorithm?",
        options: ["RIP", "OSPF", "BGP", "EIGRP"],
        correct: 1,
        explanation: "OSPF (Open Shortest Path First) is a Link-State routing protocol, whereas RIP is distance-vector."
      }
    ]
  };

  const [activeQuizQuestions, setActiveQuizQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const startAiQuizGeneration = () => {
    setQuizGenerating(true);
    setTimeout(() => {
      const db = mockQuizQuestionsDB[quizTopic] || mockQuizQuestionsDB['DSA'];
      setActiveQuizQuestions(db);
      setSelectedAnswers({});
      setQuizSubmitted(false);
      setQuizScore(0);
      setQuizGenerating(false);
      setAiQuizActive(true);
      triggerToast(`AI generated a customized ${quizDifficulty} quiz on ${quizTopic}! ✦`);
    }, 1500);
  };

  const selectAnswer = (questionIndex, optionIndex) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(selectedAnswers).length < activeQuizQuestions.length) {
      alert("Please answer all questions before submitting!");
      return;
    }
    let correctCount = 0;
    activeQuizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        correctCount++;
      }
    });
    const pointsGained = correctCount * 20;
    setQuizScore(correctCount);
    setQuizScorePoints(prev => prev + pointsGained);
    setQuizSubmitted(true);
    triggerToast(`Quiz Submitted! Correct answers: ${correctCount}/${activeQuizQuestions.length}. Gained ${pointsGained} pts! 🎉`);
  };

  // Assignments State
  const [assignments, setAssignments] = useState([
    { id: 1, title: 'Red-Black Trees Implementation', subject: 'DSA', dueDate: '2026-06-18', points: 100, status: 'Pending' },
    { id: 2, title: 'SQL Practice Set - Joins & Indexes', subject: 'DBMS', dueDate: '2026-06-20', points: 50, status: 'Pending' },
    { id: 3, title: 'Custom Shell Scripting & Pointers', subject: 'OS', dueDate: '2026-06-14', points: 80, status: 'Submitted' },
    { id: 4, title: 'IP Addressing Class Subnetting', subject: 'CN', dueDate: '2026-06-11', points: 60, status: 'Graded', grade: 'A (55/60)' }
  ]);

  const [activeAssignmentSubmit, setActiveAssignmentSubmit] = useState(null);
  const [submissionText, setSubmissionText] = useState('');

  const submitAssignmentAction = () => {
    if (!submissionText.trim()) {
      alert("Please write or paste your assignment solution before submitting!");
      return;
    }
    setAssignments(prev => prev.map(a => {
      if (a.id === activeAssignmentSubmit.id) {
        return { ...a, status: 'Submitted' };
      }
      return a;
    }));
    triggerToast(`Assignment "${activeAssignmentSubmit.title}" submitted successfully! 🚀`);
    setActiveAssignmentSubmit(null);
    setSubmissionText('');
  };

  // AI Tutor State & Ref
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: "Hello Rohan! I am your Vidyastra AI Tutor. ✦\nI see you're working through computer architecture and algorithm complexity today. Let's study the complexity of **Binary Search**. Do you have any questions on how it operates, why it is efficient, or its best/worst-case parameters?", time: "11:30 AM" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const chatBottomRef = useRef(null);

  const tutorSuggestions = [
    { label: "Why is Binary Search O(log n)?", response: "Binary Search operates using a **divide-and-conquer** approach. At each step, it compares the target with the middle element and discards exactly half of the search range. \n\nMathematically, the range size shrinks as: \n$N \\rightarrow N/2 \\rightarrow N/4 \\rightarrow \\dots \\rightarrow 1$. \n\nThis division takes $k$ steps where $N / 2^k = 1$, which solves to $k = \\log_2 N$. Hence, the time complexity is logarithmic: **O(log n)**!" },
    { label: "Can it work on unsorted arrays?", response: "No, Binary Search **strictly requires a sorted array**. \n\nThe sorting order is what allows the algorithm to deterministically decide whether the target is in the left half or right half of the range. If the array is unsorted, there is no guarantee that elements to the left are smaller or elements to the right are larger, making the division step impossible." },
    { label: "What is its space complexity?", response: "It depends on whether you implement it iteratively or recursively:\n\n1. **Iterative Implementation**: Space complexity is **O(1)**. It only uses a few pointers (`low`, `high`, `mid`) to search the array without using extra stack allocations.\n2. **Recursive Implementation**: Space complexity is **O(log n)**. Each recursive call consumes space on the call stack. Since the depth of recursion is bounded by $\\log n$, it uses O(log n) stack frames." },
    { label: "Show JavaScript code for it", response: "Here is a clean, iterative implementation of Binary Search in JavaScript:\n\n```javascript\nfunction binarySearch(arr, target) {\n  let low = 0;\n  let high = arr.length - 1;\n\n  while (low <= high) {\n    let mid = Math.floor((low + high) / 2);\n\n    if (arr[mid] === target) {\n      return mid; // Target found, return index\n    } else if (arr[mid] < target) {\n      low = mid + 1; // Discard left half\n    } else {\n      high = mid - 1; // Discard right half\n    }\n  }\n  return -1; // Target not found\n}\n```" }
  ];

  const scrollChatToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollChatToBottom();
  }, [chatMessages, aiTyping]);

  const handleSendChatMessage = (textToSend) => {
    if (!textToSend.trim()) return;

    // Add user message
    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user', text: textToSend, time: formattedTime };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Trigger typing state
    setAiTyping(true);

    setTimeout(() => {
      // Find matches in suggestions or use generic reply
      const matchedSuggestion = tutorSuggestions.find(s => s.label === textToSend);
      let replyText = "";

      if (matchedSuggestion) {
        replyText = matchedSuggestion.response;
      } else {
        replyText = `That's an interesting question about "${textToSend}"! Under standard Binary Search parameters, let me explain. Always remember that Binary Search is highly optimized for fast lookups. Do you have any questions on how it compares to Linear Search O(n) or how we can implement it recursively?`;
      }

      setChatMessages(prev => [...prev, {
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setAiTyping(false);
    }, 1200);
  };

  // Settings Save Handler
  const handleSaveSettings = (e) => {
    e.preventDefault();
    triggerToast("Updating profile & settings...");
    setTimeout(() => {
      triggerToast("Settings saved successfully!", 'success');
    }, 1000);
  };

  return (
    <div className="vidyastra-container">
      {/* Global CSS Embedded Styles */}
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

        /* Interactive join button */
        .btn-join-class {
          background: linear-gradient(135deg, var(--primary) 0%, #6366F1 100%);
          color: white;
          border: none;
          padding: 6px 14px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          transition: opacity var(--transition-fast);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-join-class:hover {
          opacity: 0.9;
        }

        .btn-upcoming {
          background-color: #F1F5F9;
          color: #64748B;
          border: 1px solid #E2E8F0;
          padding: 6px 14px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 12px;
          cursor: not-allowed;
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

        .badge-status.pending {
          background-color: #FEF3C7;
          color: #D97706;
        }

        .badge-status.submitted {
          background-color: #DBEAFE;
          color: #2563EB;
        }

        .badge-status.graded {
          background-color: #D1FAE5;
          color: #059669;
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

        /* AI Glowing Button */
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

        /* Typing indicator */
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

        /* Accordion for notes summary */
        .note-summary-expandable {
          background-color: #F8FAFC;
          border-top: 1px solid var(--border);
          padding: 16px;
          font-size: 13px;
          color: var(--text-muted);
          animation: slideDownCustom 0.25s ease-out forwards;
        }

        @keyframes slideDownCustom {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .btn-watch-toggle {
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn-watch-toggle.watched {
          color: var(--success);
          background-color: #ECFDF5;
        }

        .btn-watch-toggle.unwatched {
          color: var(--text-muted);
          background-color: #F1F5F9;
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

          <button className={`menu-item ${activeTab === 'lectures' ? 'active' : ''}`} onClick={() => { setActiveTab('lectures'); setSidebarOpen(false); }}>
            <Video className="h-4 w-4" />
            <span>Lecture Library</span>
          </button>

          <button className={`menu-item ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => { setActiveTab('notes'); setSidebarOpen(false); }}>
            <FileText className="h-4 w-4" />
            <span>AI Notes</span>
          </button>

          <button className={`menu-item ${activeTab === 'quiz' ? 'active' : ''}`} onClick={() => { setActiveTab('quiz'); setSidebarOpen(false); }}>
            <Award className="h-4 w-4" />
            <span>AI Quiz</span>
          </button>

          <button className={`menu-item ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => { setActiveTab('assignments'); setSidebarOpen(false); }}>
            <ClipboardList className="h-4 w-4" />
            <span>Assignments</span>
          </button>

          <button className={`menu-item ${activeTab === 'tutor' ? 'active' : ''}`} onClick={() => { setActiveTab('tutor'); setSidebarOpen(false); }}>
            <MessageSquare className="h-4 w-4" />
            <span>AI Tutor</span>
          </button>

          <button className={`menu-item ${activeTab === 'progress' ? 'active' : ''}`} onClick={() => { setActiveTab('progress'); setSidebarOpen(false); }}>
            <BarChart2 className="h-4 w-4" />
            <span>Progress & Analytics</span>
          </button>

          <button className={`menu-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => { setActiveTab('notifications'); setSidebarOpen(false); }}>
            <Bell className="h-4 w-4" />
            <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <span>Notifications</span>
              {unreadNotificationsCount > 0 && (
                <span style={{ backgroundColor: '#EF4444', color: 'white', fontSize: '10px', padding: '1px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                  {unreadNotificationsCount}
                </span>
              )}
            </span>
          </button>

          <button className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}>
            <Settings className="h-4 w-4" />
            <span>Profile & Settings</span>
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
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'courses' && 'My Enrolled Courses'}
              {activeTab === 'lectures' && 'Vidyastra Video Archive'}
              {activeTab === 'notes' && 'AI Classroom Summaries'}
              {activeTab === 'quiz' && 'Interactive Assessment Hub'}
              {activeTab === 'assignments' && 'Curriculum Tasks'}
              {activeTab === 'tutor' && 'Vidyastra AI Smart Tutor'}
              {activeTab === 'progress' && 'Academic Performance Engine'}
              {activeTab === 'notifications' && 'System Notifications'}
              {activeTab === 'settings' && 'User Settings Manager'}
            </h1>
          </div>

          <div className="header-actions">
            {/* Notification Bell Shortcut */}
            <button className="bell-trigger" onClick={() => setActiveTab('notifications')}>
              <Bell className="h-5 w-5" />
              {unreadNotificationsCount > 0 && (
                <span className="bell-badge">{unreadNotificationsCount}</span>
              )}
            </button>

            {/* Profile Summary Card */}
            <div className="user-avatar-profile" onClick={() => setActiveTab('settings')}>
              <div className="avatar-circle-sm">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="user-meta-header" style={{ display: 'none', md: 'flex' }}>
                <span className="user-name-txt">{profile.name}</span>
                <span className="user-role-txt">{profile.degree}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Workspace Content Scrollable Area */}
        <div className="workspace-content">
          {/* Sub-view switcher logic */}

          {/* 1. DASHBOARD OVERVIEW VIEW */}
          {activeTab === 'dashboard' && (
            <div className="view-fade-in">
              {/* Premium Welcome Banner */}
              <div className="gradient-banner">
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px', fontFamily: 'var(--heading-font)' }}>
                    Welcome back, {profile.name}! 👋
                  </h2>
                  <p style={{ color: '#E0E7FF', fontSize: '14px', maxWidth: '480px' }}>
                    You have watched {watchedLecturesCount} of {lectures.length} total lectures this semester. Complete your next quiz to maintain your streak!
                  </p>
                </div>
                <GraduationCap className="gradient-banner-bg-sparks" />
              </div>

              {/* Metric Cards Grid */}
              <div className="metrics-grid">
                <div className="metric-card-styled">
                  <div className="metric-icon-box" style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)' }}>
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="metric-value">{courses.length}</div>
                    <div className="metric-label">Subjects Enrolled</div>
                  </div>
                </div>

                <div className="metric-card-styled">
                  <div className="metric-icon-box" style={{ backgroundColor: '#ECFDF5', color: '#10B981' }}>
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="metric-value">92%</div>
                    <div className="metric-label">Average Attendance</div>
                  </div>
                </div>

                <div className="metric-card-styled">
                  <div className="metric-icon-box" style={{ backgroundColor: '#FAF5FF', color: '#8B5CF6' }}>
                    <Video className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="metric-value">{lectureProgressPercent}%</div>
                    <div className="metric-label">Lecture Progress</div>
                  </div>
                </div>

                <div className="metric-card-styled">
                  <div className="metric-icon-box" style={{ backgroundColor: '#FFF7ED', color: '#F59E0B' }}>
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="metric-value">{quizScorePoints} pts</div>
                    <div className="metric-label">AI Quiz Score</div>
                  </div>
                </div>
              </div>

              {/* Two Column Grid */}
              <div className="dashboard-main-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Upcoming Classes */}
                  <div className="gorgeous-card">
                    <h3 className="section-header-title">
                      <Clock className="h-4 w-4 text-indigo-500" /> Upcoming Classes
                    </h3>
                    <div className="fancy-table-container">
                      <table className="fancy-table">
                        <thead>
                          <tr>
                            <th>Class/Subject</th>
                            <th>Time slot</th>
                            <th>Instructor & Location</th>
                            <th>Status / Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <span style={{ fontWeight: '700', color: '#1E293B' }}>Data Structures & Algorithms</span>
                              <span style={{ fontSize: '11px', display: 'block', color: 'var(--text-muted)' }}>CS201 • Theory</span>
                            </td>
                            <td>09:00 AM - 10:00 AM</td>
                            <td>Dr. Sarah Verma (Room LHC-102)</td>
                            <td>
                              <button className="btn-join-class" onClick={() => triggerToast("Launching virtual classroom space... Enjoy your lecture!", "success")}>
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                Join Live
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span style={{ fontWeight: '700', color: '#1E293B' }}>Database Management Systems</span>
                              <span style={{ fontSize: '11px', display: 'block', color: 'var(--text-muted)' }}>CS202 • Lab Session</span>
                            </td>
                            <td>10:15 AM - 11:15 AM</td>
                            <td>Dr. Sarah Verma (Room LHC-204)</td>
                            <td>
                              <button className="btn-join-class" onClick={() => triggerToast("Initializing secure compiler stream... Enjoy your lab!", "success")}>
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                Join Lab
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span style={{ fontWeight: '700', color: '#1E293B' }}>Operating Systems</span>
                              <span style={{ fontSize: '11px', display: 'block', color: 'var(--text-muted)' }}>CS203 • Lecture</span>
                            </td>
                            <td>11:30 AM - 12:30 PM</td>
                            <td>Dr. Amit Singh (Room LHC-101)</td>
                            <td>
                              <span className="btn-upcoming">Scheduled</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="gorgeous-card">
                    <h3 className="section-header-title">
                      <TrendingUp className="h-4 w-4 text-emerald-500" /> Recent Activity
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <span style={{ fontWeight: '600', fontSize: '13px' }}>Downloaded study notes</span>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Binary Tree Traversals Guide.md</p>
                          </div>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>2 hrs ago</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                            <ClipboardList className="h-4 w-4" />
                          </div>
                          <div>
                            <span style={{ fontWeight: '600', fontSize: '13px' }}>Submitted task assignment</span>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Custom Shell Scripting & Pointers</p>
                          </div>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>1 day ago</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
                            <Award className="h-4 w-4" />
                          </div>
                          <div>
                            <span style={{ fontWeight: '600', fontSize: '13px' }}>Completed assessment test</span>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Binary Search Trees AVL Quiz (Score: 80%)</p>
                          </div>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>2 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: AI recommendations */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="gorgeous-card" style={{ border: '1px dashed #A5B4FC', background: '#F5F3FF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#6D28D9' }}>
                      <Sparkles className="h-5 w-5 animate-pulse" />
                      <h3 style={{ margin: 0, fontWeight: '700', fontSize: '15px', fontFamily: 'var(--heading-font)' }}>AI Learning Advisor</h3>
                    </div>
                    <p style={{ fontSize: '13px', color: '#5B21B6', lineHeight: '1.5', marginBottom: '16px' }}>
                      I've analyzed your academic footprint, quiz responses, and video lecture progress. Here are my tailored suggestions:
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ backgroundColor: 'white', padding: '14px', borderRadius: '8px', border: '1px solid #E9D5FF' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#7C3AED', textTransform: 'uppercase' }}>DSA Recommendation</span>
                        <p style={{ fontSize: '12px', color: 'var(--text)', margin: '4px 0 10px 0', fontWeight: '500' }}>
                          Let's practice **Binary Search** details with the interactive chatbot to cement your worst-case runtime concepts.
                        </p>
                        <button onClick={() => setActiveTab('tutor')} style={{ backgroundColor: '#F5F3FF', border: '1px solid #C084FC', color: '#7C3AED', fontSize: '11px', fontWeight: '700', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                          Launch AI Tutor →
                        </button>
                      </div>

                      <div style={{ backgroundColor: 'white', padding: '14px', borderRadius: '8px', border: '1px solid #E9D5FF' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#7C3AED', textTransform: 'uppercase' }}>DBMS Recommendation</span>
                        <p style={{ fontSize: '12px', color: 'var(--text)', margin: '4px 0 10px 0', fontWeight: '500' }}>
                          Your lecture *SQL Joins and Subqueries* is currently unwatched. Complete it before the SQL assignment deadline.
                        </p>
                        <button onClick={() => setActiveTab('lectures')} style={{ backgroundColor: '#F5F3FF', border: '1px solid #C084FC', color: '#7C3AED', fontSize: '11px', fontWeight: '700', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                          Go to Lectures →
                        </button>
                      </div>

                      <div style={{ backgroundColor: 'white', padding: '14px', borderRadius: '8px', border: '1px solid #E9D5FF' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#7C3AED', textTransform: 'uppercase' }}>Interactive Practice</span>
                        <p style={{ fontSize: '12px', color: 'var(--text)', margin: '4px 0 10px 0', fontWeight: '500' }}>
                          Want a custom 3-question diagnostic test? Generate a quiz based on DBMS schemas or tree nodes.
                        </p>
                        <button onClick={() => setActiveTab('quiz')} style={{ backgroundColor: '#7C3AED', border: 'none', color: 'white', fontSize: '11px', fontWeight: '700', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                          Generate AI Quiz ✦
                        </button>
                      </div>
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
                      <span className="text-white text-xs font-bold bg-white/20 px-2.5 py-1 rounded" style={{ display: 'inline-block', marginBottom: '8px' }}>
                        {course.code}
                      </span>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>{course.name}</h3>
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginTop: '6px' }}>Instructor: {course.instructor}</p>
                    </div>

                    <div className="course-fancy-body">
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Syllabus Covered</span>
                          <span style={{ color: 'var(--text)' }}>{course.progress}%</span>
                        </div>
                        <div className="fancy-progress-bar-container">
                          <div 
                            className="fancy-progress-bar-fill" 
                            style={{ 
                              width: `${course.progress}%`,
                              backgroundColor: course.code === 'CS201' ? '#4F46E5' : course.code === 'CS202' ? '#A855F7' : course.code === 'CS203' ? '#F59E0B' : '#10B981'
                            }} 
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <button 
                          onClick={() => {
                            setLectureFilter(course.category);
                            setActiveTab('lectures');
                            triggerToast(`Displaying lectures for ${course.name}`);
                          }}
                          style={{ flex: 1, backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', padding: '8px', fontSize: '12px', fontWeight: '600', borderRadius: '6px', cursor: 'pointer', color: 'var(--text)' }}
                        >
                          Lectures
                        </button>
                        <button 
                          onClick={() => {
                            setQuizTopic(course.category);
                            setActiveTab('quiz');
                            triggerToast(`Preparing quiz workspace for ${course.name}`);
                          }}
                          style={{ flex: 1, backgroundColor: '#4F46E5', border: 'none', color: 'white', padding: '8px', fontSize: '12px', fontWeight: '600', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          Practice Test
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. LECTURE LIBRARY VIEW */}
          {activeTab === 'lectures' && (
            <div className="view-fade-in">
              {/* Filter and Search Bar Row */}
              <div className="gorgeous-card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
                  {/* Category Filter Pills */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {['All', 'DSA', 'DBMS', 'OS', 'CN'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setLectureFilter(cat)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '600',
                          border: 'none',
                          cursor: 'pointer',
                          backgroundColor: lectureFilter === cat ? 'var(--primary)' : '#EEF2FF',
                          color: lectureFilter === cat ? 'white' : 'var(--primary)',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Search input field */}
                  <input
                    type="text"
                    placeholder="Search lecture topic..."
                    value={lectureSearch}
                    onChange={(e) => setLectureSearch(e.target.value)}
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

              {/* Lecture Archive Listing Table */}
              <div className="gorgeous-card">
                <div className="fancy-table-container">
                  <table className="fancy-table">
                    <thead>
                      <tr>
                        <th>Watch Status</th>
                        <th>Lecture Topic</th>
                        <th>Course</th>
                        <th>Duration</th>
                        <th>Uploaded Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lectures
                        .filter(l => lectureFilter === 'All' || l.subject === lectureFilter)
                        .filter(l => l.topic.toLowerCase().includes(lectureSearch.toLowerCase()))
                        .map((lecture) => (
                          <tr key={lecture.id}>
                            <td>
                              <button 
                                className={`btn-watch-toggle ${lecture.watched ? 'watched' : 'unwatched'}`}
                                onClick={() => toggleLectureWatched(lecture.id)}
                                title={lecture.watched ? 'Mark as Not Watched' : 'Mark as Watched'}
                              >
                                {lecture.watched ? <Check className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                              </button>
                            </td>
                            <td>
                              <span style={{ fontWeight: '600', color: lecture.watched ? 'var(--text-muted)' : 'var(--text)' }}>
                                {lecture.topic}
                              </span>
                            </td>
                            <td>
                              <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: 'var(--primary)' }}>
                                {lecture.subject}
                              </span>
                            </td>
                            <td>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                <Clock className="h-3.5 w-3.5" /> {lecture.duration}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{lecture.date}</span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 4. AI NOTES VIEW */}
          {activeTab === 'notes' && (
            <div className="view-fade-in">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {notes.map((note) => (
                  <div key={note.id} className="gorgeous-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)', fontWeight: '700', fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>
                            {note.subject}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Generated: {note.date}</span>
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '8px 0 6px 0', color: 'var(--text)' }}>
                          {note.title}
                        </h3>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {note.tags.map(t => (
                            <span key={t} style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{t}</span>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setExpandedNoteId(expandedNoteId === note.id ? null : note.id)}
                          style={{ backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', color: 'var(--text)' }}
                        >
                          {expandedNoteId === note.id ? 'Hide Summary' : 'View AI Summary ✦'}
                        </button>
                        <button
                          onClick={() => handleDownloadNote(note.title)}
                          className="btn-join-class"
                          style={{ padding: '8px 14px' }}
                        >
                          <Download className="h-4 w-4" /> Download PDF
                        </button>
                      </div>
                    </div>

                    {expandedNoteId === note.id && (
                      <div className="note-summary-expandable">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: '700', fontSize: '12px', marginBottom: '8px' }}>
                          <Sparkles className="h-4 w-4" /> AI Generated Summary
                        </div>
                        <p style={{ margin: 0, lineHeight: '1.6' }}>{note.summary}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. AI QUIZ VIEW */}
          {activeTab === 'quiz' && (
            <div className="view-fade-in">
              {/* Highlight AI Generator Button */}
              <div className="gradient-banner" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #C084FC 100%)', padding: '28px 32px' }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px', fontFamily: 'var(--heading-font)' }}>
                    Generate Quiz with AI ✦
                  </h2>
                  <p style={{ color: '#F3E8FF', fontSize: '14px', maxWidth: '520px', marginBottom: '16px' }}>
                    Generate standard 3-question assessment test sets customized to your syllabus target and track your performance points.
                  </p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: '700', color: '#D8B4FE', textTransform: 'uppercase' }}>Select Syllabus Topic</label>
                      <select 
                        value={quizTopic} 
                        onChange={(e) => setQuizTopic(e.target.value)}
                        style={{ height: '36px', borderRadius: '6px', border: 'none', padding: '0 8px', fontSize: '12px', outline: 'none', minWidth: '150px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: '600' }}
                      >
                        <option value="DSA" style={{ color: '#000' }}>Data Structures (DSA)</option>
                        <option value="DBMS" style={{ color: '#000' }}>Database Systems (DBMS)</option>
                        <option value="OS" style={{ color: '#000' }}>Operating Systems (OS)</option>
                        <option value="CN" style={{ color: '#000' }}>Computer Networks (CN)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: '700', color: '#D8B4FE', textTransform: 'uppercase' }}>Select Difficulty</label>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {['Easy', 'Medium', 'Hard'].map((diff) => (
                          <button
                            key={diff}
                            onClick={() => setQuizDifficulty(diff)}
                            style={{
                              height: '36px',
                              padding: '0 12px',
                              borderRadius: '6px',
                              border: 'none',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              backgroundColor: quizDifficulty === diff ? 'white' : 'rgba(255,255,255,0.15)',
                              color: quizDifficulty === diff ? 'var(--primary)' : 'white',
                              transition: 'all var(--transition-fast)'
                            }}
                          >
                            {diff}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={startAiQuizGeneration}
                      disabled={quizGenerating}
                      className="btn-ai-spark"
                      style={{ alignSelf: 'flex-end', height: '36px', boxShadow: 'none', background: '#FFFFFF', color: '#7C3AED' }}
                    >
                      {quizGenerating ? 'Generating Quiz...' : 'Generate Quiz ✦'}
                    </button>
                  </div>
                </div>
                <Sparkles className="gradient-banner-bg-sparks" style={{ color: '#C084FC', opacity: 0.25 }} />
              </div>

              {/* Interactive AI Quiz Session Container */}
              {aiQuizActive && (
                <div className="gorgeous-card" style={{ marginBottom: '24px', border: '2px solid #C084FC' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      <h3 style={{ margin: 0, fontWeight: '700', fontSize: '16px' }}>Live AI Generated Practice: {quizTopic} ({quizDifficulty})</h3>
                    </div>
                    <button 
                      onClick={() => setAiQuizActive(false)}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {activeQuizQuestions.map((q, qIdx) => (
                      <div key={qIdx} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <h4 style={{ margin: 0, fontWeight: '600', fontSize: '14px', display: 'flex', gap: '8px' }}>
                          <span style={{ color: 'var(--primary)' }}>Q{qIdx + 1}.</span> {q.question}
                        </h4>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          {q.options.map((option, oIdx) => {
                            const isSelected = selectedAnswers[qIdx] === oIdx;
                            const isCorrect = q.correct === oIdx;
                            let btnStyle = {
                              padding: '10px 14px',
                              borderRadius: '8px',
                              border: '1px solid var(--border)',
                              backgroundColor: 'white',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: '500',
                              transition: 'all 0.15s'
                            };

                            if (isSelected && !quizSubmitted) {
                              btnStyle.backgroundColor = '#EEF2FF';
                              btnStyle.borderColor = 'var(--primary)';
                              btnStyle.color = 'var(--primary)';
                            }

                            if (quizSubmitted) {
                              btnStyle.cursor = 'default';
                              if (isCorrect) {
                                btnStyle.backgroundColor = '#D1FAE5';
                                btnStyle.borderColor = '#10B981';
                                btnStyle.color = '#065F46';
                              } else if (isSelected) {
                                btnStyle.backgroundColor = '#FEE2E2';
                                btnStyle.borderColor = '#EF4444';
                                btnStyle.color = '#991B1B';
                              }
                            }

                            return (
                              <button 
                                key={oIdx} 
                                style={btnStyle}
                                onClick={() => selectAnswer(qIdx, oIdx)}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div style={{ backgroundColor: '#F8FAFC', padding: '10px 14px', borderRadius: '6px', borderLeft: '3px solid #6B7280', fontSize: '12px', marginTop: '4px', lineHeight: 1.5 }}>
                            <strong>AI Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}

                    <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '16px', gap: '12px' }}>
                      {quizSubmitted ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '700' }}>
                            Final Score: {quizScore} / {activeQuizQuestions.length} Correct
                          </span>
                          <button 
                            className="btn-join-class"
                            onClick={() => {
                              setAiQuizActive(false);
                            }}
                          >
                            Finish
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="btn-join-class" 
                          onClick={handleSubmitQuiz}
                          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)' }}
                        >
                          Submit Quiz Answers
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Standard practice quizzes listing */}
              <div className="gorgeous-card">
                <h3 className="section-header-title">
                  <BookOpenCheck className="h-4 w-4 text-indigo-500" /> Syllabus Practice Tests
                </h3>
                <div className="fancy-table-container">
                  <table className="fancy-table">
                    <thead>
                      <tr>
                        <th>Quiz Name</th>
                        <th>Subject</th>
                        <th>Questions</th>
                        <th>Difficulty</th>
                        <th>Action / Record</th>
                      </tr>
                    </thead>
                    <tbody>
                      {practiceQuizzes.map((quiz) => (
                        <tr key={quiz.id}>
                          <td>
                            <span style={{ fontWeight: '700', color: '#1E293B' }}>{quiz.title}</span>
                          </td>
                          <td>
                            <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: 'var(--primary)' }}>
                              {quiz.subject}
                            </span>
                          </td>
                          <td>{quiz.questions} Qs</td>
                          <td>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: '600',
                              color: quiz.difficulty === 'Easy' ? '#10B981' : quiz.difficulty === 'Medium' ? '#F59E0B' : '#EF4444'
                            }}>
                              {quiz.difficulty}
                            </span>
                          </td>
                          <td>
                            {quiz.taken ? (
                              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                Score: {quiz.prevScore} (Taken)
                              </span>
                            ) : (
                              <button 
                                className="btn-join-class"
                                onClick={() => {
                                  setQuizTopic(quiz.subject);
                                  startAiQuizGeneration();
                                }}
                              >
                                Start Quiz
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 6. ASSIGNMENTS VIEW */}
          {activeTab === 'assignments' && (
            <div className="view-fade-in">
              <div className="gorgeous-card">
                <div className="fancy-table-container">
                  <table className="fancy-table">
                    <thead>
                      <tr>
                        <th>Assignment Name</th>
                        <th>Subject</th>
                        <th>Due Date</th>
                        <th>Points Scale</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map((ass) => (
                        <tr key={ass.id}>
                          <td>
                            <span style={{ fontWeight: '700', color: '#1E293B' }}>{ass.title}</span>
                          </td>
                          <td>
                            <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: 'var(--primary)' }}>
                              {ass.subject}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{ass.dueDate}</span>
                          </td>
                          <td>{ass.points} pts</td>
                          <td>
                            <span className={`badge-status ${ass.status.toLowerCase()}`}>
                              {ass.status === 'Pending' && <Clock className="h-3 w-3" />}
                              {ass.status === 'Submitted' && <Check className="h-3 w-3" />}
                              {ass.status === 'Graded' && <Check className="h-3 w-3" />}
                              {ass.status}
                            </span>
                          </td>
                          <td>
                            {ass.status === 'Pending' ? (
                              <button 
                                className="btn-join-class"
                                onClick={() => setActiveAssignmentSubmit(ass)}
                              >
                                Submit Task
                              </button>
                            ) : (
                              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>
                                {ass.status === 'Graded' ? ass.grade : 'Waiting review'}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Floating Submit Modal */}
              {activeAssignmentSubmit && (
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
                      <h3 style={{ margin: 0, fontWeight: '700', fontSize: '16px' }}>Submit: {activeAssignmentSubmit.title}</h3>
                      <button 
                        onClick={() => setActiveAssignmentSubmit(null)} 
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600' }}>Workspace code solution or repository URL:</label>
                      <textarea
                        rows={6}
                        placeholder="Paste your source code or repository link here..."
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        style={{
                          width: '100%',
                          borderRadius: '8px',
                          border: '1px solid var(--border)',
                          padding: '12px',
                          fontSize: '13px',
                          outline: 'none',
                          resize: 'vertical',
                          fontFamily: 'monospace'
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                        <button 
                          onClick={() => setActiveAssignmentSubmit(null)}
                          style={{ backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: 'var(--text)' }}
                        >
                          Cancel
                        </button>
                        <button 
                          className="btn-join-class"
                          onClick={submitAssignmentAction}
                        >
                          Submit Solution
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 7. AI TUTOR VIEW */}
          {activeTab === 'tutor' && (
            <div className="view-fade-in">
              <div className="chat-container">
                {/* Messages panel */}
                <div className="chat-messages-scroll">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`chat-bubble ${msg.sender}`}>
                      <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                      <span className="chat-time">{msg.time}</span>
                    </div>
                  ))}
                  
                  {aiTyping && (
                    <div className="typing-dots">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Suggestion Chips */}
                <div className="chat-chips-container">
                  {tutorSuggestions.map((s, idx) => (
                    <button 
                      key={idx} 
                      className="chat-chip"
                      onClick={() => handleSendChatMessage(s.label)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Send chat block */}
                <div className="chat-input-bar">
                  <input
                    type="text"
                    placeholder="Type questions about Binary Search..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendChatMessage(chatInput);
                    }}
                    className="chat-input-field"
                  />
                  <button 
                    onClick={() => handleSendChatMessage(chatInput)}
                    className="chat-send-btn"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 8. PROGRESS & ANALYTICS VIEW */}
          {activeTab === 'progress' && (
            <div className="view-fade-in">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Chart Mockup */}
                <div className="gorgeous-card">
                  <h3 className="section-header-title">
                    <TrendingUp className="h-4 w-4 text-indigo-500" /> Weekly Study Time Tracker
                  </h3>
                  
                  <div className="chart-svg-container" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px' }}>
                    {/* SVG/CSS Line/Bar Graph representation */}
                    {[
                      { day: 'Mon', hrs: 4, height: '40%' },
                      { day: 'Tue', hrs: 5, height: '50%' },
                      { day: 'Wed', hrs: 3, height: '30%' },
                      { day: 'Thu', hrs: 6, height: '60%' },
                      { day: 'Fri', hrs: 4, height: '40%' },
                      { day: 'Sat', hrs: 7, height: '70%' },
                      { day: 'Sun', hrs: 5, height: '50%' }
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', marginBottom: '8px' }}>{item.hrs}h</span>
                        <div style={{ width: '100%', height: '110px', backgroundColor: '#E2E8F0', borderRadius: '4px', position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
                          <div style={{ width: '100%', height: item.height, background: 'linear-gradient(to top, var(--primary) 0%, #818CF8 100%)', borderRadius: '4px', transition: 'height 0.8s ease-out' }} />
                        </div>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', fontWeight: '500' }}>{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dashboard-main-grid">
                  {/* Topicwise Progress */}
                  <div className="gorgeous-card">
                    <h3 className="section-header-title">
                      <BookOpenCheck className="h-4 w-4 text-emerald-500" /> Topic Mastery Breakdown
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {[
                        { topic: 'Recursion & Sorting (DSA)', value: 90, color: '#10B981' },
                        { topic: 'Relational Algebra (DBMS)', value: 70, color: '#3B82F6' },
                        { topic: 'Process & CPU Scheduling (OS)', value: 50, color: '#F59E0B' },
                        { topic: 'Routing Protocols & IP Address Class (CN)', value: 30, color: '#EF4444' }
                      ].map((mastery, idx) => (
                        <div key={idx}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                            <span>{mastery.topic}</span>
                            <span>{mastery.value}%</span>
                          </div>
                          <div className="fancy-progress-bar-container">
                            <div className="fancy-progress-bar-fill" style={{ width: `${mastery.value}%`, backgroundColor: mastery.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weak Topics */}
                  <div className="gorgeous-card">
                    <h3 className="section-header-title">
                      <AlertCircle className="h-4 w-4 text-red-500" /> Targeted Weak Areas
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ padding: '14px', borderRadius: '8px', borderLeft: '4px solid #EF4444', backgroundColor: '#FEF2F2' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#B91C1C', textTransform: 'uppercase' }}>Operating Systems</span>
                        <h4 style={{ margin: '4px 0', fontSize: '13px', fontWeight: '700' }}>Process Synchronization</h4>
                        <p style={{ fontSize: '12px', color: '#7F1D1D', margin: '4px 0 10px 0', lineHeight: 1.4 }}>
                          Your diagnostics reveal a low score (45%) in Semaphores. Review the CPU scheduling lecture.
                        </p>
                        <button 
                          onClick={() => {
                            setLectureFilter('OS');
                            setActiveTab('lectures');
                            triggerToast("Redirecting to OS lecture components...");
                          }}
                          style={{ backgroundColor: '#EF4444', border: 'none', color: 'white', fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Review Lecture
                        </button>
                      </div>

                      <div style={{ padding: '14px', borderRadius: '8px', borderLeft: '4px solid #F59E0B', backgroundColor: '#FFFBEB' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#B45309', textTransform: 'uppercase' }}>Computer Networks</span>
                        <h4 style={{ margin: '4px 0', fontSize: '13px', fontWeight: '700' }}>CIDR Routing & Subnetting</h4>
                        <p style={{ fontSize: '12px', color: '#78350F', margin: '4px 0 10px 0', lineHeight: 1.4 }}>
                          Average quiz score (50%) represents moderate class comprehension. Review IP Subnetting guides.
                        </p>
                        <button 
                          onClick={() => {
                            setExpandedNoteId(4); // ID 4 is Subnetting Notes
                            setActiveTab('notes');
                            triggerToast("Redirecting to Subnetting notes summary...");
                          }}
                          style={{ backgroundColor: '#F59E0B', border: 'none', color: 'white', fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Read AI Guide
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 9. NOTIFICATIONS VIEW */}
          {activeTab === 'notifications' && (
            <div className="view-fade-in">
              <div className="gorgeous-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>
                    You have {unreadNotificationsCount} unread system alerts
                  </span>
                  {unreadNotificationsCount > 0 && (
                    <button 
                      onClick={markAllNotificationsRead}
                      style={{ border: 'none', background: 'transparent', color: 'var(--primary)', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      style={{
                        padding: '16px',
                        borderRadius: '8px',
                        backgroundColor: notif.read ? 'white' : '#F5F3FF',
                        border: '1px solid',
                        borderColor: notif.read ? 'var(--border)' : '#DDD6FE',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{
                        marginTop: '2px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: notif.read ? 'transparent' : '#8B5CF6',
                        flexShrink: 0
                      }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: '13.5px', fontWeight: notif.read ? '500' : '700', color: 'var(--text)' }}>
                          {notif.text}
                        </p>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 10. PROFILE & SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <div className="view-fade-in">
              <div className="settings-grid">
                {/* Left Profile card */}
                <div className="profile-side-card">
                  <div className="profile-avatar-large">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0', color: 'var(--text)' }}>{profile.name}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Roll No: {profile.rollNo}</span>
                  
                  <div style={{ borderTop: '1px solid var(--border)', marginTop: '20px', paddingTop: '20px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Degree & Major</span>
                      <p style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: '600' }}>{profile.degree}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Email Address</span>
                      <p style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: '600' }}>{profile.email}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Current Semester</span>
                      <p style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: '600' }}>{profile.semester}</p>
                    </div>
                  </div>
                </div>

                {/* Right Settings Form */}
                <div className="gorgeous-card">
                  <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 20px 0', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                    Configure Student Settings
                  </h3>

                  <form onSubmit={handleSaveSettings}>
                    <div className="settings-form-group">
                      <label className="settings-form-label">Full Legal Name</label>
                      <input 
                        type="text" 
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="settings-input-control" 
                      />
                    </div>

                    <div className="settings-form-group">
                      <label className="settings-form-label">Contact Phone Number</label>
                      <input 
                        type="text" 
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="settings-input-control" 
                      />
                    </div>

                    <div className="settings-form-group">
                      <label className="settings-form-label">Primary Career Study Goal</label>
                      <input 
                        type="text" 
                        value={profile.studyGoal}
                        onChange={(e) => setProfile({ ...profile, studyGoal: e.target.value })}
                        className="settings-input-control" 
                      />
                    </div>

                    <div className="settings-form-group">
                      <label className="settings-form-label">Preferred Daily Study Window</label>
                      <input 
                        type="text" 
                        value={profile.studyTime}
                        onChange={(e) => setProfile({ ...profile, studyTime: e.target.value })}
                        className="settings-input-control" 
                      />
                    </div>

                    <h4 style={{ fontSize: '14px', fontWeight: '700', margin: '24px 0 12px 0' }}>Notification Toggles</h4>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div className="form-toggle-row">
                        <div>
                          <span style={{ fontSize: '13px', fontWeight: '600' }}>Email Summaries</span>
                          <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Get weekly progress summaries via registered email</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={profile.emailAlerts}
                          onChange={(e) => setProfile({ ...profile, emailAlerts: e.target.checked })}
                          className="toggle-switch-input" 
                        />
                      </div>

                      <div className="form-toggle-row">
                        <div>
                          <span style={{ fontSize: '13px', fontWeight: '600' }}>SMS Alerts & Reminders</span>
                          <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Receive immediate reminders about due deadlines</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={profile.smsAlerts}
                          onChange={(e) => setProfile({ ...profile, smsAlerts: e.target.checked })}
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

export default StudentDashboard;
