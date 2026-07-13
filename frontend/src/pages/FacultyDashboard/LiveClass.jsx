import React from 'react';
import { Calendar, Tv } from 'lucide-react';

const LiveClass = ({ setActiveTab, todayClasses = [] }) => {
  return (
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
                    <th>Time frame</th>
                    <th>Room Location</th>
                  </tr>
                </thead>
                <tbody>
                  {todayClasses.length > 0 ? (
                    todayClasses.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <span style={{ fontWeight: '700' }}>{item.code} • {item.subject}</span>
                        </td>
                        <td>{item.time}</td>
                        <td>{item.room}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        No live classes scheduled for today.
                      </td>
                    </tr>
                  )}
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
  );
};

export default LiveClass;
