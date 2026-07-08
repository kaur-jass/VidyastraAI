import React from 'react';
import { X } from 'lucide-react';

const AssignmentAssess = ({
  assignments,
  activeGradeAssignment,
  setActiveGradeAssignment,
  gradingScore,
  setGradingScore,
  gradingFeedback,
  setGradingFeedback,
  submitGradeAction
}) => {
  return (
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
                    <span className={`badge-status ${ass.status === 'Graded' ? 'success' : 'queue'}`}
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: ass.status === 'Graded' ? '#D1FAE5' : '#FEE2E2',
                        color: ass.status === 'Graded' ? '#059669' : '#EF4444'
                      }}
                    >
                      {ass.status === 'Graded' ? `Graded (${ass.grade})` : 'Pending review'}
                    </span>
                  </td>
                  <td>
                    {ass.status !== 'Graded' ? (
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
  );
};

export default AssignmentAssess;
