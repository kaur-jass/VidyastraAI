import { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ShieldCheck, 
  Cpu, 
  BarChart2, 
  Bell, 
  Server, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Plus, 
  Activity, 
  Database,
  Sparkles,
  Terminal,
  RefreshCw,
  HardDrive
} from 'lucide-react';

const AdminDashboard = ({ user, onLogout }) => {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Users Directory State
  const [usersList, setUsersList] = useState([
    { id: 1, name: 'Dr. Sarah Verma', email: 'sarah.verma@nitj.ac.in', role: 'Faculty', status: 'Active', dept: 'CSE' },
    { id: 2, name: 'Dr. Amit Singh', email: 'amit.singh@nitj.ac.in', role: 'Faculty', status: 'Active', dept: 'CSE' },
    { id: 3, name: 'Dr. Neha Gupta', email: 'neha.gupta@nitj.ac.in', role: 'Faculty', status: 'Active', dept: 'IT' },
    { id: 4, name: 'Aarav Sharma', email: 'aarav.sharma@nitj.ac.in', role: 'Student', status: 'Active', roll: '24103011' },
    { id: 5, name: 'Riya Verma', email: 'riya.verma@nitj.ac.in', role: 'Student', status: 'Active', roll: '24103012' },
    { id: 6, name: 'Karan Mehta', email: 'karan.mehta@nitj.ac.in', role: 'Student', status: 'Inactive', roll: '24103013' },
    { id: 7, name: 'System Administrator', email: 'admin@vidyastra.ai', role: 'Admin', status: 'Active' },
  ]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Add User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Student',
    password: '',
    dept: 'CSE',
    roll: ''
  });

  // Course Catalog State
  const [coursesList] = useState([
    { code: 'CS201', name: 'Data Structures & Algorithms', category: 'DSA', instructor: 'Dr. Sarah Verma', enrollments: 45 },
    { code: 'CS202', name: 'Database Management Systems', category: 'DBMS', instructor: 'Dr. Sarah Verma', enrollments: 38 },
    { code: 'CS203', name: 'Operating Systems', category: 'OS', instructor: 'Dr. Amit Singh', enrollments: 40 },
    { code: 'CS204', name: 'Computer Networks', category: 'CN', instructor: 'Dr. Neha Gupta', enrollments: 32 },
    { code: 'MA201', name: 'Discrete Mathematics', category: 'Math', instructor: 'Dr. Rajesh Kumar', enrollments: 55 },
  ]);
  const [courseSearch, setCourseSearch] = useState('');

  // Content Moderation Queue State
  const [moderationQueue, setModerationQueue] = useState([
    { id: 101, title: 'B-Trees & Balanced Graph Traversals.pdf', submittedBy: 'Dr. Sarah Verma', date: '2026-06-14', size: '2.8 MB', type: 'PDF Notes', course: 'CS201' },
    { id: 102, title: 'CPU Scheduling Simulation Module', submittedBy: 'Dr. Amit Singh', date: '2026-06-13', size: '4.1 MB', type: 'Lab Script', course: 'CS203' },
    { id: 103, title: 'Computer Networks Assignment 2 - IP Subnetting', submittedBy: 'Dr. Neha Gupta', date: '2026-06-12', size: '1.5 MB', type: 'Assignment Task', course: 'CS204' },
    { id: 104, title: 'SQL Joins & Complex Subqueries Cheat Sheet', submittedBy: 'Dr. Sarah Verma', date: '2026-06-11', size: '920 KB', type: 'Revision Notes', course: 'CS202' },
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, text: "System Alert: Storage utilization reached 64.2%.", time: "10 mins ago", read: false, type: 'warning' },
    { id: 2, text: "New Faculty account registered: Dr. Rajesh Kumar.", time: "2 hours ago", read: false, type: 'info' },
    { id: 3, text: "Weekly automated database backup finished successfully.", time: "1 day ago", read: true, type: 'success' },
    { id: 4, text: "High latency spikes detected on GPU translation models.", time: "2 days ago", read: true, type: 'warning' },
    { id: 5, text: "Configuration updated for SendGrid SMTP connector.", time: "3 days ago", read: true, type: 'success' }
  ]);

  // AI Inference & Latency State
  const [aiSettings, setAiSettings] = useState({
    fallbackToPro: true,
    cacheResponses: true,
    maxTokenLimit: 10000000,
    tokensUsed: 4218500,
    geminiStatus: 'Operational',
    whisperStatus: 'Operational',
    summarizerStatus: 'Operational',
    avgLatency: 840
  });

  // System Logs & Backups Console State
  const [terminalLogs, setTerminalLogs] = useState([
    '[2026-06-15 12:00:01] [SYSTEM] Vidyastra AI Admin Shell v2.4 initialized.',
    '[2026-06-15 12:00:03] [DATABASE] DB pool connected. Active sessions: 14.',
    '[2026-06-15 12:01:10] [GATEWAY] Auth API response: 200 OK.',
    '[2026-06-15 12:02:45] [AI-MODULE] Warm startup finished for Gemini 1.5 Flash.',
    '[2026-06-15 12:05:12] [BACKUP] Automated daily snapshot backup_20260615_0400.tar.gz saved (42.4 MB).',
    '[2026-06-15 12:07:30] [INFO] Heartbeat response from translation worker: OK.'
  ]);
  const [isBackupRunning, setIsBackupRunning] = useState(false);

  // Settings Fields
  const [settingsForm, setSettingsForm] = useState({
    siteTitle: 'Vidyastra AI Platform',
    adminEmail: 'admin@vidyastra.ai',
    smtpHost: 'smtp.mailgun.org',
    smtpPort: '587',
    smtpUser: 'postmaster@mg.vidyastra.ai',
    smtpPass: '••••••••••••••••••••••',
    notifyOnNewUsers: true,
    requireEmailVerification: true,
    moderationAlerts: true
  });

  // Scroll to bottom of terminal console
  const terminalEndRef = useRef(null);
  useEffect(() => {
    if (activeTab === 'system' && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs, activeTab]);

  // Toast Helper
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Simulate scrolling live console logs when view is active
  useEffect(() => {
    if (activeTab !== 'system') return;
    const logPool = [
      'GET /api/v1/courses - 200 OK (12ms)',
      'POST /api/v1/auth/refresh - 200 OK (5ms)',
      'Gemini API request successful. Tokens: 1245 prompt, 385 completion.',
      'Tutor Session 88241: Updated student feedback vector store.',
      'GET /api/v1/lectures/archive - 200 OK (22ms)',
      'Whisper translation worker finished transcript file task_20412.wav.',
      'GET /api/v1/admin/health - 200 OK (8ms)',
      'Redis server cache hit: dashboard_metrics (0.4ms)',
      'SMTP Dispatcher: Welcome email scheduled for user rohan.sharma@vidyastra.ai'
    ];

    const interval = setInterval(() => {
      const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
      const now = new Date().toLocaleTimeString();
      setTerminalLogs(prev => [...prev, `[${now}] [LOG] ${randomLog}`]);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeTab]);

  // Actions handlers
  const handleApproveResource = (id, title) => {
    setModerationQueue(prev => prev.filter(item => item.id !== id));
    triggerToast(`"${title}" approved and published to classroom library!`);
  };

  const handleRejectResource = (id, title) => {
    setModerationQueue(prev => prev.filter(item => item.id !== id));
    triggerToast(`"${title}" rejected. Notification sent to instructor.`, 'info');
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      triggerToast("Please provide user name and email", "info");
      return;
    }

    const createdUser = {
      id: Date.now(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'Active',
      dept: newUser.role === 'Faculty' ? newUser.dept : undefined,
      roll: newUser.role === 'Student' ? (newUser.roll || `2410${Math.floor(Math.random() * 9000 + 1000)}`) : undefined
    };

    setUsersList(prev => [createdUser, ...prev]);
    setShowAddUserModal(false);
    triggerToast(`User "${newUser.name}" successfully registered as ${newUser.role}!`);
    // Reset form
    setNewUser({
      name: '',
      email: '',
      role: 'Student',
      password: '',
      dept: 'CSE',
      roll: ''
    });
  };

  const triggerManualBackup = () => {
    if (isBackupRunning) return;
    setIsBackupRunning(true);
    triggerToast("Starting manual backup snapshot...");
    
    setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] [BACKUP] Initiating manual backup snapshot...`]);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev, 
        `[${new Date().toLocaleTimeString()}] [BACKUP] Compressing storage directories...`,
        `[${new Date().toLocaleTimeString()}] [BACKUP] Writing database snapshot SQL file...`
      ]);
    }, 1000);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev, 
        `[${new Date().toLocaleTimeString()}] [BACKUP] Backup completed. Written file: backup_manual_${Date.now()}.tar.gz (48.1 MB)`
      ]);
      setIsBackupRunning(false);
      triggerToast("Backup snapshot completed successfully!");
    }, 2500);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    triggerToast("Saving system configuration settings...");
    setTimeout(() => {
      triggerToast("Admin system configurations updated successfully!");
    }, 1000);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    triggerToast("All notifications marked as read!");
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Calculations for Metrics & Lists
  const totalUsers = usersList.length;
  const facultyCount = usersList.filter(u => u.role === 'Faculty').length;
  const studentCount = usersList.filter(u => u.role === 'Student').length;
  const activeCourses = coursesList.length;
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Filtered lists
  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredCourses = coursesList.filter(c => {
    return c.name.toLowerCase().includes(courseSearch.toLowerCase()) || 
           c.code.toLowerCase().includes(courseSearch.toLowerCase()) ||
           c.instructor.toLowerCase().includes(courseSearch.toLowerCase());
  });

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
          width: 100%;
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
          overflow-x: hidden;
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
          background: linear-gradient(135deg, var(--primary) 0%, #818CF8 100%);
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
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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
          cursor: pointer;
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

        /* Tables & Lists */
        .premium-table-container {
          width: 100%;
          overflow-x: auto;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          background-color: white;
        }

        .premium-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 14px;
        }

        .premium-table th {
          background-color: #F8FAFC;
          padding: 16px;
          font-weight: 600;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .premium-table td {
          padding: 16px;
          border-bottom: 1px solid var(--border);
          vertical-align: middle;
        }

        .premium-table tr:last-child td {
          border-bottom: none;
        }

        .badge-role {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .badge-role.admin {
          background-color: #F3E8FF;
          color: #7E22CE;
        }

        .badge-role.faculty {
          background-color: #DBEAFE;
          color: #1D4ED8;
        }

        .badge-role.student {
          background-color: #D1FAE5;
          color: #065F46;
        }

        .badge-status {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .badge-status.active {
          background-color: #ECFDF5;
          color: #10B981;
        }

        .badge-status.inactive {
          background-color: #FEF2F2;
          color: #EF4444;
        }

        .btn-action-small {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          padding: 6px;
          border-radius: 4px;
          transition: all var(--transition-fast);
        }

        .btn-action-small:hover {
          background-color: #F1F5F9;
          color: var(--text);
        }

        .btn-action-danger:hover {
          background-color: #FEF2F2;
          color: var(--danger);
        }

        /* Filter Controls */
        .controls-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .search-input-wrapper {
          position: relative;
          flex: 1;
          max-width: 380px;
        }

        .search-icon-inside {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .search-input-field {
          width: 100%;
          height: 40px;
          border-radius: 8px;
          border: 1px solid var(--border);
          padding: 0 16px 0 40px;
          font-size: 14px;
          outline: none;
          color: var(--text);
          background-color: white;
        }

        .search-input-field:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
        }

        .filter-buttons-row {
          display: flex;
          gap: 8px;
        }

        .btn-filter-pill {
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid var(--border);
          background-color: white;
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }

        .btn-filter-pill:hover {
          background-color: #F8FAFC;
          color: var(--text);
        }

        .btn-filter-pill.active {
          background-color: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .btn-primary-rect {
          background-color: var(--primary);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: opacity var(--transition-fast);
        }

        .btn-primary-rect:hover {
          opacity: 0.9;
        }

        /* Modal popup */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(4px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .modal-box {
          background: white;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          width: 100%;
          max-width: 480px;
          overflow: hidden;
          animation: scaleUpCustom 0.2s ease-out forwards;
        }

        @keyframes scaleUpCustom {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-family: var(--heading-font);
          font-size: 18px;
          font-weight: 700;
          color: var(--text);
        }

        .modal-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          padding: 4px;
          border-radius: 4px;
        }

        .modal-close-btn:hover {
          background-color: #F1F5F9;
        }

        .modal-body {
          padding: 24px;
        }

        .form-group-control {
          margin-bottom: 16px;
        }

        .form-label-styled {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 6px;
        }

        .form-input-text {
          width: 100%;
          height: 40px;
          border-radius: 8px;
          border: 1px solid var(--border);
          padding: 0 12px;
          font-size: 14px;
          outline: none;
          color: var(--text);
        }

        .form-input-text:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
        }

        .form-select-styled {
          width: 100%;
          height: 40px;
          border-radius: 8px;
          border: 1px solid var(--border);
          padding: 0 12px;
          font-size: 14px;
          outline: none;
          color: var(--text);
          background-color: white;
        }

        .form-select-styled:focus {
          border-color: var(--primary);
        }

        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          background-color: #F8FAFC;
        }

        .btn-cancel {
          background-color: white;
          color: var(--text-muted);
          border: 1px solid var(--border);
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-cancel:hover {
          background-color: #F1F5F9;
        }

        /* System Health States */
        .health-item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }

        .health-item-row:last-child {
          border-bottom: none;
        }

        .health-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
        }

        .health-status-indicator {
          font-size: 12px;
          font-weight: 700;
          color: var(--success);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Token and storage progress */
        .progress-bar-fancy-container {
          background-color: #F1F5F9;
          height: 12px;
          border-radius: 6px;
          overflow: hidden;
          width: 100%;
          margin-top: 8px;
          position: relative;
        }

        .progress-bar-fancy-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary) 0%, #818CF8 100%);
          border-radius: 6px;
          transition: width 0.5s ease-in-out;
        }

        /* Terminal Console */
        .terminal-container {
          background-color: #0F172A;
          border-radius: var(--radius-md);
          border: 1px solid #1E293B;
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }

        .terminal-header {
          background-color: #1E293B;
          padding: 10px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #334155;
        }

        .terminal-header-title {
          font-family: monospace;
          font-size: 13px;
          color: #94A3B8;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .terminal-dots {
          display: flex;
          gap: 6px;
        }

        .terminal-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .terminal-dot.red { background-color: #EF4444; }
        .terminal-dot.yellow { background-color: #F59E0B; }
        .terminal-dot.green { background-color: #10B981; }

        .terminal-body {
          padding: 16px;
          height: 250px;
          overflow-y: auto;
          font-family: monospace;
          font-size: 13px;
          color: #38BDF8;
          line-height: 1.6;
          text-align: left;
        }

        .terminal-log-line {
          margin-bottom: 4px;
          white-space: pre-wrap;
          word-break: break-all;
        }

        /* Settings grid split */
        .settings-layout {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 24px;
        }

        @media (max-width: 900px) {
          .settings-layout {
            grid-template-columns: 1fr;
          }
        }

        .settings-nav-sidebar {
          background-color: white;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          height: fit-content;
        }

        .settings-nav-link {
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .settings-nav-link:hover {
          background-color: #F8FAFC;
          color: var(--text);
        }

        .settings-nav-link.active {
          background-color: var(--primary-light);
          color: var(--primary);
        }

        /* Toggle switches */
        .toggle-switch-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }

        .toggle-switch-row:last-child {
          border-bottom: none;
        }

        .toggle-switch-btn {
          width: 44px;
          height: 22px;
          border-radius: 9999px;
          background-color: #CBD5E1;
          position: relative;
          cursor: pointer;
          transition: background-color var(--transition-fast);
          border: none;
          outline: none;
        }

        .toggle-switch-btn.active {
          background-color: var(--primary);
        }

        .toggle-switch-handle {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background-color: white;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: transform var(--transition-fast);
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }

        .toggle-switch-btn.active .toggle-switch-handle {
          transform: translateX(22px);
        }
      `}</style>

      {/* Persistent Left-Aligned Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo-circle">
            <GraduationCap className="text-white h-5 w-5" style={{ color: 'white' }} />
          </div>
          <span className="brand-name">Vidyastra AI</span>
        </div>

        <nav className="sidebar-menu">
          <button className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}>
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </button>
          
          <button className={`menu-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => { setActiveTab('users'); setSidebarOpen(false); }}>
            <Users className="h-4 w-4" />
            <span>User Management</span>
          </button>

          <button className={`menu-item ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => { setActiveTab('courses'); setSidebarOpen(false); }}>
            <BookOpen className="h-4 w-4" />
            <span>Course Management</span>
          </button>

          <button className={`menu-item ${activeTab === 'moderation' ? 'active' : ''}`} onClick={() => { setActiveTab('moderation'); setSidebarOpen(false); }}>
            <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShieldCheck className="h-4 w-4" />
                <span>Content Moderation</span>
              </span>
              {moderationQueue.length > 0 && (
                <span style={{ backgroundColor: '#EF4444', color: 'white', fontSize: '10px', padding: '1px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                  {moderationQueue.length}
                </span>
              )}
            </span>
          </button>

          <button className={`menu-item ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => { setActiveTab('ai'); setSidebarOpen(false); }}>
            <Cpu className="h-4 w-4" />
            <span>AI Management</span>
          </button>

          <button className={`menu-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => { setActiveTab('analytics'); setSidebarOpen(false); }}>
            <BarChart2 className="h-4 w-4" />
            <span>Analytics</span>
          </button>

          <button className={`menu-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => { setActiveTab('notifications'); setSidebarOpen(false); }}>
            <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </span>
              {unreadNotificationsCount > 0 && (
                <span style={{ backgroundColor: '#EF4444', color: 'white', fontSize: '10px', padding: '1px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                  {unreadNotificationsCount}
                </span>
              )}
            </span>
          </button>

          <button className={`menu-item ${activeTab === 'system' ? 'active' : ''}`} onClick={() => { setActiveTab('system'); setSidebarOpen(false); }}>
            <Server className="h-4 w-4" />
            <span>System Management</span>
          </button>

          <button className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}>
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
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
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'courses' && 'Course Catalog'}
              {activeTab === 'moderation' && 'Resource Moderation Queue'}
              {activeTab === 'ai' && 'Vidyastra AI Engine Control'}
              {activeTab === 'analytics' && 'Platform Performance Analytics'}
              {activeTab === 'notifications' && 'System Notifications Feed'}
              {activeTab === 'system' && 'Infrastructure Console'}
              {activeTab === 'settings' && 'System Configuration Settings'}
            </h1>
          </div>

          <div className="header-actions">
            <button className="bell-trigger" onClick={() => setActiveTab('notifications')}>
              <Bell className="h-5 w-5" />
              {unreadNotificationsCount > 0 && (
                <span className="bell-badge">{unreadNotificationsCount}</span>
              )}
            </button>

            <div className="user-avatar-profile" onClick={() => setActiveTab('settings')}>
              <div className="avatar-circle-sm">AD</div>
              <div className="user-meta-header">
                <span className="user-name-txt">{user?.name || 'Admin User'}</span>
                <span className="user-role-txt">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Workspace Content Scrollable Area */}
        <div className="workspace-content">
          
          {/* A. DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="animate-fade-in">
              {/* Premium Gradient Banner */}
              <div className="gradient-banner">
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 8px 0', fontFamily: 'var(--heading-font)' }}>
                    Welcome back, {user?.name || 'Administrator'}! ✦
                  </h2>
                  <p style={{ margin: 0, opacity: 0.9, fontSize: '14px', maxWidth: '600px', lineHeight: '1.5' }}>
                    Access infrastructure logs, audit course curriculum moderation, provision student/faculty credentials, and track model tokens consumption.
                  </p>
                </div>
                <Sparkles className="gradient-banner-bg-sparks" size={72} />
              </div>

              {/* Metrics Grid */}
              <div className="metrics-grid">
                <div className="metric-card-styled" onClick={() => { setActiveTab('users'); setUserRoleFilter('All'); }}>
                  <div className="metric-icon-box" style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)' }}>
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="metric-value">{totalUsers}</div>
                    <div className="metric-label">Total Users</div>
                  </div>
                </div>

                <div className="metric-card-styled" onClick={() => { setActiveTab('users'); setUserRoleFilter('Student'); }}>
                  <div className="metric-icon-box" style={{ backgroundColor: '#ECFDF5', color: '#10B981' }}>
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="metric-value">{studentCount}</div>
                    <div className="metric-label">Enrolled Students</div>
                  </div>
                </div>

                <div className="metric-card-styled" onClick={() => { setActiveTab('users'); setUserRoleFilter('Faculty'); }}>
                  <div className="metric-icon-box" style={{ backgroundColor: '#FFF7ED', color: '#F97316' }}>
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="metric-value">{facultyCount}</div>
                    <div className="metric-label">Active Faculty</div>
                  </div>
                </div>

                <div className="metric-card-styled" onClick={() => setActiveTab('courses')}>
                  <div className="metric-icon-box" style={{ backgroundColor: '#F3E8FF', color: '#A855F7' }}>
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="metric-value">{activeCourses}</div>
                    <div className="metric-label">Active Courses</div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid split (Charts vs System status checklist) */}
              <div className="dashboard-main-grid">
                {/* Column 1: AI Usage stats */}
                <div className="gorgeous-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 className="section-header-title" style={{ margin: 0 }}>
                      <Activity className="h-5 w-5 text-indigo-600" style={{ color: 'var(--primary)' }} />
                      <span>Platform AI Activity Analytics</span>
                    </h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>LAST 7 DAYS</span>
                  </div>

                  {/* SVG Line Chart for AI calls */}
                  <div style={{ width: '100%', height: '200px', margin: '10px 0' }}>
                    <svg viewBox="0 0 500 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
                      {/* Grid Lines */}
                      <line x1="40" y1="20" x2="480" y2="20" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4" />
                      <line x1="40" y1="70" x2="480" y2="70" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4" />
                      <line x1="40" y1="120" x2="480" y2="120" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4" />
                      <line x1="40" y1="170" x2="480" y2="170" stroke="#CBD5E1" strokeWidth="1.5" />

                      {/* X-axis labels */}
                      <text x="40" y="188" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="bold">Mon</text>
                      <text x="113" y="188" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="bold">Tue</text>
                      <text x="186" y="188" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="bold">Wed</text>
                      <text x="259" y="188" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="bold">Thu</text>
                      <text x="332" y="188" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="bold">Fri</text>
                      <text x="405" y="188" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="bold">Sat</text>
                      <text x="478" y="188" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="bold">Sun</text>

                      {/* Y-axis labels */}
                      <text x="30" y="24" fill="#64748B" fontSize="10" textAnchor="end" fontWeight="bold">3,000</text>
                      <text x="30" y="74" fill="#64748B" fontSize="10" textAnchor="end" fontWeight="bold">2,000</text>
                      <text x="30" y="124" fill="#64748B" fontSize="10" textAnchor="end" fontWeight="bold">1,000</text>
                      <text x="30" y="174" fill="#64748B" fontSize="10" textAnchor="end" fontWeight="bold">0</text>

                      {/* Gradient definition for fill */}
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Chart Area Fill */}
                      <path
                        d="M40,130 L113,85 L186,60 L259,105 L332,45 L405,120 L478,70 L478,170 L40,170 Z"
                        fill="url(#chartGradient)"
                      />

                      {/* Line Path */}
                      <path
                        d="M40,130 L113,85 L186,60 L259,105 L332,45 L405,120 L478,70"
                        fill="none"
                        stroke="#4F46E5"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Data Dots */}
                      <circle cx="40" cy="130" r="4.5" fill="#4F46E5" stroke="white" strokeWidth="2" />
                      <circle cx="113" cy="85" r="4.5" fill="#4F46E5" stroke="white" strokeWidth="2" />
                      <circle cx="186" cy="60" r="4.5" fill="#4F46E5" stroke="white" strokeWidth="2" />
                      <circle cx="259" cy="105" r="4.5" fill="#4F46E5" stroke="white" strokeWidth="2" />
                      <circle cx="332" cy="45" r="4.5" fill="#4F46E5" stroke="white" strokeWidth="2" />
                      <circle cx="405" cy="120" r="4.5" fill="#4F46E5" stroke="white" strokeWidth="2" />
                      <circle cx="478" cy="70" r="4.5" fill="#4F46E5" stroke="white" strokeWidth="2" />
                    </svg>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px', fontSize: '13px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                      <strong style={{ color: 'var(--text)' }}>AI Summaries & Chat Queries Count</strong>
                    </span>
                  </div>
                </div>

                {/* Column 2: System Health Checklist */}
                <div className="gorgeous-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 className="section-header-title" style={{ margin: 0 }}>
                      <Server className="h-5 w-5 text-emerald-500" style={{ color: '#10B981' }} />
                      <span>System Services Status</span>
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div className="health-item-row">
                      <span className="health-label">Web Application Server</span>
                      <span className="health-status-indicator">
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                        Operational
                      </span>
                    </div>

                    <div className="health-item-row">
                      <span className="health-label">PostgreSQL Database</span>
                      <span className="health-status-indicator">
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                        Operational
                      </span>
                    </div>

                    <div className="health-item-row">
                      <span className="health-label">Gemini AI Engine</span>
                      <span className="health-status-indicator">
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                        Operational
                      </span>
                    </div>

                    <div className="health-item-row">
                      <span className="health-label">S3 Cloud Storage</span>
                      <span className="health-status-indicator">
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                        Operational
                      </span>
                    </div>

                    <div className="health-item-row">
                      <span className="health-label">SMTP Mail Gateway</span>
                      <span className="health-status-indicator">
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                        Operational
                      </span>
                    </div>
                  </div>

                  <button 
                    className="btn-primary-rect" 
                    style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}
                    onClick={() => {
                      triggerToast("Starting network and service integrity checks...");
                      setTimeout(() => triggerToast("Integrity verification completed. All checks passed!", "success"), 1200);
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Run Diagnostics Audit</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* B. USER MANAGEMENT VIEW */}
          {activeTab === 'users' && (
            <div className="animate-fade-in">
              {/* Controls block */}
              <div className="controls-row">
                <div className="search-input-wrapper">
                  <Search className="search-icon-inside h-4 w-4" />
                  <input 
                    type="text" 
                    placeholder="Search users by name or email..." 
                    className="search-input-field"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                </div>

                <div className="filter-buttons-row">
                  {['All', 'Admin', 'Faculty', 'Student'].map((role) => (
                    <button 
                      key={role} 
                      className={`btn-filter-pill ${userRoleFilter === role ? 'active' : ''}`}
                      onClick={() => setUserRoleFilter(role)}
                    >
                      {role}s
                    </button>
                  ))}
                </div>

                <button className="btn-primary-rect" onClick={() => setShowAddUserModal(true)}>
                  <Plus className="h-4 w-4" />
                  <span>Register User</span>
                </button>
              </div>

              {/* Roster Table */}
              <div className="premium-table-container">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>Email Address</th>
                      <th>System Role</th>
                      <th>Identifier Info</th>
                      <th>Roster Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                          No profiles matching search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <strong style={{ color: 'var(--text)' }}>{item.name}</strong>
                          </td>
                          <td style={{ color: '#475569' }}>{item.email}</td>
                          <td>
                            <span className={`badge-role ${item.role.toLowerCase()}`}>
                              {item.role}
                            </span>
                          </td>
                          <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                            {item.role === 'Student' && `Roll: ${item.roll}`}
                            {item.role === 'Faculty' && `Dept: ${item.dept}`}
                            {item.role === 'Admin' && 'System Access'}
                          </td>
                          <td>
                            <span className={`badge-status ${item.status.toLowerCase()}`}>
                              {item.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button 
                              className="btn-action-small"
                              title="Simulated details edit"
                              onClick={() => triggerToast(`Simulating details edit modal for ${item.name}`, 'info')}
                            >
                              Edit
                            </button>
                            <button 
                              className="btn-action-small btn-action-danger"
                              style={{ color: 'var(--danger)', marginLeft: '8px' }}
                              onClick={() => {
                                setUsersList(prev => prev.map(u => u.id === item.id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
                                triggerToast(`Updated status badge for ${item.name}!`);
                              }}
                            >
                              {item.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* C. COURSE CATALOG VIEW */}
          {activeTab === 'courses' && (
            <div className="animate-fade-in">
              <div className="controls-row">
                <div className="search-input-wrapper">
                  <Search className="search-icon-inside h-4 w-4" />
                  <input 
                    type="text" 
                    placeholder="Search courses catalog by name, code or faculty..." 
                    className="search-input-field"
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                  />
                </div>
                
                <button 
                  className="btn-primary-rect" 
                  onClick={() => triggerToast("Add new course profile flow is simulated.", "info")}
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Course</span>
                </button>
              </div>

              <div className="premium-table-container">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Course Name</th>
                      <th>Curriculum Category</th>
                      <th>Faculty Assigned</th>
                      <th>Students Enrolled</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                          No matching courses configured.
                        </td>
                      </tr>
                    ) : (
                      filteredCourses.map((c) => (
                        <tr key={c.code}>
                          <td><strong style={{ color: 'var(--primary)' }}>{c.code}</strong></td>
                          <td><strong style={{ color: 'var(--text)' }}>{c.name}</strong></td>
                          <td>
                            <span style={{ fontSize: '12px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#F1F5F9', color: '#475569' }}>
                              {c.category}
                            </span>
                          </td>
                          <td>{c.instructor}</td>
                          <td>
                            <strong style={{ color: '#0F172A' }}>{c.enrollments}</strong> students
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button 
                              className="btn-action-small"
                              onClick={() => triggerToast(`Simulating management panel for ${c.code}`, 'info')}
                            >
                              Manage Syllabus
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* D. CONTENT MODERATION VIEW */}
          {activeTab === 'moderation' && (
            <div className="animate-fade-in">
              <div className="section-header-title">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
                <span>Pending Syllabus Material Moderation</span>
              </div>

              <div className="premium-table-container">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Material Resource Name</th>
                      <th>Resource Type</th>
                      <th>Course Target</th>
                      <th>Uploaded By</th>
                      <th>Date Submitted</th>
                      <th>File Size</th>
                      <th style={{ textAlign: 'right' }}>Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moderationQueue.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '48px' }}>
                          <div style={{ color: '#10B981', fontSize: '24px', marginBottom: '8px' }}>✓</div>
                          <strong style={{ color: 'var(--text)' }}>All materials approved!</strong>
                          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                            No classroom syllabus materials are waiting in the staging queue.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      moderationQueue.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <strong style={{ color: 'var(--text)' }}>{item.title}</strong>
                          </td>
                          <td>
                            <span style={{ fontSize: '12px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#F8FAFC', border: '1px solid var(--border)' }}>
                              {item.type}
                            </span>
                          </td>
                          <td><strong style={{ color: 'var(--primary)' }}>{item.course}</strong></td>
                          <td>{item.submittedBy}</td>
                          <td>{item.date}</td>
                          <td style={{ color: 'var(--text-muted)' }}>{item.size}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button 
                              className="btn-primary-rect" 
                              style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#10B981' }}
                              onClick={() => handleApproveResource(item.id, item.title)}
                            >
                              Approve
                            </button>
                            <button 
                              className="btn-primary-rect" 
                              style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#EF4444', marginLeft: '8px' }}
                              onClick={() => handleRejectResource(item.id, item.title)}
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* E. AI MANAGEMENT VIEW */}
          {activeTab === 'ai' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }} className="settings-layout">
                {/* Latency & Token utilization panel */}
                <div className="gorgeous-card">
                  <h3 className="section-header-title">
                    <Cpu className="h-5 w-5 text-indigo-600" />
                    <span>Inference Consumption Meter</span>
                  </h3>

                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Monthly Token Allocation Usage</span>
                      <span style={{ color: 'var(--text)' }}>
                        {aiSettings.tokensUsed.toLocaleString()} / {aiSettings.maxTokenLimit.toLocaleString()} (42%)
                      </span>
                    </div>

                    <div className="progress-bar-fancy-container">
                      <div className="progress-bar-fancy-fill" style={{ width: '42%' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                      <span>Billing cycle resets: July 1, 2026</span>
                      <span>Estimated charge: $42.18 USD</span>
                    </div>
                  </div>

                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
                    Model API Endpoints Latency (24h Average)
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                    <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>Gemini 1.5 Flash</span>
                      <strong style={{ fontSize: '20px', color: 'var(--text)', display: 'block', margin: '4px 0' }}>840 ms</strong>
                      <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 'bold' }}>✓ Normal</span>
                    </div>

                    <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>Whisper Voice ASR</span>
                      <strong style={{ fontSize: '20px', color: 'var(--text)', display: 'block', margin: '4px 0' }}>1,250 ms</strong>
                      <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 'bold' }}>✓ Operational</span>
                    </div>

                    <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold', display: 'block', textTransform: 'uppercase' }}>Syllabus Summarizer</span>
                      <strong style={{ fontSize: '20px', color: 'var(--text)', display: 'block', margin: '4px 0' }}>450 ms</strong>
                      <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 'bold' }}>✓ Excellent</span>
                    </div>
                  </div>
                </div>

                {/* AI Tuning Settings */}
                <div className="gorgeous-card">
                  <h3 className="section-header-title">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    <span>AI Model Switching Controls</span>
                  </h3>

                  <div className="toggle-switch-row">
                    <div>
                      <strong style={{ fontSize: '14px', color: 'var(--text)', display: 'block' }}>Fallback to Gemini Pro</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Use Gemini 1.5 Pro if Flash rate limits trigger</span>
                    </div>
                    <button 
                      className={`toggle-switch-btn ${aiSettings.fallbackToPro ? 'active' : ''}`}
                      onClick={() => {
                        setAiSettings(prev => ({ ...prev, fallbackToPro: !prev.fallbackToPro }));
                        triggerToast(`Fallback status: ${!aiSettings.fallbackToPro ? 'Active' : 'Disabled'}`);
                      }}
                    >
                      <div className="toggle-switch-handle" />
                    </button>
                  </div>

                  <div className="toggle-switch-row">
                    <div>
                      <strong style={{ fontSize: '14px', color: 'var(--text)', display: 'block' }}>Semantic Query Cache</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Cache student queries to minimize API cost</span>
                    </div>
                    <button 
                      className={`toggle-switch-btn ${aiSettings.cacheResponses ? 'active' : ''}`}
                      onClick={() => {
                        setAiSettings(prev => ({ ...prev, cacheResponses: !prev.cacheResponses }));
                        triggerToast(`Response caching: ${!aiSettings.cacheResponses ? 'Enabled' : 'Disabled'}`);
                      }}
                    >
                      <div className="toggle-switch-handle" />
                    </button>
                  </div>

                  <button 
                    className="btn-primary-rect" 
                    style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}
                    onClick={() => {
                      triggerToast("Flushing AI prompt and response cache...");
                      setTimeout(() => triggerToast("Cache memory cleared. 2.4 GB allocated freed.", "success"), 1000);
                    }}
                  >
                    <span>Flush Cache Memory</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* F. ANALYTICS VIEW */}
          {activeTab === 'analytics' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="settings-layout">
                {/* Chart 1: Daily Active Users */}
                <div className="gorgeous-card">
                  <h3 className="section-header-title">
                    <Users className="h-5 w-5 text-indigo-600" />
                    <span>Daily Active Sessions</span>
                  </h3>
                  <div style={{ width: '100%', height: '220px', margin: '20px 0' }}>
                    <svg viewBox="0 0 500 220" width="100%" height="100%">
                      <line x1="40" y1="20" x2="480" y2="20" stroke="#E2E8F0" strokeWidth="1" />
                      <line x1="40" y1="70" x2="480" y2="70" stroke="#E2E8F0" strokeWidth="1" />
                      <line x1="40" y1="120" x2="480" y2="120" stroke="#E2E8F0" strokeWidth="1" />
                      <line x1="40" y1="170" x2="480" y2="170" stroke="#E2E8F0" strokeWidth="1" />

                      <polyline
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points="40,150 113,120 186,80 259,130 332,60 405,140 478,50"
                      />
                      <circle cx="40" cy="150" r="4" fill="#10B981" />
                      <circle cx="113" cy="120" r="4" fill="#10B981" />
                      <circle cx="186" cy="80" r="4" fill="#10B981" />
                      <circle cx="259" cy="130" r="4" fill="#10B981" />
                      <circle cx="332" cy="60" r="4" fill="#10B981" />
                      <circle cx="405" cy="140" r="4" fill="#10B981" />
                      <circle cx="478" cy="50" r="4" fill="#10B981" />

                      <text x="40" y="195" fill="#64748B" fontSize="9" textAnchor="middle">09 Jun</text>
                      <text x="113" y="195" fill="#64748B" fontSize="9" textAnchor="middle">10 Jun</text>
                      <text x="186" y="195" fill="#64748B" fontSize="9" textAnchor="middle">11 Jun</text>
                      <text x="259" y="195" fill="#64748B" fontSize="9" textAnchor="middle">12 Jun</text>
                      <text x="332" y="195" fill="#64748B" fontSize="9" textAnchor="middle">13 Jun</text>
                      <text x="405" y="195" fill="#64748B" fontSize="9" textAnchor="middle">14 Jun</text>
                      <text x="478" y="195" fill="#64748B" fontSize="9" textAnchor="middle">15 Jun</text>
                    </svg>
                  </div>
                </div>

                {/* Chart 2: API Calls Count */}
                <div className="gorgeous-card">
                  <h3 className="section-header-title">
                    <Cpu className="h-5 w-5 text-indigo-600" />
                    <span>AI Model API Call Ratios</span>
                  </h3>
                  <div style={{ width: '100%', height: '220px', margin: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 200 200" width="160" height="160">
                      {/* Pie segments (Circle Dasharray math) */}
                      {/* Segment 1: Gemini (65%): strokeDashoffset = 0 */}
                      <circle cx="100" cy="100" r="70" fill="none" stroke="#4F46E5" strokeWidth="30" strokeDasharray="439.8" strokeDashoffset="0" transform="rotate(-90 100 100)" />
                      {/* Segment 2: Whisper (25%): offset = -285.8 */}
                      <circle cx="100" cy="100" r="70" fill="none" stroke="#10B981" strokeWidth="30" strokeDasharray="439.8" strokeDashoffset="-285.8" transform="rotate(-90 100 100)" />
                      {/* Segment 3: Other modules (10%): offset = -395.8 */}
                      <circle cx="100" cy="100" r="70" fill="none" stroke="#F59E0B" strokeWidth="30" strokeDasharray="439.8" strokeDashoffset="-395.8" transform="rotate(-90 100 100)" />
                    </svg>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', marginLeft: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4F46E5' }} />
                        <span>Gemini Flash (65%)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                        <span>Whisper ASR (25%)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                        <span>Summarizer (10%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* G. NOTIFICATIONS VIEW */}
          {activeTab === 'notifications' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div className="section-header-title" style={{ margin: 0 }}>
                  <Bell className="h-5 w-5 text-indigo-600" />
                  <span>Admin Alerts & Event Feed</span>
                </div>
                {unreadNotificationsCount > 0 && (
                  <button className="btn-primary-rect" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={markAllNotificationsAsRead}>
                    Mark All As Read
                  </button>
                )}
              </div>

              <div className="gorgeous-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
                {notifications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No alerts currently logged in feed.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '16px', 
                        borderRadius: '8px', 
                        border: '1px solid var(--border)',
                        backgroundColor: n.read ? 'white' : 'var(--primary-light)',
                        borderLeft: n.read ? '1px solid var(--border)' : '4px solid var(--primary)'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: n.read ? '500' : '700', color: 'var(--text)' }}>
                          {n.text}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{n.time}</span>
                      </div>

                      <button 
                        className="btn-action-small btn-action-danger"
                        style={{ color: 'var(--danger)' }}
                        onClick={() => deleteNotification(n.id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* H. SYSTEM MANAGEMENT VIEW */}
          {activeTab === 'system' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Database and terminal stdout grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }} className="settings-layout">
                {/* Console card */}
                <div className="terminal-container">
                  <div className="terminal-header">
                    <span className="terminal-header-title">
                      <Terminal className="h-4 w-4" />
                      <span>vidyastra-server-logs-stdout</span>
                    </span>
                    <div className="terminal-dots">
                      <span className="terminal-dot red" />
                      <span className="terminal-dot yellow" />
                      <span className="terminal-dot green" />
                    </div>
                  </div>

                  <div className="terminal-body">
                    {terminalLogs.map((log, index) => (
                      <div key={index} className="terminal-log-line">{log}</div>
                    ))}
                    <div ref={terminalEndRef} />
                  </div>
                </div>

                {/* Storage and backup trigger */}
                <div className="gorgeous-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 className="section-header-title" style={{ marginBottom: '16px' }}>
                      <HardDrive className="h-5 w-5 text-indigo-600" />
                      <span>Storage Allocation Ratios</span>
                    </h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Disk Usage</span>
                      <span style={{ color: 'var(--text)' }}>64.2 GB / 100 GB (64.2%)</span>
                    </div>

                    <div className="progress-bar-fancy-container" style={{ margin: '8px 0 16px 0' }}>
                      <div className="progress-bar-fancy-fill" style={{ width: '64.2%', background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Video Archives:</span>
                        <strong style={{ color: 'var(--text)' }}>48.0 GB</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Database Snapshots:</span>
                        <strong style={{ color: 'var(--text)' }}>12.0 GB</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Logs & Diagnostics:</span>
                        <strong style={{ color: 'var(--text)' }}>4.2 GB</strong>
                      </div>
                    </div>
                  </div>

                  <button 
                    className="btn-primary-rect" 
                    style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}
                    onClick={triggerManualBackup}
                    disabled={isBackupRunning}
                  >
                    <Database className="h-4 w-4" />
                    <span>{isBackupRunning ? 'Creating Backup...' : 'Create Backup Snapshot'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* I. SETTINGS VIEW */}
          {activeTab === 'settings' && (
            <div className="animate-fade-in">
              <div className="settings-layout">
                {/* Left side nav links */}
                <div className="settings-nav-sidebar">
                  <span className="settings-nav-link active">General Platform</span>
                  <span className="settings-nav-link" onClick={() => triggerToast("SMTP Configuration loaded", "info")}>SMTP Relay Setup</span>
                  <span className="settings-nav-link" onClick={() => triggerToast("Authentication audit policies loaded", "info")}>Auth Credentials Policies</span>
                  <span className="settings-nav-link" onClick={() => triggerToast("Data Retention logs audit loaded", "info")}>Log Retention Policies</span>
                </div>

                {/* Settings Input Form */}
                <div className="gorgeous-card">
                  <h3 className="section-header-title">
                    <Settings className="h-5 w-5 text-indigo-600" />
                    <span>System Parameters Configuration</span>
                  </h3>

                  <form onSubmit={handleSaveSettings}>
                    <div className="form-group-control">
                      <label className="form-label-styled">Academic Site Title</label>
                      <input 
                        type="text" 
                        className="form-input-text" 
                        value={settingsForm.siteTitle}
                        onChange={(e) => setSettingsForm({...settingsForm, siteTitle: e.target.value})}
                      />
                    </div>

                    <div className="form-group-control">
                      <label className="form-label-styled">System Notification Email Address</label>
                      <input 
                        type="email" 
                        className="form-input-text" 
                        value={settingsForm.adminEmail}
                        onChange={(e) => setSettingsForm({...settingsForm, adminEmail: e.target.value})}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                      <div className="form-group-control">
                        <label className="form-label-styled">SMTP Relay Hostname</label>
                        <input 
                          type="text" 
                          className="form-input-text" 
                          value={settingsForm.smtpHost}
                          onChange={(e) => setSettingsForm({...settingsForm, smtpHost: e.target.value})}
                        />
                      </div>
                      <div className="form-group-control">
                        <label className="form-label-styled">SMTP Port</label>
                        <input 
                          type="text" 
                          className="form-input-text" 
                          value={settingsForm.smtpPort}
                          onChange={(e) => setSettingsForm({...settingsForm, smtpPort: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="form-group-control">
                      <label className="form-label-styled">SMTP Username</label>
                      <input 
                        type="text" 
                        className="form-input-text" 
                        value={settingsForm.smtpUser}
                        onChange={(e) => setSettingsForm({...settingsForm, smtpUser: e.target.value})}
                      />
                    </div>

                    <div className="form-group-control">
                      <label className="form-label-styled">SMTP Password / API Key</label>
                      <input 
                        type="password" 
                        className="form-input-text" 
                        value={settingsForm.smtpPass}
                        onChange={(e) => setSettingsForm({...settingsForm, smtpPass: e.target.value})}
                      />
                    </div>

                    <div style={{ margin: '20px 0' }}>
                      <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
                        Automated Trigger Alerts
                      </h4>

                      <div className="toggle-switch-row">
                        <div>
                          <strong style={{ fontSize: '13px', color: 'var(--text)' }}>Notify on New Users Registration</strong>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Email admins when new students register</span>
                        </div>
                        <button 
                          type="button"
                          className={`toggle-switch-btn ${settingsForm.notifyOnNewUsers ? 'active' : ''}`}
                          onClick={() => setSettingsForm({...settingsForm, notifyOnNewUsers: !settingsForm.notifyOnNewUsers})}
                        >
                          <div className="toggle-switch-handle" />
                        </button>
                      </div>

                      <div className="toggle-switch-row">
                        <div>
                          <strong style={{ fontSize: '13px', color: 'var(--text)' }}>Enforce Student Verification</strong>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Require email verification link response</span>
                        </div>
                        <button 
                          type="button"
                          className={`toggle-switch-btn ${settingsForm.requireEmailVerification ? 'active' : ''}`}
                          onClick={() => setSettingsForm({...settingsForm, requireEmailVerification: !settingsForm.requireEmailVerification})}
                        >
                          <div className="toggle-switch-handle" />
                        </button>
                      </div>
                    </div>

                    <button type="submit" className="btn-primary-rect" style={{ width: '100%', justifyContent: 'center' }}>
                      Save System Configurations
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Register User Modal (rendered conditionally) */}
      {showAddUserModal && (
        <div className="modal-overlay" onClick={() => setShowAddUserModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Register New User Credentials</h3>
              <button className="modal-close-btn" onClick={() => setShowAddUserModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit}>
              <div className="modal-body">
                <div className="form-group-control">
                  <label className="form-label-styled">Full Profile Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter user first & last name" 
                    className="form-input-text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>

                <div className="form-group-control">
                  <label className="form-label-styled">Active Email Address</label>
                  <input 
                    type="email" 
                    placeholder="name@vidyastra.ai" 
                    className="form-input-text"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>

                <div className="form-group-control">
                  <label className="form-label-styled">Initial Password</label>
                  <input 
                    type="password" 
                    placeholder="Create user login password" 
                    className="form-input-text"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  />
                </div>

                <div className="form-group-control">
                  <label className="form-label-styled">System Permission Role</label>
                  <select 
                    className="form-select-styled"
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                {newUser.role === 'Faculty' && (
                  <div className="form-group-control">
                    <label className="form-label-styled">Faculty Assigned Department</label>
                    <select 
                      className="form-select-styled"
                      value={newUser.dept}
                      onChange={(e) => setNewUser({...newUser, dept: e.target.value})}
                    >
                      <option value="CSE">Computer Science & Engg.</option>
                      <option value="IT">Information Technology</option>
                      <option value="ECE">Electronics & Communication</option>
                      <option value="ME">Mechanical Engineering</option>
                    </select>
                  </div>
                )}

                {newUser.role === 'Student' && (
                  <div className="form-group-control">
                    <label className="form-label-styled">Student Roll Number (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 24103015" 
                      className="form-input-text"
                      value={newUser.roll}
                      onChange={(e) => setNewUser({...newUser, roll: e.target.value})}
                    />
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowAddUserModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-rect">
                  Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating System Toast */}
      {toast && (
        <div className={`vidyastra-toast ${toast.type === 'info' ? 'info' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '18px', 
              height: '18px', 
              borderRadius: '50%', 
              backgroundColor: toast.type === 'info' ? 'var(--info)' : 'var(--success)', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '11px',
              fontWeight: 'bold'
            }}>
              ✓
            </div>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
