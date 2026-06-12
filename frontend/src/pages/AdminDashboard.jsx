import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';

const AdminDashboard = ({ user, onLogout, onNavigate, lectures }) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, academics, live, recorded, quiz, reports, settings, announcements

  // Notification items matching mockup
  const notifications = [
    { text: "System Alert: High CPU usage on Streaming server", tab: "settings" },
    { text: "New Teacher Registration: Dr. Amit Singh", tab: "users" },
    { text: "Live Class Alert: 5 ongoing sessions today", tab: "live" }
  ];

  // Active sidebars
  const sidebarItems = [
    { id: 'overview', label: 'Dashboard', icon: 'glyphicon-home' },
    { id: 'users', label: 'User Management', icon: 'glyphicon-user', hasSubmenu: true },
    { id: 'academics', label: 'Academic Management', icon: 'glyphicon-education', hasSubmenu: true },
    { id: 'live', label: 'Live Classes', icon: 'glyphicon-facetime-video' },
    { id: 'recorded', label: 'Recorded Lectures', icon: 'glyphicon-film' },
    { id: 'quiz', label: 'Quiz & Assessments', icon: 'glyphicon-check', hasSubmenu: true },
    { id: 'reports', label: 'Reports & Analytics', icon: 'glyphicon-stats', hasSubmenu: true },
    { id: 'settings', label: 'System Settings', icon: 'glyphicon-cog', hasSubmenu: true },
    { id: 'announcements', label: 'Announcements', icon: 'glyphicon-bullhorn', hasSubmenu: true }
  ];

  // Active teacher data
  const teachers = [
    { id: 1, name: 'Dr. Sarah Verma', dept: 'Computer Science & Engineering', email: 'sarah.verma@nitj.ac.in', status: 'Active' },
    { id: 2, name: 'Dr. Amit Singh', dept: 'Computer Science & Engineering', email: 'amit.singh@nitj.ac.in', status: 'Active' },
    { id: 3, name: 'Dr. Neha Gupta', dept: 'Information Technology', email: 'neha.gupta@nitj.ac.in', status: 'Active' },
    { id: 4, name: 'Dr. Rajesh Kumar', dept: 'Physics', email: 'rajesh.kumar@nitj.ac.in', status: 'Active' },
    { id: 5, name: 'Dr. Pawan Kumar', dept: 'Computer Science & Engineering', email: 'pawan.kumar@nitj.ac.in', status: 'Active' }
  ];

  // Active student data
  const students = [
    { id: 1, name: 'Aarav Sharma', roll: '24103011', dept: 'Computer Science', email: 'aarav.sharma@nitj.ac.in', status: 'Active' },
    { id: 2, name: 'Riya Verma', roll: '24103012', dept: 'Computer Science', email: 'riya.verma@nitj.ac.in', status: 'Active' },
    { id: 3, name: 'Karan Mehta', roll: '24103013', dept: 'Computer Science', email: 'karan.mehta@nitj.ac.in', status: 'Active' },
    { id: 4, name: 'Amit Sharma', roll: '24103001', dept: 'Computer Science', email: 'amit.sharma@nitj.ac.in', status: 'Active' },
    { id: 5, name: 'Priya Patel', roll: '24103002', dept: 'Computer Science', email: 'priya.patel@nitj.ac.in', status: 'Active' }
  ];

  // Recent Live Classes Mockup Data
  const recentLiveClasses = [
    { subject: 'Web Development', classCode: 'CSE - 2A', instructor: 'Dr. Sarah Verma', joined: 42 },
    { subject: 'Data Structures', classCode: 'CSE - 2B', instructor: 'Dr. Amit Singh', joined: 38 },
    { subject: 'Database Management System', classCode: 'IT - 2A', instructor: 'Dr. Neha Gupta', joined: 35 },
    { subject: 'Mathematics III', classCode: 'CSE - 2A', instructor: 'Dr. Rajesh Kumar', joined: 28 },
    { subject: 'Computer Organization', classCode: 'CSE - 2B', instructor: 'Dr. Pawan Kumar', joined: 25 }
  ];

  // Department Overview Table Data
  const departments = [
    { name: 'Computer Science & Engineering', students: 612, teachers: 28, subjects: 12 },
    { name: 'Information Technology', students: 284, teachers: 16, subjects: 8 },
    { name: 'Electronics & Communication Engg.', students: 198, teachers: 12, subjects: 5 },
    { name: 'Mechanical Engineering', students: 92, teachers: 8, subjects: 3 },
    { name: 'Civil Engineering', students: 62, teachers: 6, subjects: 2 }
  ];

  // Recent Registrations Data
  const recentRegistrations = [
    { name: 'Aarav Sharma', email: 'aarav.sharma@nitj.ac.in', role: 'Student', time: '2 hours ago', colorClass: 'subj-color-purple', initials: 'AS' },
    { name: 'Neha Gupta', email: 'neha.gupta@nitj.ac.in', role: 'Teacher', time: '5 hours ago', colorClass: 'subj-color-purple', initials: 'NG' },
    { name: 'Riya Verma', email: 'riya.verma@nitj.ac.in', role: 'Student', time: '1 day ago', colorClass: 'subj-color-green', initials: 'RV' },
    { name: 'Amit Singh', email: 'amit.singh@nitj.ac.in', role: 'Teacher', time: '1 day ago', colorClass: 'subj-color-green', initials: 'AS' },
    { name: 'Karan Mehta', email: 'karan.mehta@nitj.ac.in', role: 'Student', time: '2 days ago', colorClass: 'subj-color-blue', initials: 'KM' }
  ];

  // System Status Services Checklist
  const systemServices = [
    { name: 'Live Streaming Service', status: 'Operational' },
    { name: 'AI Quiz Engine', status: 'Operational' },
    { name: 'Video Storage', status: 'Operational' },
    { name: 'Database', status: 'Operational' },
    { name: 'Authentication Service', status: 'Operational' }
  ];

  return (
    <DashboardLayout
      user={user}
      onLogout={onLogout}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      sidebarItems={sidebarItems}
      dashboardTitle="Admin Dashboard"
      roleLabel="Administrator"
      roleBadgeClass="admin"
      notificationCount={5}
      notifications={notifications}
    >
      {/* Admin specific CSS */}
      <style>{`
        .admin-panels-grid-3 {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }
        @media (max-width: 1200px) {
          .admin-panels-grid-3 {
            grid-template-columns: 1fr;
          }
        }
        
        /* Live badge for classes */
        .badge-live-red {
          background-color: #fef2f2;
          color: #ef4444;
          font-size: 10px;
          font-weight: bold;
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid #fee2e2;
        }
        
        /* Donut Chart details */
        .chart-legend-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 12px;
          margin-top: 12px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .legend-label {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        
        /* Registrations initial circles */
        .reg-avatar {
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
        .subj-color-green { background-color: #f0fdf4; color: #15803d; }
        .subj-color-purple { background-color: #faf5ff; color: #7e22ce; }
        
        /* System status badges */
        .badge-operational {
          background-color: #dcfce7;
          color: #16a34a;
          font-size: 11px;
          font-weight: bold;
          padding: 2px 8px;
          border-radius: 4px;
        }
      `}</style>

      {/* A. PLATFORM OVERVIEW (DASHBOARD) TAB */}
      {activeTab === 'overview' && (
        <div className="animate-fade-in">
          <div className="greeting-section">
            <div>
              <h1 className="greeting-title">Welcome back, Admin! 👋</h1>
              <p className="greeting-sub">Here's what's happening on VidyastraAI today.</p>
            </div>
            <div className="date-box">
              <span className="glyphicon glyphicon-calendar"></span>
              <span>Monday, 09 June 2026</span>
            </div>
          </div>

          {/* 6 Stats Cards row */}
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px' }}>
            <StatCard 
              icon="glyphicon-user" 
              count="1,248" 
              label="Total Students" 
              subtext="+48 this week" 
              subtextColorClass="text-success"
              iconBgColorClass="color-blue-bg"
              onClick={() => setActiveTab('users')}
            />
            <StatCard 
              icon="glyphicon-user" 
              count="78" 
              label="Total Teachers" 
              subtext="+6 this week" 
              subtextColorClass="text-success"
              iconBgColorClass="color-green-bg"
              onClick={() => setActiveTab('users')}
            />
            <StatCard 
              icon="glyphicon-home" 
              count="6" 
              label="Departments" 
              subtext="--" 
              subtextColorClass="text-muted"
              iconBgColorClass="color-purple-bg"
              onClick={() => setActiveTab('academics')}
            />
            <StatCard 
              icon="glyphicon-book" 
              count="28" 
              label="Subjects" 
              subtext="+3 this week" 
              subtextColorClass="text-success"
              iconBgColorClass="color-orange-bg"
              onClick={() => setActiveTab('academics')}
            />
            <StatCard 
              icon="glyphicon-signal" 
              count="18" 
              label="Live Classes Today" 
              subtext="+ Live Now" 
              subtextColorClass="text-danger"
              iconBgColorClass="color-red-bg"
              onClick={() => setActiveTab('live')}
            />
            <StatCard 
              icon="glyphicon-film" 
              count="342" 
              label="Lectures Completed" 
              subtext="+32 this week" 
              subtextColorClass="text-success"
              iconBgColorClass="color-blue-bg"
              onClick={() => setActiveTab('recorded')}
            />
          </div>

          {/* Grid Row 1 (Platform Overview, Live Classes, Users Summary) */}
          <div className="admin-panels-grid-3">
            {/* Column 1: Weekly Line Chart */}
            <div className="panel-card-new">
              <div className="panel-header-new">
                <h2 className="panel-title-new">
                  <span className="glyphicon glyphicon-signal"></span> Platform Overview
                </h2>
                <select className="form-select-new" style={{ padding: '2px 8px', fontSize: '11px' }}>
                  <option>This Week</option>
                  <option>Last Week</option>
                </select>
              </div>

              {/* SVG Line Chart */}
              <div className="platform-chart-container" style={{ position: 'relative', width: '100%', height: '180px', marginTop: '10px' }}>
                <svg viewBox="0 0 400 160" style={{ width: '100%', height: '100%' }}>
                  {/* Grid Lines */}
                  <line x1="40" y1="10" x2="380" y2="10" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="45" x2="380" y2="45" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="80" x2="380" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="115" x2="380" y2="115" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="140" x2="380" y2="140" stroke="#e2e8f0" strokeWidth="1.5" />

                  {/* Y Axis Labels */}
                  <text x="10" y="15" fill="#94a3b8" fontSize="8" fontWeight="bold">400</text>
                  <text x="10" y="50" fill="#94a3b8" fontSize="8" fontWeight="bold">300</text>
                  <text x="10" y="85" fill="#94a3b8" fontSize="8" fontWeight="bold">200</text>
                  <text x="10" y="120" fill="#94a3b8" fontSize="8" fontWeight="bold">100</text>
                  <text x="20" y="145" fill="#94a3b8" fontSize="8" fontWeight="bold">0</text>

                  {/* X Axis Labels */}
                  <text x="40" y="155" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">03 Jun</text>
                  <text x="96" y="155" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">04 Jun</text>
                  <text x="152" y="155" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">05 Jun</text>
                  <text x="208" y="155" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">06 Jun</text>
                  <text x="264" y="155" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">07 Jun</text>
                  <text x="320" y="155" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">08 Jun</text>
                  <text x="376" y="155" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">09 Jun</text>

                  {/* Lines & Points */}
                  {/* Line 1: Students Active (Blue) */}
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    points="40,80  96,60  152,55  208,70  264,45  320,58  376,30"
                  />
                  <circle cx="40" cy="80" r="3.5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
                  <circle cx="96" cy="60" r="3.5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
                  <circle cx="152" cy="55" r="3.5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
                  <circle cx="208" cy="70" r="3.5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
                  <circle cx="264" cy="45" r="3.5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
                  <circle cx="320" cy="58" r="3.5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
                  <circle cx="376" cy="30" r="3.5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />

                  {/* Line 2: Live Classes (Green) */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    points="40,110  96,102  152,100  208,110  264,100  320,105  376,90"
                  />
                  <circle cx="40" cy="110" r="3" fill="#10b981" stroke="white" strokeWidth="1" />
                  <circle cx="96" cy="102" r="3" fill="#10b981" stroke="white" strokeWidth="1" />
                  <circle cx="152" cy="100" r="3" fill="#10b981" stroke="white" strokeWidth="1" />
                  <circle cx="208" cy="110" r="3" fill="#10b981" stroke="white" strokeWidth="1" />
                  <circle cx="264" cy="100" r="3" fill="#10b981" stroke="white" strokeWidth="1" />
                  <circle cx="320" cy="105" r="3" fill="#10b981" stroke="white" strokeWidth="1" />
                  <circle cx="376" cy="90" r="3" fill="#10b981" stroke="white" strokeWidth="1" />

                  {/* Line 3: Lectures Completed (Purple) */}
                  <polyline
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2"
                    points="40,140  96,132  152,130  208,128  264,136  320,125  376,120"
                  />
                  <circle cx="40" cy="140" r="3" fill="#a855f7" stroke="white" strokeWidth="1" />
                  <circle cx="96" cy="132" r="3" fill="#a855f7" stroke="white" strokeWidth="1" />
                  <circle cx="152" cy="130" r="3" fill="#a855f7" stroke="white" strokeWidth="1" />
                  <circle cx="208" cy="128" r="3" fill="#a855f7" stroke="white" strokeWidth="1" />
                  <circle cx="264" cy="136" r="3" fill="#a855f7" stroke="white" strokeWidth="1" />
                  <circle cx="320" cy="125" r="3" fill="#a855f7" stroke="white" strokeWidth="1" />
                  <circle cx="376" cy="120" r="3" fill="#a855f7" stroke="white" strokeWidth="1" />
                </svg>
              </div>

              {/* Legends Row */}
              <div style={{ display: 'flex', gap: '16px', fontSize: '10px', fontWeight: 'bold', justifyContent: 'center', marginTop: '10px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e3a8a' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></span>
                  Students Active
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#064e3b' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></span>
                  Live Classes
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#581c87' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#a855f7', borderRadius: '50%' }}></span>
                  Lectures Completed
                </span>
              </div>
            </div>

            {/* Column 2: Recent Live Classes */}
            <div className="panel-card-new">
              <div className="panel-header-new">
                <h2 className="panel-title-new">
                  <span className="glyphicon glyphicon-facetime-video"></span> Recent Live Classes
                </h2>
                <span className="badge-live-pill" style={{ backgroundColor: '#ef4444' }}>Live Now</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                {recentLiveClasses.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', borderBottom: '1px solid #f3f4f6', paddingBottom: '6px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <strong style={{ color: '#002e5b' }}>{item.subject}</strong>
                      <span style={{ fontSize: '11px', color: '#6b7280' }}>{item.classCode} • {item.instructor}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold' }}>
                        👤 {item.joined}
                      </span>
                      <span className="badge-live-red">LIVE</span>
                    </div>
                  </div>
                ))}
              </div>
              <span className="link-blue-new" style={{ textAlign: 'center', display: 'block', marginTop: '10px' }} onClick={() => setActiveTab('live')}>
                View All Live Classes ➔
              </span>
            </div>

            {/* Column 3: Users Summary Ring Chart */}
            <div className="panel-card-new">
              <div className="panel-header-new">
                <h2 className="panel-title-new">
                  <span className="glyphicon glyphicon-user"></span> Users Summary
                </h2>
              </div>

              {/* Donut Chart and Legend */}
              <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: '14px', alignItems: 'center', flex: 1 }}>
                <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                  <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%' }}>
                    {/* Circle 1: Students (89.2%): strokeDashoffset = 0 */}
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#3b82f6" strokeWidth="16" strokeDasharray="314.16" strokeDashoffset="0" transform="rotate(-90 60 60)" />
                    {/* Circle 2: Teachers (5.6%): offset = 280.2 */}
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#10b981" strokeWidth="16" strokeDasharray="314.16" strokeDashoffset="-280.2" transform="rotate(-90 60 60)" />
                    {/* Circle 3: HODs (0.9%): offset = 297.8 */}
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#f59e0b" strokeWidth="16" strokeDasharray="314.16" strokeDashoffset="-297.8" transform="rotate(-90 60 60)" />
                    {/* Circle 4: Admins (0.3%): offset = 300.6 */}
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#a855f7" strokeWidth="16" strokeDasharray="314.16" strokeDashoffset="-300.6" transform="rotate(-90 60 60)" />
                    {/* Circle 5: Others (0.6%): offset = 301.5 */}
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#ef4444" strokeWidth="16" strokeDasharray="314.16" strokeDashoffset="-301.5" transform="rotate(-90 60 60)" />
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                    <strong style={{ fontSize: '14px', color: '#002e5b' }}>1.4K</strong>
                    <div style={{ fontSize: '9px', color: '#9ca3af', fontWeight: 'bold' }}>Total</div>
                  </div>
                </div>

                <div className="chart-legend-grid">
                  <div className="legend-item">
                    <span className="legend-label">
                      <span className="legend-dot" style={{ backgroundColor: '#3b82f6' }} />
                      Students
                    </span>
                    <strong>1,248 (89.2%)</strong>
                  </div>
                  <div className="legend-item">
                    <span className="legend-label">
                      <span className="legend-dot" style={{ backgroundColor: '#10b981' }} />
                      Teachers
                    </span>
                    <strong>78 (5.6%)</strong>
                  </div>
                  <div className="legend-item">
                    <span className="legend-label">
                      <span className="legend-dot" style={{ backgroundColor: '#f59e0b' }} />
                      HODs
                    </span>
                    <strong>12 (0.9%)</strong>
                  </div>
                  <div className="legend-item">
                    <span className="legend-label">
                      <span className="legend-dot" style={{ backgroundColor: '#a855f7' }} />
                      Admins
                    </span>
                    <strong>4 (0.3%)</strong>
                  </div>
                  <div className="legend-item">
                    <span className="legend-label">
                      <span className="legend-dot" style={{ backgroundColor: '#ef4444' }} />
                      Others
                    </span>
                    <strong>8 (0.6%)</strong>
                  </div>
                </div>
              </div>
              <span className="link-blue-new" style={{ textAlign: 'center', display: 'block', marginTop: '10px' }} onClick={() => setActiveTab('users')}>
                View All Users ➔
              </span>
            </div>
          </div>

          {/* Grid Row 2 (Department Overview, Recent Registrations, System Status) */}
          <div className="admin-panels-grid-3">
            {/* Column 1: Department Overview */}
            <div className="panel-card-new">
              <div className="panel-header-new">
                <h2 className="panel-title-new">
                  <span className="glyphicon glyphicon-home"></span> Department Overview
                </h2>
                <span className="link-blue-new" onClick={() => setActiveTab('academics')}>View All</span>
              </div>

              <div className="table-responsive-new" style={{ flex: 1 }}>
                <table className="custom-table-new" style={{ fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Students</th>
                      <th>Teachers</th>
                      <th>Subjects</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: '600', color: '#002e5b' }}>{dept.name}</td>
                        <td>{dept.students}</td>
                        <td>{dept.teachers}</td>
                        <td>{dept.subjects}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Column 2: Recent Registrations logs */}
            <div className="panel-card-new">
              <div className="panel-header-new">
                <h2 className="panel-title-new">
                  <span className="glyphicon glyphicon-user"></span> Recent Registrations
                </h2>
                <span className="link-blue-new" onClick={() => setActiveTab('users')}>View All</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                {recentRegistrations.map((item, idx) => (
                  <div key={idx} className="subject-roster-item" style={{ border: 'none', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className={`reg-avatar ${item.colorClass}`}>{item.initials}</div>
                      <div className="upcoming-meta-left" style={{ gap: '2px' }}>
                        <span className="upcoming-subject" style={{ fontSize: '13px' }}>{item.name}</span>
                        <span className="upcoming-teacher" style={{ fontSize: '10px' }}>{item.email}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                      <span style={{ 
                        fontSize: '9px', 
                        fontWeight: 'bold', 
                        padding: '1px 6px', 
                        borderRadius: '4px',
                        backgroundColor: item.role === 'Teacher' ? '#eff6ff' : '#f0fdf4',
                        color: item.role === 'Teacher' ? '#1d4ed8' : '#15803d'
                      }}>
                        {item.role}
                      </span>
                      <span style={{ fontSize: '9px', color: '#9ca3af' }}>{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: System Status operational checklist */}
            <div className="panel-card-new">
              <div className="panel-header-new">
                <h2 className="panel-title-new">
                  <span className="glyphicon glyphicon-cog"></span> System Status
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, padding: '5px 0' }}>
                {systemServices.map((service, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', borderBottom: '1px solid #f3f4f6', paddingBottom: '6px' }}>
                    <span style={{ color: '#4b5563', fontWeight: '500' }}>{service.name}</span>
                    <span className="badge-operational">Operational</span>
                  </div>
                ))}
              </div>

              <span className="link-blue-new" style={{ textAlign: 'center', display: 'block', marginTop: '10px' }} onClick={() => setActiveTab('settings')}>
                View System Logs ➔
              </span>
            </div>
          </div>
        </div>
      )}

      {/* B. USER MANAGEMENT TAB */}
      {activeTab === 'users' && (
        <div className="animate-fade-in">
          <h2 className="erp-page-title">
            <span className="glyphicon glyphicon-user"></span> User Management Panel
          </h2>

          <div className="row">
            {/* Left Column: Teachers Directory */}
            <div className="col-md-6">
              <div className="panel-card-new">
                <div className="panel-header-new">
                  <h3 className="panel-title-new" style={{ color: '#16a34a' }}>
                    <span className="glyphicon glyphicon-education"></span> Faculty Directory ({teachers.length})
                  </h3>
                  <button className="btn-solid-new" style={{ fontSize: '11px', padding: '3px 8px', backgroundColor: '#16a34a' }} onClick={() => alert("Simulated: Add New Teacher Faculty Profile")}>
                    + Add Faculty
                  </button>
                </div>

                <div className="table-responsive-new">
                  <table className="custom-table-new">
                    <thead>
                      <tr>
                        <th>Faculty Name</th>
                        <th>Department</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map(t => (
                        <tr key={t.id}>
                          <td style={{ fontWeight: 'bold', color: '#002e5b' }}>{t.name}</td>
                          <td>{t.dept}</td>
                          <td>
                            <span className="badge-operational" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>Active</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Students Directory */}
            <div className="col-md-6">
              <div className="panel-card-new">
                <div className="panel-header-new">
                  <h3 className="panel-title-new" style={{ color: '#1d4ed8' }}>
                    <span className="glyphicon glyphicon-user"></span> Enrolled Students ({students.length})
                  </h3>
                  <button className="btn-solid-new" style={{ fontSize: '11px', padding: '3px 8px' }} onClick={() => alert("Simulated: Add New Student Entry")}>
                    + Register Student
                  </button>
                </div>

                <div className="table-responsive-new">
                  <table className="custom-table-new">
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Roll Number</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(s => (
                        <tr key={s.id}>
                          <td style={{ fontWeight: 'bold', color: '#002e5b' }}>{s.name}</td>
                          <td>{s.roll}</td>
                          <td>
                            <span className="badge-operational" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>Active</span>
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

      {/* C. ACADEMIC MANAGEMENT TAB */}
      {activeTab === 'academics' && (
        <div className="animate-fade-in">
          <h2 className="erp-page-title">
            <span className="glyphicon glyphicon-education"></span> Academic Departments & Curriculum
          </h2>

          <div className="panel-card-new">
            <div className="panel-header-new">
              <h3 className="panel-title-new">Institution Department Roster</h3>
            </div>

            <div className="table-responsive-new">
              <table className="custom-table-new">
                <thead>
                  <tr>
                    <th>Department Description</th>
                    <th>Students Registered</th>
                    <th>Faculty Count</th>
                    <th>Subjects Configured</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 'bold', color: '#002e5b' }}>{dept.name}</td>
                      <td>{dept.students}</td>
                      <td>{dept.teachers}</td>
                      <td>{dept.subjects} subjects</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* D. LIVE CLASSES MONITOR */}
      {activeTab === 'live' && (
        <div className="animate-fade-in">
          <h2 className="erp-page-title">
            <span className="glyphicon glyphicon-facetime-video"></span> Live Session Monitoring
          </h2>

          <div className="panel-card-new">
            <div className="panel-header-new">
              <h3 className="panel-title-new">Active Classrooms Log</h3>
              <span className="badge-red-pill">● 5 LIVE SESSIONS TODAY</span>
            </div>

            <div className="table-responsive-new">
              <table className="custom-table-new">
                <thead>
                  <tr>
                    <th>Active Course Subject</th>
                    <th>Classroom Section</th>
                    <th>Lecturer</th>
                    <th>Students Joined</th>
                    <th>Status Badge</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLiveClasses.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 'bold', color: '#002e5b' }}>{item.subject}</td>
                      <td>{item.classCode}</td>
                      <td>{item.instructor}</td>
                      <td style={{ fontWeight: 'bold', color: '#16a34a' }}>{item.joined} / 58</td>
                      <td>
                        <span className="badge-live-red">LIVE</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* E. RECORDED LECTURES ARCHIVES */}
      {activeTab === 'recorded' && (
        <div className="animate-fade-in">
          <h2 className="erp-page-title">
            <span className="glyphicon glyphicon-film"></span> Completed Lectures Archives
          </h2>

          <div className="panel-card-new">
            {lectures.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>
                No completed lecture records archived on portal yet.
              </div>
            ) : (
              <div className="table-responsive-new">
                <table className="custom-table-new">
                  <thead>
                    <tr>
                      <th>Topic Name</th>
                      <th>Class Code</th>
                      <th>Record Date</th>
                      <th>Duration Log</th>
                      <th>Captions Compiled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lectures.map((lec, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 'bold', color: '#002e5b' }}>{lec.topic}</td>
                        <td>{lec.class || 'CSE - 2A'}</td>
                        <td>{lec.date}</td>
                        <td>{lec.duration}</td>
                        <td>
                          <span style={{ fontSize: '11px', color: '#6b7280' }}>
                            {lec.transcript && lec.transcript.length > 0 ? `${lec.transcript.length} captions generated` : 'No captions logged'}
                          </span>
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

      {/* F. QUIZ & ASSESSMENTS */}
      {activeTab === 'quiz' && (
        <div className="animate-fade-in">
          <h2 className="erp-page-title">
            <span className="glyphicon glyphicon-check"></span> Quiz & Assessments Manager
          </h2>

          <div className="panel-card-new">
            <div className="panel-header-new">
              <h3 className="panel-title-new">AI quiz engine status</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.6' }}>
              The VidyastraAI quiz generator automatically recommends classroom check questions for lecturers.
              A total of <b>6 recommended AI questions</b> have been logged on system database.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '10px' }}>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                <strong style={{ color: '#002e5b', display: 'block', fontSize: '14px', marginBottom: '8px' }}>Active Quizzes Today</strong>
                <span style={{ fontSize: '24px', fontWeight: 'bold' }}>18</span>
              </div>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                <strong style={{ color: '#002e5b', display: 'block', fontSize: '14px', marginBottom: '8px' }}>AI suggested quizzes</strong>
                <span style={{ fontSize: '24px', fontWeight: 'bold' }}>6</span>
              </div>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                <strong style={{ color: '#002e5b', display: 'block', fontSize: '14px', marginBottom: '8px' }}>Student submittals</strong>
                <span style={{ fontSize: '24px', fontWeight: 'bold' }}>124</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* G. REPORTS & ANALYTICS */}
      {activeTab === 'reports' && (
        <div className="animate-fade-in">
          <h2 className="erp-page-title">
            <span className="glyphicon glyphicon-stats"></span> Reports & Platform Statistics
          </h2>

          <div className="row">
            <div className="col-md-6">
              <div className="panel-card-new">
                <div className="panel-header-new">
                  <h3 className="panel-title-new">Classroom Participation Trends</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#4b5563', display: 'block', marginBottom: '4px' }}>Web Development</span>
                    <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '92%', backgroundColor: '#002e5b' }}></div>
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#4b5563', display: 'block', marginBottom: '4px' }}>Data Structures</span>
                    <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '84%', backgroundColor: '#3b82f6' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="panel-card-new">
                <div className="panel-header-new">
                  <h3 className="panel-title-new">Operational metrics</h3>
                </div>
                <ul style={{ fontSize: '13px', color: '#4b5563', lineHeight: '2' }}>
                  <li>Average live caption lag: <b>0.8s</b></li>
                  <li>Database transactions: <b>1,424/sec</b></li>
                  <li>Webcam stream delay rate: <b>120ms</b></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* H. SYSTEM CONFIGURATIONS */}
      {activeTab === 'settings' && (
        <div className="animate-fade-in">
          <h2 className="erp-page-title">
            <span className="glyphicon glyphicon-cog"></span> System configurations
          </h2>

          <div className="panel-card-new" style={{ maxWidth: '600px' }}>
            <h4 style={{ margin: '0 0 16px 0', color: '#002e5b', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px' }}>Security & Platform Parameters</h4>
            
            <div className="form-group-new" style={{ marginBottom: '12px' }}>
              <label>Institute Name</label>
              <input type="text" className="form-input-new" defaultValue="Dr B R Ambedkar National Institute of Technology Jalandhar" disabled />
            </div>

            <div className="form-group-new" style={{ marginBottom: '12px' }}>
              <label>Live Streaming Server Endpoint</label>
              <input type="text" className="form-input-new" defaultValue="rtmp://v1.nitj.ac.in:1935/live" disabled />
            </div>

            <div className="form-group-new" style={{ marginBottom: '16px' }}>
              <label>AI Capable Quiz Suggestions</label>
              <select className="form-select-new" defaultValue="Enabled">
                <option value="Enabled">Enabled (Keyword search on live captions transcript)</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>

            <button className="btn-solid-new" onClick={() => alert("Admin Configurations saved successfully!")}>
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* I. ANNOUNCEMENTS CONTROL */}
      {activeTab === 'announcements' && (
        <div className="animate-fade-in">
          <h2 className="erp-page-title">
            <span className="glyphicon glyphicon-bullhorn"></span> Announcements Control Board
          </h2>

          <div className="row">
            <div className="col-md-8">
              <div className="panel-card-new" style={{ gap: '16px' }}>
                <div style={{ borderLeft: '4px solid #002e5b', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '0 8px 8px 0' }}>
                  <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                    <strong>FROM: ADMINISTRATOR</strong>
                    <span>12 June 2026</span>
                  </div>
                  <h4 style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: '#002e5b' }}>System Maintenance Notice</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#4b5563' }}>
                    The classroom simulator portal will undergo server maintenance on Saturday from 10:00 PM to midnight.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="panel-card-new">
                <div className="panel-header-new">
                  <h3 className="panel-title-new">📢 Create Global Notice</h3>
                </div>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  alert("Global announcement published successfully!");
                  e.target.reset();
                }}>
                  <div className="form-group-new" style={{ marginBottom: '12px' }}>
                    <label>Notice Title</label>
                    <input type="text" className="form-input-new" placeholder="e.g. Server Downtime" required />
                  </div>
                  <div className="form-group-new" style={{ marginBottom: '16px' }}>
                    <label>Notice Content</label>
                    <textarea className="form-input-new" rows="4" style={{ resize: 'none' }} placeholder="Write notice content here..." required />
                  </div>
                  <button className="btn-solid-new" style={{ width: '100%' }}>Publish Notice</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
