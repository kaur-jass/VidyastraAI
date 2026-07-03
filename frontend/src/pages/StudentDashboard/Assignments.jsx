import React from 'react';
import { Clock, Check, X } from 'lucide-react';

const Assignments = ({
  assignments,
  activeAssignmentSubmit,
  setActiveAssignmentSubmit,
  submissionText,
  setSubmissionText,
  submitAssignmentAction
}) => {
  return (
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
  );
};

export default Assignments;
