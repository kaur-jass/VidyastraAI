import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
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
  Plus
} from 'lucide-react';

// Subcomponents imports
import AdminHome from './AdminHome';
import UserManagement from './UserManagement';
import CourseManagement from './CourseManagement';
import ContentModeration from './ContentModeration';
import AIManager from './AIManager';
import AnalyticsReports from './AnalyticsReports';
import NotificationsMgt from './NotificationsMgt';
import SystemLogs from './SystemLogs';
import AdminSettings from './Settings';

const AdminLayout = ({ user, onLogout }) => {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Users Directory State
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Add User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    dept: '',
    roll: ''
  });

  // Course Catalog State
  const [coursesList, setCoursesList] = useState([]);
  const [courseSearch, setCourseSearch] = useState('');
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    semester: '',
    department: '',
    instructor: '',
    schedule: '',
    enrollments: 0
  });

  // Content Moderation Queue State
  const [moderationQueue, setModerationQueue] = useState([]);

  // Notifications State
  const [notifications, setNotifications] = useState([]);

  // AI Inference & Latency State
  const [aiSettings, setAiSettings] = useState(null);

  // Database-backed Admin States
  const [overviewStats, setOverviewStats] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [dailySessions, setDailySessions] = useState([]);
  const [modelRatios, setModelRatios] = useState(null);

  // System Logs & Backups Console State
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [isBackupRunning, setIsBackupRunning] = useState(false);

  // Settings Fields
  const [settingsForm, setSettingsForm] = useState({
    siteTitle: '',
    adminEmail: '',
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: '',
    notifyOnNewUsers: false,
    requireEmailVerification: false,
    moderationAlerts: false
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

  // totalCourses alias (original code uses activeCourses; AdminHome expects totalCourses)
  const totalCourses = coursesList.length;

  // ----------------------------------------------------
  // DATA FETCHING & API EFFECTS FOR ADMIN MODULES
  // ----------------------------------------------------

  const fetchOverviewStats = async () => {
    try {
      const stats = await api.getOverviewStats();
      setOverviewStats(stats);
    } catch (err) {
      console.error("Failed to fetch dashboard overview metrics:", err);
    }
  };

  const fetchSystemHealth = async () => {
    try {
      const health = await api.getSystemHealth();
      setSystemHealth(health);
    } catch (err) {
      console.error("Failed to fetch system health status:", err);
    }
  };

  useEffect(() => {
    fetchOverviewStats();
    fetchSystemHealth();

    // Poll system health every 15 seconds to keep dashboard alive
    const interval = setInterval(fetchSystemHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await api.getCourses();
      const mapped = data.map(c => ({
        ...c,
        id: c._id || c.id,
        category: c.department || c.semester || '',
        instructor: c.instructor || '',
      }));
      setCoursesList(mapped);
    } catch (err) {
      console.error("Failed to load courses:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'courses' || activeTab === 'dashboard') {
      fetchCourses();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      const data = await api.getUsers();
      const roleMap = { student: 'Student', teacher: 'Faculty', admin: 'Admin' };
      const mapped = data.map(u => ({
        ...u,
        id: u._id || u.id,
        role: roleMap[u.role?.toLowerCase()] || u.role || 'Student',
        dept: u.department || u.dept || '',
        roll: u.details?.rollNo || u.roll || '',
        status: u.status || 'Active',
      }));
      setUsersList(mapped);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'users' || activeTab === 'dashboard') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchModerationQueue = async () => {
    try {
      const queue = await api.getModerationQueue();
      setModerationQueue(queue);
    } catch (err) {
      console.error("Failed to load moderation queue:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'moderation' || activeTab === 'dashboard') {
      fetchModerationQueue();
    }
  }, [activeTab]);

  const fetchAISettings = async () => {
    try {
      const settings = await api.getAISettings();
      setAiSettings(settings);
    } catch (err) {
      console.error("Failed to load AI engine settings:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'ai') {
      fetchAISettings();
    }
  }, [activeTab]);

  const fetchAnalytics = async () => {
    try {
      const [sessions, ratios] = await Promise.all([
        api.getDailySessions(),
        api.getModelRatios()
      ]);
      setDailySessions(sessions);
      setModelRatios(ratios);
    } catch (err) {
      console.error("Failed to load analytics charts metrics:", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab]);

  const handleApproveResource = async (id, title) => {
    try {
      const res = await api.approveResource(id);
      if (res.success) {
        setModerationQueue(prev => prev.filter(item => item._id !== id && item.id !== id));
        triggerToast(`"${title}" approved and published to classroom library!`);
      } else {
        triggerToast("Failed to approve resource", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast(err.message || "Failed to approve resource", "error");
    }
  };

  const handleRejectResource = async (id, title) => {
    try {
      const res = await api.rejectResource(id);
      if (res.success) {
        setModerationQueue(prev => prev.filter(item => item._id !== id && item.id !== id));
        triggerToast(`"${title}" rejected. Notification sent to instructor.`, 'info');
      } else {
        triggerToast("Failed to reject resource", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast(err.message || "Failed to reject resource", "error");
    }
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      triggerToast("Please provide user name and email", "info");
      return;
    }

    try {
      const res = await api.addUser({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        password: newUser.password || 'password123',
        dept: newUser.dept,
        roll: newUser.roll
      });
      const roleMap = { student: 'Student', teacher: 'Faculty', admin: 'Admin' };
      const mappedUser = { ...res, id: res._id || res.id, role: roleMap[res.role?.toLowerCase()] || newUser.role, dept: res.department || newUser.dept, roll: res.details?.rollNo || newUser.roll, status: res.status || 'Active' };
      setUsersList(prev => [mappedUser, ...prev]);
      setShowAddUserModal(false);
      triggerToast(`User "${newUser.name}" successfully registered as ${newUser.role}!`);
      setNewUser({
        name: '',
        email: '',
        role: '',
        password: '',
        dept: '',
        roll: ''
      });
    } catch (err) {
      triggerToast(err.message || "Failed to add user", "error");
    }
  };

  const handleAddCourseSubmit = async (e) => {
    e.preventDefault();
    if (!newCourse.code || !newCourse.name) {
      triggerToast("Course code and name are required.", "info");
      return;
    }

    try {
      const res = await api.addCourse(newCourse);
      if (res.success) {
        const mappedCourse = { ...res.course, id: res.course._id || res.course.id, category: res.course.department || '', instructor: res.course.instructor || '' };
        setCoursesList(prev => [...prev, mappedCourse]);
        setShowAddCourseModal(false);
        triggerToast(`Course "${newCourse.name}" registered successfully!`);
        setNewCourse({
          code: '',
          name: '',
          semester: '',
          department: '',
          instructor: '',
          schedule: '',
          enrollments: 0
        });
      }
    } catch (err) {
      console.error(err);
      triggerToast(err.message || "Failed to create course", "error");
    }
  };

  const handleToggleAISetting = async (field) => {
    if (!aiSettings) return;
    const updated = {
      ...aiSettings,
      [field]: !aiSettings[field]
    };
    try {
      setAiSettings(updated);
      await api.updateAISettings(updated);
      triggerToast(`AI configuration updated successfully!`);
    } catch (err) {
      console.error(err);
      triggerToast("Failed to update AI configuration", "error");
    }
  };

  const triggerManualBackup = () => {
    if (isBackupRunning) return;
    setIsBackupRunning(true);
    triggerToast("System management backend is not configured yet.", "info");
    setIsBackupRunning(false);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    triggerToast("Settings backend is not configured yet.", "info");
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

  const sessionsPointsList = dailySessions.map((m, idx) => {
    const x = 40 + idx * 73;
    const y = 170 - (m.activeSessions / 250) * 150;
    return `${x},${y}`;
  });

  const dashboardLinePath = sessionsPointsList.length > 0 ? `M${sessionsPointsList.join(' L')}` : '';
  const dashboardAreaPath = sessionsPointsList.length > 0 ? `M40,170 L${sessionsPointsList.join(' L')} L478,170 Z` : '';

  const geminiPercent = modelRatios?.ratios?.gemini || 0;
  const whisperPercent = modelRatios?.ratios?.whisper || 0;
  const summarizerPercent = modelRatios?.ratios?.summarizer || 0;

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredCourses = coursesList.filter(c => {
    const search = courseSearch.toLowerCase();
    return (c.name || '').toLowerCase().includes(search) || 
           (c.code || '').toLowerCase().includes(search) ||
           (c.instructor || '').toLowerCase().includes(search);
  });

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
          width: 100%;
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
          overflow-x: hidden;
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
        .vidyastra-toast.info { border-left-color: var(--info); }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
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
        .premium-table tr:last-child td { border-bottom: none; }
        .badge-role {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .badge-role.admin { background-color: #F3E8FF; color: #7E22CE; }
        .badge-role.faculty { background-color: #DBEAFE; color: #1D4ED8; }
        .badge-role.student { background-color: #D1FAE5; color: #065F46; }
        .badge-status {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .badge-status.active { background-color: #ECFDF5; color: #10B981; }
        .badge-status.inactive { background-color: #FEF2F2; color: #EF4444; }
        .btn-action-small {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          padding: 6px;
          border-radius: 4px;
          transition: all var(--transition-fast);
        }
        .btn-action-small:hover { background-color: #F1F5F9; color: var(--text); }
        .btn-action-danger:hover { background-color: #FEF2F2; color: var(--danger); }
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
        .btn-filter-pill:hover { background-color: #F8FAFC; color: var(--text); }
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
        .btn-primary-rect:hover { opacity: 0.9; }
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
        .modal-close-btn:hover { background-color: #F1F5F9; }
        .modal-body { padding: 24px; }
        .form-group-control { margin-bottom: 16px; }
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
        .form-select-styled:focus { border-color: var(--primary); }
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
        .btn-cancel:hover { background-color: #F1F5F9; }
        .health-item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }
        .health-item-row:last-child { border-bottom: none; }
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
        .terminal-dots { display: flex; gap: 6px; }
        .terminal-dot { width: 12px; height: 12px; border-radius: 50%; }
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
        .settings-layout {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 24px;
        }
        @media (max-width: 900px) {
          .settings-layout { grid-template-columns: 1fr; }
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
        .settings-nav-link:hover { background-color: #F8FAFC; color: var(--text); }
        .settings-nav-link.active {
          background-color: var(--primary-light);
          color: var(--primary);
        }
        .toggle-switch-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
        }
        .toggle-switch-row:last-child { border-bottom: none; }
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
        .toggle-switch-btn.active { background-color: var(--primary); }
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
        .toggle-switch-btn.active .toggle-switch-handle { transform: translateX(22px); }
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
          {activeTab === 'dashboard' && (
            <AdminHome 
              user={user}
              overviewStats={overviewStats}
              totalUsers={totalUsers}
              totalCourses={totalCourses}
              studentCount={studentCount}
              facultyCount={facultyCount}
              dailySessions={dailySessions}
              systemHealth={systemHealth}
              setActiveTab={setActiveTab}
              setUserRoleFilter={setUserRoleFilter}
              fetchSystemHealth={fetchSystemHealth}
              triggerToast={triggerToast}
              dashboardAreaPath={dashboardAreaPath}
              dashboardLinePath={dashboardLinePath}
            />
          )}

          {activeTab === 'users' && (
            <UserManagement
              userSearch={userSearch}
              setUserSearch={setUserSearch}
              userRoleFilter={userRoleFilter}
              setUserRoleFilter={setUserRoleFilter}
              setShowAddUserModal={setShowAddUserModal}
              filteredUsers={filteredUsers}
              triggerToast={triggerToast}
              setUsersList={setUsersList}
            />
          )}

          {activeTab === 'courses' && (
            <CourseManagement
              courseSearch={courseSearch}
              setCourseSearch={setCourseSearch}
              setShowAddCourseModal={setShowAddCourseModal}
              filteredCourses={filteredCourses}
              triggerToast={triggerToast}
            />
          )}

          {activeTab === 'moderation' && (
            <ContentModeration
              moderationQueue={moderationQueue}
              handleApproveResource={handleApproveResource}
              handleRejectResource={handleRejectResource}
            />
          )}

          {activeTab === 'ai' && (
            <AIManager
              aiSettings={aiSettings}
              handleToggleAISetting={handleToggleAISetting}
              triggerToast={triggerToast}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsReports
              dailySessions={dailySessions}
              sessionsPointsList={sessionsPointsList}
              modelRatios={modelRatios}
              geminiPercent={geminiPercent}
              whisperPercent={whisperPercent}
              summarizerPercent={summarizerPercent}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsMgt
              notifications={notifications}
              unreadNotificationsCount={unreadNotificationsCount}
              markAllNotificationsAsRead={markAllNotificationsAsRead}
              deleteNotification={deleteNotification}
            />
          )}

          {activeTab === 'system' && (
            <SystemLogs
              terminalLogs={terminalLogs}
              terminalEndRef={terminalEndRef}
              isBackupRunning={isBackupRunning}
              triggerManualBackup={triggerManualBackup}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettings
              settingsForm={settingsForm}
              setSettingsForm={setSettingsForm}
              handleSaveSettings={handleSaveSettings}
              triggerToast={triggerToast}
            />
          )}
        </div>
      </main>

      {/* Register User Modal */}
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

      {/* Create Course Modal */}
      {showAddCourseModal && (
        <div className="modal-overlay" onClick={() => setShowAddCourseModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create New Course Profile</h3>
              <button className="modal-close-btn" onClick={() => setShowAddCourseModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddCourseSubmit}>
              <div className="modal-body">
                <div className="form-group-control">
                  <label className="form-label-styled">Course Code</label>
                  <input 
                    type="text" 
                    placeholder="e.g. CS201" 
                    className="form-input-text"
                    required
                    value={newCourse.code}
                    onChange={(e) => setNewCourse({...newCourse, code: e.target.value})}
                  />
                </div>

                <div className="form-group-control">
                  <label className="form-label-styled">Course Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Data Structures & Algorithms" 
                    className="form-input-text"
                    required
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                  />
                </div>

                <div className="form-group-control">
                  <label className="form-label-styled">Academic Semester</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 4th Semester" 
                    className="form-input-text"
                    required
                    value={newCourse.semester}
                    onChange={(e) => setNewCourse({...newCourse, semester: e.target.value})}
                  />
                </div>

                <div className="form-group-control">
                  <label className="form-label-styled">Curriculum Department</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Computer Science" 
                    className="form-input-text"
                    required
                    value={newCourse.department}
                    onChange={(e) => setNewCourse({...newCourse, department: e.target.value})}
                  />
                </div>

                <div className="form-group-control">
                  <label className="form-label-styled">Instructor Assigned</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Dr. Urvashi" 
                    className="form-input-text"
                    required
                    value={newCourse.instructor}
                    onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
                  />
                </div>

                <div className="form-group-control">
                  <label className="form-label-styled">Weekly Schedule</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Mon, Wed, Fri (10:00 AM)" 
                    className="form-input-text"
                    value={newCourse.schedule}
                    onChange={(e) => setNewCourse({...newCourse, schedule: e.target.value})}
                  />
                </div>

                <div className="form-group-control">
                  <label className="form-label-styled">Initial Enrollments Count</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    className="form-input-text"
                    value={newCourse.enrollments}
                    onChange={(e) => setNewCourse({...newCourse, enrollments: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowAddCourseModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-rect">
                  Create Course
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

export default AdminLayout;
