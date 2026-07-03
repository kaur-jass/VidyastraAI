import React from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Activity, 
  Server, 
  RefreshCw, 
  Sparkles 
} from 'lucide-react';

const AdminHome = ({
  user,
  overviewStats,
  totalUsers,
  totalCourses,
  studentCount,
  facultyCount,
  dailySessions,
  systemHealth,
  setActiveTab,
  setUserRoleFilter,
  fetchSystemHealth,
  triggerToast,
  dashboardAreaPath,
  dashboardLinePath
}) => {
  return (
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
            <div className="metric-value">{overviewStats ? (overviewStats.totalStudents + overviewStats.totalFaculty) : totalUsers}</div>
            <div className="metric-label">Total Users</div>
          </div>
        </div>

        <div className="metric-card-styled" onClick={() => { setActiveTab('users'); setUserRoleFilter('Student'); }}>
          <div className="metric-icon-box" style={{ backgroundColor: '#ECFDF5', color: '#10B981' }}>
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <div className="metric-value">{overviewStats ? overviewStats.totalStudents : studentCount}</div>
            <div className="metric-label">Enrolled Students</div>
          </div>
        </div>

        <div className="metric-card-styled" onClick={() => { setActiveTab('users'); setUserRoleFilter('Faculty'); }}>
          <div className="metric-icon-box" style={{ backgroundColor: '#FFF7ED', color: '#F97316' }}>
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="metric-value">{overviewStats ? overviewStats.totalFaculty : facultyCount}</div>
            <div className="metric-label">Active Faculty</div>
          </div>
        </div>

        <div className="metric-card-styled" onClick={() => setActiveTab('courses')}>
          <div className="metric-icon-box" style={{ backgroundColor: '#F3E8FF', color: '#A855F7' }}>
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="metric-value">{overviewStats ? overviewStats.totalCourses : totalCourses}</div>
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
            {dailySessions && dailySessions.length > 0 ? (
              <svg viewBox="0 0 500 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
                {/* Grid Lines */}
                <line x1="40" y1="20" x2="480" y2="20" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4" />
                <line x1="40" y1="70" x2="480" y2="70" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4" />
                <line x1="40" y1="120" x2="480" y2="120" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4" />
                <line x1="40" y1="170" x2="480" y2="170" stroke="#CBD5E1" strokeWidth="1.5" />

                {/* X-axis labels */}
                {dailySessions.map((m, idx) => {
                  const x = 40 + idx * 73;
                  const dateObj = new Date(m.date);
                  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                  return (
                    <text key={idx} x={x} y="188" fill="#64748B" fontSize="10" textAnchor="middle" fontWeight="bold">
                      {dayName}
                    </text>
                  );
                })}

                {/* Y-axis labels */}
                <text x="30" y="24" fill="#64748B" fontSize="10" textAnchor="end" fontWeight="bold">250</text>
                <text x="30" y="74" fill="#64748B" fontSize="10" textAnchor="end" fontWeight="bold">166</text>
                <text x="30" y="124" fill="#64748B" fontSize="10" textAnchor="end" fontWeight="bold">83</text>
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
                  d={dashboardAreaPath}
                  fill="url(#chartGradient)"
                />

                {/* Line Path */}
                <path
                  d={dashboardLinePath}
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Dots */}
                {dailySessions.map((m, idx) => {
                  const x = 40 + idx * 73;
                  const y = 170 - (m.activeSessions / 250) * 150;
                  return <circle key={idx} cx={x} cy={y} r="4.5" fill="#4F46E5" stroke="white" strokeWidth="2" />;
                })}
              </svg>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                Loading platform activity analytics...
              </div>
            )}
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
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: systemHealth ? '#10B981' : '#EF4444' }} />
                {systemHealth ? 'Operational' : 'Unreachable'}
              </span>
            </div>

            <div className="health-item-row">
              <span className="health-label">MongoDB Database</span>
              <span className="health-status-indicator">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: systemHealth?.dbConnection === 'Healthy' ? '#10B981' : '#EF4444' }} />
                {systemHealth?.dbConnection || 'Offline'}
              </span>
            </div>

            <div className="health-item-row">
              <span className="health-label">Gemini AI Engine</span>
              <span className="health-status-indicator">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: systemHealth?.llmEndpoint === 'Operational' ? '#10B981' : '#EF4444' }} />
                {systemHealth?.llmEndpoint || 'Offline'}
              </span>
            </div>

            <div className="health-item-row">
              <span className="health-label">S3 Cloud Storage</span>
              <span className="health-status-indicator">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#94A3B8' }} />
                Not Monitored
              </span>
            </div>

            <div className="health-item-row">
              <span className="health-label">SMTP Mail Gateway</span>
              <span className="health-status-indicator">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#94A3B8' }} />
                Not Monitored
              </span>
            </div>
          </div>

          <button 
            className="btn-primary-rect" 
            style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}
            onClick={async () => {
              triggerToast("Running system health diagnostics...");
              await fetchSystemHealth();
              triggerToast("Diagnostics completed. Dashboard refreshed!", "success");
            }}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Run Diagnostics Audit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
