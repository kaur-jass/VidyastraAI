import React from 'react';
import { RefreshCw } from 'lucide-react';

const LectureCenter = ({
  refreshProcessingQueue,
  refreshingQueue,
  processingTasks
}) => {
  return (
    <div className="view-fade-in">
      <div className="gorgeous-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
            AI Pipeline converts recordings into transcripts, summaries, and assessments.
          </p>
          <button 
            onClick={refreshProcessingQueue}
            disabled={refreshingQueue}
            className="faculty-action-btn-styled"
            style={{ gap: '6px' }}
          >
            <RefreshCw className={`h-4 w-4 ${refreshingQueue ? 'animate-spin' : ''}`} /> Sync Center
          </button>
        </div>
      </div>

      <div className="gorgeous-card">
        <div className="fancy-table-container">
          <table className="fancy-table">
            <thead>
              <tr>
                <th>Recorded Topic</th>
                <th>Course</th>
                <th>AI Transcript</th>
                <th>AI Summary Notes</th>
                <th>AI Quiz set</th>
                <th>Date Processed</th>
              </tr>
            </thead>
            <tbody>
              {processingTasks.map((task) => (
                <tr key={task.id}>
                  <td>
                    <span style={{ fontWeight: '700' }}>{task.topic}</span>
                  </td>
                  <td>{task.course}</td>
                  <td>
                    <span className={`badge-status ${task.transcript === 'Success' ? 'success' : task.transcript.startsWith('Processing') ? 'processing' : 'queue'}`}
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: task.transcript === 'Success' ? '#D1FAE5' : task.transcript.startsWith('Processing') ? '#DBEAFE' : '#F1F5F9',
                        color: task.transcript === 'Success' ? '#059669' : task.transcript.startsWith('Processing') ? '#2563EB' : '#64748B'
                      }}
                    >
                      {task.transcript}
                    </span>
                  </td>
                  <td>
                    <span className={`badge-status ${task.summary === 'Success' ? 'success' : task.summary.startsWith('Processing') ? 'processing' : 'queue'}`}
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: task.summary === 'Success' ? '#D1FAE5' : task.summary.startsWith('Processing') ? '#DBEAFE' : '#F1F5F9',
                        color: task.summary === 'Success' ? '#059669' : task.summary.startsWith('Processing') ? '#2563EB' : '#64748B'
                      }}
                    >
                      {task.summary}
                    </span>
                  </td>
                  <td>
                    <span className={`badge-status ${task.quiz === 'Success' ? 'success' : task.quiz.startsWith('Processing') ? 'processing' : 'queue'}`}
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: task.quiz === 'Success' ? '#D1FAE5' : task.quiz.startsWith('Processing') ? '#DBEAFE' : '#F1F5F9',
                        color: task.quiz === 'Success' ? '#059669' : task.quiz.startsWith('Processing') ? '#2563EB' : '#64748B'
                      }}
                    >
                      {task.quiz}
                    </span>
                  </td>
                  <td>{task.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LectureCenter;
