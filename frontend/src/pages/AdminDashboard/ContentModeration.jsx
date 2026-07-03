import React from 'react';
import { ShieldCheck } from 'lucide-react';

const ContentModeration = ({
  moderationQueue,
  handleApproveResource,
  handleRejectResource
}) => {
  return (
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
                <tr key={item._id || item.id}>
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
                  <td>{item.date ? new Date(item.date).toLocaleDateString() : ''}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{item.size}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn-primary-rect" 
                      style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#10B981' }}
                      onClick={() => handleApproveResource(item._id || item.id, item.title)}
                    >
                      Approve
                    </button>
                    <button 
                      className="btn-primary-rect" 
                      style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#EF4444', marginLeft: '8px' }}
                      onClick={() => handleRejectResource(item._id || item.id, item.title)}
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
  );
};

export default ContentModeration;
