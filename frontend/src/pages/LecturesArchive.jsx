import { useState } from 'react';
import ERPLayout from '../components/ERPLayout';

const LecturesArchive = ({ user, onLogout, onNavigate, lectures }) => {
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  const generateNotes = (lecture) => {
    let s = `# Study Guide: ${lecture.topic}\n`;
    s += `*Date: ${lecture.date} | Duration: ${lecture.duration}*\n\n`;
    s += `## Key Concepts\n`;
    if (lecture.topic.toLowerCase().includes('react')) {
      s += `- **useState**: Hook for tracking state in functional components\n`;
      s += `- **useEffect**: Hook for side-effects (API calls, subscriptions)\n`;
      s += `- **Rules of Hooks**: Call at top level only, only in React functions\n`;
    } else if (lecture.topic.toLowerCase().includes('security')) {
      s += `- **JWT**: Stateless authentication tokens (Header.Payload.Signature)\n`;
      s += `- **CSRF Prevention**: Anti-CSRF tokens validate request origin\n`;
      s += `- **HttpOnly Cookies**: Prevents JavaScript-based token theft\n`;
    } else {
      s += `- **First Law (Inertia)**: Objects remain in their state unless acted upon\n`;
      s += `- **Second Law**: F = ma (Force = Mass × Acceleration)\n`;
      s += `- **Third Law**: Every action has an equal and opposite reaction\n`;
    }
    s += `\n## Transcript Highlights\n`;
    if (lecture.transcript?.length > 0) {
      lecture.transcript.slice(0, 4).forEach((l, i) => { s += `${i+1}. "${l.text}"\n`; });
    }
    setAiSummary(s); setShowSummary(true);
  };

  const downloadNotes = () => {
    const blob = new Blob([aiSummary], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `VidyastraAI_Notes_${selectedLecture?.topic?.replace(/\s+/g, '_') || 'Lecture'}.md`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  return (
    <ERPLayout user={user} onLogout={onLogout} onNavigate={onNavigate}>

      {/* AI Summary Modal */}
      {showSummary && (
        <div className="modal-overlay">
          <div className="modal-box modal-box-lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #dee2e6', paddingBottom: '12px', marginBottom: '15px' }}>
              <h4 style={{ margin: 0, color: '#003A6A', fontWeight: 700 }}>
                <span className="glyphicon glyphicon-education" style={{ marginRight: '8px' }}></span>AI Study Notes
              </h4>
              <button onClick={() => setShowSummary(false)} className="btn btn-xs btn-default" style={{ borderRadius: '50%', width: '28px', height: '28px', fontWeight: 'bold' }}>✕</button>
            </div>
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', border: '1px solid #dee2e6', fontSize: '13px', lineHeight: '22px', whiteSpace: 'pre-wrap', maxHeight: '400px', overflowY: 'auto' }}>
              {aiSummary}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px', justifyContent: 'flex-end' }}>
              <button onClick={downloadNotes} className="btn btn-primary" style={{ backgroundColor: '#003A6A', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
                <span className="glyphicon glyphicon-download" style={{ marginRight: '5px' }}></span> Download
              </button>
              <button onClick={() => setShowSummary(false)} className="btn btn-default" style={{ borderRadius: '6px' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="container erp-page">
        <h2 className="erp-page-title">
          <span className="glyphicon glyphicon-film"></span> Recorded Lectures Library
        </h2>

        <div className="row">
          {/* Lecture List */}
          <div className="col-md-4">
            <div className="erp-panel">
              <div className="erp-panel-head"><span className="glyphicon glyphicon-list"></span> All Lectures ({lectures.length})</div>
              <div className="erp-panel-body" style={{ padding: 0, maxHeight: '550px', overflowY: 'auto' }}>
                {lectures.length === 0 ? (
                  <p className="text-muted" style={{ textAlign: 'center', padding: '30px 15px' }}>No recorded lectures yet.</p>
                ) : lectures.map(l => (
                  <div
                    key={l.id}
                    onClick={() => setSelectedLecture(l)}
                    style={{
                      padding: '14px 15px', borderBottom: '1px solid #f1f3f5', cursor: 'pointer',
                      backgroundColor: selectedLecture?.id === l.id ? '#e8f4fd' : 'transparent',
                      borderLeft: selectedLecture?.id === l.id ? '3px solid #003A6A' : '3px solid transparent'
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{l.topic}</div>
                    <div style={{ fontSize: '12px', color: '#999', display: 'flex', gap: '12px' }}>
                      <span><span className="glyphicon glyphicon-calendar" style={{ marginRight: '3px' }}></span>{l.date}</span>
                      <span><span className="glyphicon glyphicon-time" style={{ marginRight: '3px' }}></span>{l.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lecture Detail */}
          <div className="col-md-8">
            {selectedLecture ? (
              <div className="animate-fade-in">
                {/* Player */}
                <div className="erp-panel">
                  <div className="erp-panel-head">
                    <span className="glyphicon glyphicon-play-circle"></span> {selectedLecture.topic}
                    <span className="label label-default" style={{ marginLeft: '10px', fontSize: '10px' }}>RECORDED</span>
                  </div>
                  <div className="erp-panel-body" style={{ padding: 0 }}>
                    <div className="stream-screen" style={{ height: '280px' }}>
                      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <button
                          onClick={() => alert('Starting playback...')}
                          style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#FECD0B', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(254,205,11,0.4)', transition: 'transform 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          <span className="glyphicon glyphicon-play" style={{ fontSize: '22px', color: '#003A6A', marginLeft: '3px' }}></span>
                        </button>
                        <p style={{ color: '#bbb', marginTop: '12px', fontSize: '13px' }}>Click to play recording</p>
                      </div>
                      {/* Progress Bar */}
                      <div style={{ position: 'absolute', bottom: '12px', left: '15px', right: '15px', display: 'flex', alignItems: 'center', gap: '10px', color: '#bbb', fontSize: '11px' }}>
                        <span>00:00</span>
                        <div style={{ flex: 1, height: '4px', backgroundColor: '#334155', borderRadius: '2px' }}><div style={{ width: '0%', height: '100%', backgroundColor: '#FECD0B' }}></div></div>
                        <span>{selectedLecture.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generate Notes CTA */}
                <div className="erp-panel" style={{ borderLeft: '4px solid #FECD0B' }}>
                  <div className="erp-panel-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h5 style={{ margin: '0 0 4px', fontWeight: 700, color: '#003A6A' }}>Need a quick recap?</h5>
                      <p className="text-muted" style={{ fontSize: '12px', margin: 0 }}>Generate AI study notes from this lecture's transcript.</p>
                    </div>
                    <button onClick={() => generateNotes(selectedLecture)} className="btn btn-warning" style={{ fontWeight: 'bold', borderRadius: '6px' }}>
                      <span className="glyphicon glyphicon-education" style={{ marginRight: '5px' }}></span> Generate Notes
                    </button>
                  </div>
                </div>

                {/* Transcript */}
                <div className="erp-panel">
                  <div className="erp-panel-head"><span className="glyphicon glyphicon-comment"></span> Transcript</div>
                  <div className="erp-panel-body" style={{ maxHeight: '200px', overflowY: 'auto', fontSize: '13px' }}>
                    {selectedLecture.transcript?.length > 0 ? selectedLecture.transcript.map((l, i) => (
                      <div key={i} style={{ marginBottom: '6px', paddingBottom: '5px', borderBottom: '1px solid #f1f3f5' }}>
                        <span style={{ color: '#2980b9', fontSize: '10px', fontFamily: 'monospace', marginRight: '6px' }}>[{l.time}]</span>
                        <span>{l.text}</span>
                      </div>
                    )) : <p className="text-muted">No transcript available.</p>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="erp-panel">
                <div className="erp-panel-body" style={{ textAlign: 'center', padding: '80px 20px', color: '#999' }}>
                  <span className="glyphicon glyphicon-hand-left" style={{ fontSize: '30px', display: 'block', marginBottom: '10px' }}></span>
                  Select a lecture from the list to view details.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ERPLayout>
  );
};

export default LecturesArchive;