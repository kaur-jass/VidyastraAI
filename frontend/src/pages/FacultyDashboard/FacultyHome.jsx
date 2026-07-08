import React from 'react';
import { 
  Video, 
  Tv, 
  Users, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';

const FacultyHome = ({
  user,
  profile,
  todayClasses = [],
  students = [],
  processingTasks = [],
  libraryResources = [],
  courses = [],
  aiSettings = null,
  setRecCourse,
  setRecTopic,
  setActiveTab,
  triggerToast
}) => {
  return (
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
            <div className="metric-value">{libraryResources?.length || 0} Lectures</div>
            <div className="metric-label">Recorded Lectures</div>
          </div>
        </div>

        <div className="metric-card-styled">
          <div className="metric-icon-box" style={{ backgroundColor: '#FAF5FF', color: '#8B5CF6' }}>
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="metric-value">{students?.length || 0} Active</div>
            <div className="metric-label">Enrolled Students</div>
          </div>
        </div>

        <div className="metric-card-styled">
          <div className="metric-icon-box" style={{ backgroundColor: '#FFF7ED', color: '#F59E0B' }}>
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="metric-value">{aiSettings?.tokensUsed || 0} / {aiSettings?.tokensLimit || 1000}</div>
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
              {processingTasks && processingTasks.length > 0 ? (
                processingTasks.slice(0, 3).map((task) => (
                  <div key={task.id} style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #E9D5FF' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>{task.course} • {task.type}</span>
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>{task.title}</span>
                    </div>
                    {task.status === 'Completed' ? (
                      <span className="badge-status success" style={{ display: 'inline-flex', gap: '4px', alignItems: 'center', backgroundColor: '#D1FAE5', color: '#059669', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', fontWeight: '700' }}>
                        <CheckCircle2 className="h-3 w-3" /> Ready
                      </span>
                    ) : task.status === 'Processing' ? (
                      <span className="badge-status processing" style={{ display: 'inline-flex', gap: '4px', alignItems: 'center', backgroundColor: '#DBEAFE', color: '#2563EB', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', fontWeight: '700' }}>
                        <RefreshCw className="h-3 w-3 animate-spin" /> {task.progress}%
                      </span>
                    ) : (
                      <span className="badge-status pending" style={{ display: 'inline-flex', gap: '4px', alignItems: 'center', backgroundColor: '#F1F5F9', color: '#64748B', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', fontWeight: '700' }}>
                        <Clock className="h-3 w-3" /> Pending
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No AI processing tasks active.
                </div>
              )}

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
  );
};

export default FacultyHome;
