import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'courses', 'ai-settings', 'logs'

  // Dynamic Databases loaded from API
  const [overviewStats, setOverviewStats] = useState(null);
  const [systemHealth, setSystemHealth] = useState({ cpuUsage: 0, memoryUsage: 0, dbConnection: 'Unknown', llmEndpoint: 'Unknown', latencyMs: 0 });
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [aiSettings, setAiSettings] = useState({ provider: '', temperature: 0.7, maxTokens: 1000, systemPrompt: '' });
  const [auditLogs, setAuditLogs] = useState([]);
  
  // App states
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  
  // Search & Filters
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [courseSearch, setCourseSearch] = useState('');

  // Modals state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null means adding user, otherwise user object
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isTestingAI, setIsTestingAI] = useState(false);

  // Form states - User Modal
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('student');
  const [userDept, setUserDept] = useState('Computer Science');
  const [userSemester, setUserSemester] = useState('1st Semester');
  const [userFacultyTitle, setUserFacultyTitle] = useState('Assistant Professor');
  const [userFacultyId, setUserFacultyId] = useState('');

  // Form states - Course Modal
  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseSemester, setCourseSemester] = useState('1st Semester');
  const [courseDept, setCourseDept] = useState('Computer Science');
  const [courseSchedule, setCourseSchedule] = useState('');
  const [courseTeacherId, setCourseTeacherId] = useState('');

  // Form states - AI settings
  const [aiProvider, setAiProvider] = useState('Gemini Pro');
  const [aiTemperature, setAiTemperature] = useState(0.7);
  const [aiMaxTokens, setAiMaxTokens] = useState(2048);
  const [aiSystemPrompt, setAiSystemPrompt] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  const loadAllData = () => {
    return Promise.all([
      api.getOverviewStats(),
      api.getSystemHealth(),
      api.getUsers(),
      api.getCourses(),
      api.getAISettings(),
      api.getAuditLogs()
    ])
      .then(([stats, health, usersList, coursesList, settings, logs]) => {
        setOverviewStats(stats);
        setSystemHealth(health);
        setUsers(usersList);
        setCourses(coursesList);
        setAiSettings(settings);
        setAuditLogs(logs);
        
        // Sync AI form states
        setAiProvider(settings.provider || 'Gemini Pro');
        setAiTemperature(settings.temperature ?? 0.7);
        setAiMaxTokens(settings.maxTokens ?? 2048);
        setAiSystemPrompt(settings.systemPrompt || '');
        
        // Default course teacher select to first teacher
        const teachers = usersList.filter(u => u.role === 'teacher');
        if (teachers.length > 0 && !courseTeacherId) {
          setCourseTeacherId(teachers[0].id);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load admin panel data', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAllData();
    // Poll system health metrics every 15 seconds to simulate resource monitors
    const healthInterval = setInterval(() => {
      api.getSystemHealth().then(health => setSystemHealth(health)).catch(() => {});
    }, 15000);
    return () => clearInterval(healthInterval);
  }, []);

  const handleLogout = () => {
    api.logout().then(() => {
      navigate('/');
    });
  };

  // User Administration Handlers
  const openAddUserModal = () => {
    setEditingUser(null);
    setUserName('');
    setUserEmail('');
    setUserRole('student');
    setUserDept('Computer Science');
    setUserSemester('1st Semester');
    setUserFacultyTitle('Assistant Professor');
    setUserFacultyId('');
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (user) => {
    setEditingUser(user);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserRole(user.role);
    setUserDept(user.department);
    setUserSemester(user.details?.semester || '1st Semester');
    setUserFacultyTitle(user.details?.title || 'Assistant Professor');
    setUserFacultyId(user.details?.facultyId || '');
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) {
      triggerToast('Please provide a name and email.');
      return;
    }

    const userData = {
      name: userName,
      email: userEmail,
      role: userRole,
      department: userDept,
      details: userRole === 'student' 
        ? { semester: userSemester } 
        : { title: userFacultyTitle, facultyId: userFacultyId }
    };

    setLoading(true);

    if (editingUser) {
      // Edit mode
      api.editUser(editingUser.id, userData)
        .then(() => {
          triggerToast(`User "${userName}" updated successfully.`);
          setIsUserModalOpen(false);
          return loadAllData();
        })
        .catch(err => {
          setLoading(false);
          triggerToast('Failed to edit user: ' + err.message);
        });
    } else {
      // Add mode
      api.addUser(userData)
        .then((response) => {
          triggerToast(`User "${userName}" created successfully with username: ${response.user.username}`);
          setIsUserModalOpen(false);
          return loadAllData();
        })
        .catch(err => {
          setLoading(false);
          triggerToast('Failed to add user: ' + err.message);
        });
    }
  };

  const handleDeleteUser = (userId, name) => {
    if (window.confirm(`Are you sure you want to remove user "${name}"?`)) {
      setLoading(true);
      api.deleteUser(userId)
        .then(() => {
          triggerToast(`User "${name}" has been deleted.`);
          return loadAllData();
        })
        .catch(err => {
          setLoading(false);
          triggerToast('Failed to delete user: ' + err.message);
        });
    }
  };

  // Course Administration Handlers
  const openAddCourseModal = () => {
    setCourseCode('');
    setCourseName('');
    setCourseSemester('1st Semester');
    setCourseDept('Computer Science');
    setCourseSchedule('');
    const teachers = users.filter(u => u.role === 'teacher');
    if (teachers.length > 0) {
      setCourseTeacherId(teachers[0].id);
    }
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = (e) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseName.trim()) {
      triggerToast('Please specify course code and name.');
      return;
    }

    const courseData = {
      code: courseCode.trim().toUpperCase(),
      name: courseName,
      semester: courseSemester,
      department: courseDept,
      schedule: courseSchedule || 'TBD',
      teacherId: courseTeacherId
    };

    setLoading(true);
    api.addCourse(courseData)
      .then(() => {
        triggerToast(`Course ${courseCode} successfully created!`);
        setIsCourseModalOpen(false);
        return loadAllData();
      })
      .catch(err => {
        setLoading(false);
        triggerToast('Failed to register course: ' + err.message);
      });
  };

  // AI Configuration Handlers
  const handleSaveAISettings = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const settings = {
      provider: aiProvider,
      temperature: parseFloat(aiTemperature),
      maxTokens: parseInt(aiMaxTokens),
      systemPrompt: aiSystemPrompt
    };

    api.updateAISettings(settings)
      .then(() => {
        triggerToast('AI configuration changes saved successfully.');
        return loadAllData();
      })
      .catch(err => {
        setLoading(false);
        triggerToast('Failed to update settings: ' + err.message);
      });
  };

  const handleTestAI = () => {
    setIsTestingAI(true);
    api.testAIConnection(aiProvider)
      .then((res) => {
        setIsTestingAI(false);
        triggerToast(`Ping Success: Connected to ${aiProvider} in ${res.latencyMs}ms.`);
      })
      .catch(err => {
        setIsTestingAI(false);
        triggerToast(`Ping Failed: ${err.message}`);
      });
  };

  // Filters mapping
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                          user.username.toLowerCase().includes(userSearch.toLowerCase());
    
    const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;
    
    return matchesSearch && matchesRole;
  });

  const filteredCourses = courses.filter(course => {
    return course.name.toLowerCase().includes(courseSearch.toLowerCase()) || 
           course.code.toLowerCase().includes(courseSearch.toLowerCase());
  });

  const facultyMembers = users.filter(u => u.role === 'teacher');

  if (loading && !overviewStats) {
    return (
      <div className="bg-[#e9ecef] font-sans min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003A6A] mx-auto"></div>
          <p className="text-[#003A6A] mt-4 font-semibold">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#e9ecef] font-sans min-h-screen flex flex-col text-[#333]">
      {/* Custom Styles */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
        .dashboard-tab-active {
          border-bottom: 3px solid #FECD0B;
          color: #FECD0B !important;
          font-weight: 600;
        }
        .stats-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.08);
          transition: all 0.25s ease;
        }
      `}</style>

      {/* Top Yellow Line */}
      <div className="w-full h-1 bg-[#FECD0B]"></div>

      {/* Header */}
      <header className="bg-[#003A6A] w-full overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/admin-dashboard">
            <img
              src="https://v1.nitj.ac.in/erp/Images/logo.png"
              alt="NIT Jalandhar Logo"
              className="w-auto max-w-full max-h-12 md:max-h-20 h-auto object-contain"
            />
          </a>

          {/* Admin Info Badge */}
          <div className="flex items-center gap-3 text-white">
            <div className="text-right hidden md:block">
              <p className="font-semibold text-sm">SysAdmin Control</p>
              <p className="text-xs text-yellow-300">Administrator Role</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-850 border-2 border-[#FECD0B] flex items-center justify-center font-bold text-[#FECD0B]">
              AD
            </div>
          </div>
        </div>
      </header>

      {/* Navigation and Tabs */}
      <nav className="bg-[#222] w-full shadow-md text-gray-300">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between sm:h-14 py-2 sm:py-0">
            <span className="text-[#FECD0B] font-bold text-base md:text-lg tracking-wide uppercase">
              | Vidyastra Administration Panel |
            </span>

            <div className="flex items-center space-x-1 sm:space-x-4 mt-2 sm:mt-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-2 text-sm transition-colors hover:text-white cursor-pointer ${activeTab === 'overview' ? 'dashboard-tab-active' : ''}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-3 py-2 text-sm transition-colors hover:text-white cursor-pointer ${activeTab === 'users' ? 'dashboard-tab-active' : ''}`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`px-3 py-2 text-sm transition-colors hover:text-white cursor-pointer ${activeTab === 'courses' ? 'dashboard-tab-active' : ''}`}
              >
                Courses
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`px-3 py-2 text-sm transition-colors hover:text-white cursor-pointer ${activeTab === 'logs' ? 'dashboard-tab-active' : ''}`}
              >
                Audit Logs
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs md:text-sm font-medium transition cursor-pointer ml-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#003A6A] text-white border-l-4 border-[#FECD0B] shadow-2xl px-5 py-3 rounded-lg flex items-center space-x-3 animate-fade-in-up">
          <span className="text-[#FECD0B] font-semibold">ℹ️ Alert:</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 px-4 py-8 max-w-6xl mx-auto w-full animate-fade-in-up">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="stats-card bg-white p-5 rounded-xl shadow-xs border-t-4 border-blue-600 text-center">
                <span className="text-gray-500 text-xs uppercase block font-semibold">Total Students</span>
                <span className="text-3xl font-extrabold text-[#003A6A]">{overviewStats?.totalStudents}</span>
              </div>
              <div className="stats-card bg-white p-5 rounded-xl shadow-xs border-t-4 border-emerald-600 text-center">
                <span className="text-gray-500 text-xs uppercase block font-semibold">Active Faculty</span>
                <span className="text-3xl font-extrabold text-[#003A6A]">{overviewStats?.totalFaculty}</span>
              </div>
              <div className="stats-card bg-white p-5 rounded-xl shadow-xs border-t-4 border-purple-600 text-center">
                <span className="text-gray-500 text-xs uppercase block font-semibold">Registered Courses</span>
                <span className="text-3xl font-extrabold text-[#003A6A]">{overviewStats?.totalCourses}</span>
              </div>
            </div>

          
            {/* Audit Log preview */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h3 className="text-lg font-bold text-[#003A6A]">Recent Administrative Actions</h3>
                <button onClick={() => setActiveTab('logs')} className="text-xs text-[#003A6A] hover:underline font-semibold">View All Logs &rarr;</button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100 text-sm">
                  <thead>
                    <tr className="text-gray-500 font-semibold">
                      <th className="py-2 text-left">Timestamp</th>
                      <th className="py-2 text-left">Action</th>
                      <th className="py-2 text-left">Description</th>
                      <th className="py-2 text-left">User</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {auditLogs.slice(0, 4).map(log => (
                      <tr key={log.id} className="text-gray-700">
                        <td className="py-2.5 whitespace-nowrap text-xs text-gray-450">{log.timestamp}</td>
                        <td className="py-2.5 font-semibold text-[#003A6A]">{log.action}</td>
                        <td className="py-2.5 text-xs max-w-sm truncate">{log.detail}</td>
                        <td className="py-2.5 text-xs"><span className="bg-gray-105 px-2 py-0.5 rounded border">{log.user}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#003A6A]">User Registry</h2>
                <p className="text-gray-550 text-sm">Create, edit, or delete student and faculty logins.</p>
              </div>
              <button
                onClick={openAddUserModal}
                className="bg-[#003A6A] hover:bg-[#004a8a] text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer"
              >
                <span>👤 Add User</span>
              </button>
            </div>

            {/* Filter and search bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search by name, email, username..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-[#003A6A]"
              />
              <select
                value={userRoleFilter}
                onChange={e => setUserRoleFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-[#003A6A]"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="teacher">Faculty</option>
                <option value="admin">Administrators</option>
              </select>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-gray-500 font-semibold">
                    <th className="px-4 py-3 text-left">User Profile</th>
                    <th className="px-4 py-3 text-left">Username</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Department</th>
                    <th className="px-4 py-3 text-left">Semester / Title</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-gray-500 italic">No users found matching search criteria.</td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-semibold text-gray-800">{user.name}</div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs font-mono">{user.username}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-700">{user.department}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                          {user.role === 'student' ? user.details?.semester : user.details?.title || 'N/A'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center space-x-2">
                          <button
                            onClick={() => openEditUserModal(user)}
                            className="text-[#003A6A] hover:underline font-semibold text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="text-red-600 hover:underline font-semibold text-xs"
                          >
                            Delete
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

        {/* TAB 3: COURSE REGISTRY */}
        {activeTab === 'courses' && (
          <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#003A6A]">Course Administration</h2>
                <p className="text-gray-550 text-sm">Create course catalogs and map instructors.</p>
              </div>
              <button
                onClick={openAddCourseModal}
                className="bg-[#003A6A] hover:bg-[#004a8a] text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer"
              >
                <span>📚 Register Course</span>
              </button>
            </div>

            {/* Course Search */}
            <input
              type="text"
              placeholder="Search courses by code or title..."
              value={courseSearch}
              onChange={e => setCourseSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-[#003A6A]"
            />

            {/* Courses Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-gray-500 font-semibold">
                    <th className="px-4 py-3 text-left">Code</th>
                    <th className="px-4 py-3 text-left">Course Name</th>
                    <th className="px-4 py-3 text-left">Instructor</th>
                    <th className="px-4 py-3 text-left">Semester</th>
                    <th className="px-4 py-3 text-left">Dept</th>
                    <th className="px-4 py-3 text-center">Enrollment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCourses.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-gray-500 italic">No courses registered.</td>
                    </tr>
                  ) : (
                    filteredCourses.map(course => {
                      const instructor = users.find(u => u.id === course.teacherId);
                      return (
                        <tr key={course.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap"><span className="bg-[#003A6A] text-[#FECD0B] text-xs font-bold px-2 py-0.5 rounded">{course.code}</span></td>
                          <td className="px-4 py-3 font-semibold text-gray-800">{course.name}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-700 font-medium">{instructor ? instructor.name : 'Unassigned'}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-500">{course.semester}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-550">{course.department}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-center font-bold text-gray-800">{course.students} Students</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {/* TAB 4: AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-[#003A6A]">Platform Security Audit Logs</h2>
              <p className="text-gray-550 text-sm">Chronological system events and administrative mutations.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-gray-550 font-semibold">
                    <th className="px-4 py-3 text-left">Timestamp</th>
                    <th className="px-4 py-3 text-left">Action Area</th>
                    <th className="px-4 py-3 text-left">Detailed System Operations</th>
                    <th className="px-4 py-3 text-left">User Context</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-700">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-400 font-mono">{log.timestamp}</td>
                      <td className="px-4 py-3 font-semibold text-[#003A6A]">{log.action}</td>
                      <td className="px-4 py-3 text-xs leading-relaxed max-w-lg">{log.detail}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs"><span className="bg-gray-100 text-gray-650 px-2 py-0.5 rounded border border-gray-200 font-medium">{log.user}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#003A6A] w-full mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <p className="text-white text-xs md:text-sm text-center">
            Copyright 2026 &copy; NIT Jalandhar
          </p>
        </div>
      </footer>

      {/* USER MODAL (ADD / EDIT) */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsUserModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up border-t-8 border-[#003A6A]">
            <button
              onClick={() => setIsUserModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-[#003A6A] mb-4">
              {editingUser ? `Edit User Profile: ${editingUser.username}` : 'Register New User'}
            </h3>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Aman Sharma"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-[#003A6A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  placeholder="e.g. aman.sharma@nitj.ac.in"
                  value={userEmail}
                  onChange={e => setUserEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-[#003A6A]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">System Role</label>
                <select
                  value={userRole}
                  onChange={e => setUserRole(e.target.value)}
                  disabled={!!editingUser}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-[#003A6A] disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Faculty / Teacher</option>
                  <option value="admin">Platform Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Department</label>
                <select
                  value={userDept}
                  onChange={e => setUserDept(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-[#003A6A]"
                >
                  <option value="Computer Science">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="IT Infrastructure">IT Infrastructure (System)</option>
                </select>
              </div>

              {/* Conditional Fields based on Role */}
              {userRole === 'student' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Academic Semester</label>
                  <select
                    value={userSemester}
                    onChange={e => setUserSemester(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-[#003A6A]"
                  >
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="3rd Semester">3rd Semester</option>
                    <option value="4th Semester">4th Semester</option>
                    <option value="5th Semester">5th Semester</option>
                    <option value="6th Semester">6th Semester</option>
                    <option value="7th Semester">7th Semester</option>
                    <option value="8th Semester">8th Semester</option>
                  </select>
                </div>
              )}

              {userRole === 'teacher' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Designation</label>
                    <select
                      value={userFacultyTitle}
                      onChange={e => setUserFacultyTitle(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-[#003A6A]"
                    >
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Professor">Professor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Faculty ID Code *</label>
                    <input
                      type="text"
                      placeholder="e.g. CSE-U7"
                      value={userFacultyId}
                      onChange={e => setUserFacultyId(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-[#003A6A]"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="flex-1 border border-gray-300 text-gray-700 text-sm font-semibold py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#003A6A] hover:bg-[#004a8a] text-white text-sm font-semibold py-2 rounded-lg cursor-pointer"
                >
                  Confirm Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COURSE MODAL */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsCourseModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in-up border-t-8 border-[#003A6A]">
            <button
              onClick={() => setIsCourseModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-[#003A6A] mb-4">Register New Course</h3>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Course Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. CS302"
                    value={courseCode}
                    onChange={e => setCourseCode(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-[#003A6A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Semester</label>
                  <select
                    value={courseSemester}
                    onChange={e => setCourseSemester(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-[#003A6A]"
                  >
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="3rd Semester">3rd Semester</option>
                    <option value="4th Semester">4th Semester</option>
                    <option value="5th Semester">5th Semester</option>
                    <option value="6th Semester">6th Semester</option>
                    <option value="7th Semester">7th Semester</option>
                    <option value="8th Semester">8th Semester</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Course Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Database Management Systems"
                  value={courseName}
                  onChange={e => setCourseName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-[#003A6A]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Department</label>
                  <select
                    value={courseDept}
                    onChange={e => setCourseDept(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-[#003A6A]"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Communication">Electronics & Comm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Lectures Schedule</label>
                  <input
                    type="text"
                    placeholder="e.g. Mon, Wed (11:30 AM)"
                    value={courseSchedule}
                    onChange={e => setCourseSchedule(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-[#003A6A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Assign Faculty / Instructor</label>
                <select
                  value={courseTeacherId}
                  onChange={e => setCourseTeacherId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-[#003A6A]"
                >
                  {facultyMembers.length === 0 ? (
                    <option value="">No instructors registered</option>
                  ) : (
                    facultyMembers.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                    ))
                  )}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="flex-1 border border-gray-300 text-gray-700 text-sm font-semibold py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#003A6A] hover:bg-[#004a8a] text-white text-sm font-semibold py-2 rounded-lg cursor-pointer"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
