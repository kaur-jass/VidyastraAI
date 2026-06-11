import React, { useState } from 'react';
import ERPLayout from '../components/ERPLayout';

const AdminDashboard = ({ user, onLogout, onNavigate, lectures }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const teachers = [
    { id: 1, name: 'Dr. Sarah Verma', dept: 'Computer Science', lectures: 24, status: 'Active' },
    { id: 2, name: 'Prof. Rajesh Kumar', dept: 'Physics', lectures: 18, status: 'Active' },
    { id: 3, name: 'Dr. Meena Iyer', dept: 'Mathematics', lectures: 15, status: 'Inactive' },
    { id: 4, name: 'Prof. Anil Gupta', dept: 'Electronics', lectures: 21, status: 'Active' },
  ];

  const students = [
    { id: 1, name: 'Amit Sharma', enrollment: 'VA2026001', attended: 38, avgScore: 87 },
    { id: 2, name: 'Priya Patel', enrollment: 'VA2026002', attended: 42, avgScore: 92 },
    { id: 3, name: 'Rohan Gupta', enrollment: 'VA2026003', attended: 35, avgScore: 78 },
    { id: 4, name: 'Anjali Verma', enrollment: 'VA2026004', attended: 40, avgScore: 85 },
    { id: 5, name: 'Vikram Singh', enrollment: 'VA2026005', attended: 30, avgScore: 71 },
    { id: 6, name: 'Sneha Reddy', enrollment: 'VA2026006', attended: 41, avgScore: 90 },
  ];

  const activityLog = [
    { time: '11:45 AM', text: 'Dr. Sarah Verma started live lecture — React Hooks', color: '#27ae60' },
    { time: '11:30 AM', text: 'Amit Sharma logged in from Chrome/Windows', color: '#2980b9' },
    { time: '11:15 AM', text: 'Quiz pushed: "What does useState return?"', color: '#f39c12' },
    { time: '10:55 AM', text: 'Lecture archived: Web Security Basics (52 min)', color: '#8e44ad' },
    { time: '10:40 AM', text: 'Prof. Rajesh Kumar logged in', color: '#2980b9' },
    { time: '10:20 AM', text: 'Priya Patel generated AI summary notes', color: '#e67e22' },
    { time: '09:30 AM', text: 'System backup completed successfully', color: '#27ae60' },
  ];

  return (
    <ERPLayout user={user} onLogout={onLogout} onNavigate={onNavigate}>
      <div className="container erp-page">
        <h2 className="erp-page-title">
          <span className="glyphicon glyphicon-dashboard"></span> Admin Dashboard
        </h2>

        {/* Stats Row */}
        <div className="stat-row">
          <div className="stat-card info">
            <div className="stat-number">{teachers.length}</div>
            <div className="stat-label">Total Teachers</div>
          </div>
          <div className="stat-card success">
            <div className="stat-number">{students.length}</div>
            <div className="stat-label">Total Students</div>
          </div>
          <div className="stat-card accent">
            <div className="stat-number">{lectures.length}</div>
            <div className="stat-label">Lectures Archived</div>
          </div>
          <div className="stat-card danger">
            <div className="stat-number">1</div>
            <div className="stat-label">Live Now</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="erp-tabs">
          <button className={`erp-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <span className="glyphicon glyphicon-stats"></span> Overview
          </button>
          <button className={`erp-tab ${activeTab === 'teachers' ? 'active' : ''}`} onClick={() => setActiveTab('teachers')}>
            <span className="glyphicon glyphicon-education"></span> Teachers
          </button>
          <button className={`erp-tab ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>
            <span className="glyphicon glyphicon-user"></span> Students
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="row animate-fade-in">
            <div className="col-md-7">
              <div className="erp-panel">
                <div className="erp-panel-head">
                  <span className="glyphicon glyphicon-film"></span> Recent Lectures
                </div>
                <div className="erp-panel-body">
                  {lectures.length === 0 ? (
                    <p className="text-muted" style={{ padding: '15px 0', textAlign: 'center' }}>No lectures archived yet.</p>
                  ) : (
                    <table className="erp-table">
                      <thead>
                        <tr><th>Topic</th><th>Date</th><th>Duration</th></tr>
                      </thead>
                      <tbody>
                        {lectures.slice(0, 5).map(l => (
                          <tr key={l.id}><td>{l.topic}</td><td>{l.date}</td><td>{l.duration}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Lecture Analytics */}
              <div className="erp-panel">
                <div className="erp-panel-head">
                  <span className="glyphicon glyphicon-signal"></span> Weekly Lecture Activity
                </div>
                <div className="erp-panel-body">
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px', padding: '10px 0' }}>
                    {[3, 5, 2, 7, 4, 6, 3].map((val, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '11px', color: '#6c757d', fontWeight: 600 }}>{val}</span>
                        <div style={{ width: '100%', height: `${val * 14}px`, backgroundColor: '#003A6A', borderRadius: '3px 3px 0 0', transition: 'height 0.3s' }}></div>
                        <span style={{ fontSize: '10px', color: '#999' }}>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-5">
              <div className="erp-panel">
                <div className="erp-panel-head">
                  <span className="glyphicon glyphicon-time"></span> Recent Activity
                </div>
                <div className="erp-panel-body" style={{ maxHeight: '380px', overflowY: 'auto' }}>
                  {activityLog.map((item, i) => (
                    <div key={i} className="activity-item">
                      <div className="activity-dot" style={{ backgroundColor: item.color }}></div>
                      <div>
                        <div style={{ color: '#333' }}>{item.text}</div>
                        <div style={{ color: '#999', fontSize: '11px', marginTop: '2px' }}>{item.time} today</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'teachers' && (
          <div className="animate-fade-in">
            <div className="erp-panel">
              <div className="erp-panel-head">
                <span className="glyphicon glyphicon-education"></span> Teacher Management
              </div>
              <div className="erp-panel-body">
                <table className="erp-table">
                  <thead>
                    <tr><th>#</th><th>Name</th><th>Department</th><th>Lectures</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {teachers.map((t, i) => (
                      <tr key={t.id}>
                        <td>{i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{t.name}</td>
                        <td>{t.dept}</td>
                        <td>{t.lectures}</td>
                        <td>
                          <span className={`label ${t.status === 'Active' ? 'label-success' : 'label-default'}`} style={{ fontSize: '11px' }}>
                            {t.status}
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

        {activeTab === 'students' && (
          <div className="animate-fade-in">
            <div className="erp-panel">
              <div className="erp-panel-head">
                <span className="glyphicon glyphicon-user"></span> Student Management
              </div>
              <div className="erp-panel-body">
                <table className="erp-table">
                  <thead>
                    <tr><th>#</th><th>Name</th><th>Enrollment ID</th><th>Lectures Attended</th><th>Avg Quiz Score</th></tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => (
                      <tr key={s.id}>
                        <td>{i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{s.name}</td>
                        <td><code style={{ fontSize: '12px' }}>{s.enrollment}</code></td>
                        <td>{s.attended}</td>
                        <td>
                          <span style={{ fontWeight: 700, color: s.avgScore >= 85 ? '#27ae60' : s.avgScore >= 70 ? '#f39c12' : '#e74c3c' }}>
                            {s.avgScore}%
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
      </div>
    </ERPLayout>
  );
};

export default AdminDashboard;
