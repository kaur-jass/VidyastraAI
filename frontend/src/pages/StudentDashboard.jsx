import React, { useState, useEffect } from 'react';
import ERPLayout from '../components/ERPLayout';

const StudentDashboard = ({ user, onLogout, onNavigate }) => {
  const [view, setView] = useState('home'); // home | live | notes
  const [transcript, setTranscript] = useState([]);
  const [isLive, setIsLive] = useState(true);

  // Quiz state
  const [liveQuiz, setLiveQuiz] = useState(null);
  const [quizTimer, setQuizTimer] = useState(15);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState('');
  const [score, setScore] = useState(0);

  // Notes
  const [studentNotes, setStudentNotes] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Listen for quiz events + simulate transcript
  useEffect(() => {
    const handleQuiz = (e) => {
      setLiveQuiz(e.detail);
      setQuizTimer(15);
      setSelectedOption(null);
      setQuizSubmitted(false);
      setQuizFeedback('');
    };
    window.addEventListener('new-live-quiz', handleQuiz);

    let idx = 0;
    const lines = [
      "Today we'll discuss modern web development patterns.",
      "Hooks allow state management in functional components.",
      "useState returns an array with the current value and a setter.",
      "useEffect runs code after every render, useful for API calls.",
      "Always declare hooks at the top level of your component.",
      "Let's check your understanding with a quick quiz!"
    ];
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setTranscript(prev => [...prev, { time, text: lines[idx % lines.length] }]);
      idx++;
    }, 6000);

    return () => { window.removeEventListener('new-live-quiz', handleQuiz); clearInterval(interval); };
  }, []);

  // Quiz timer
  useEffect(() => {
    if (liveQuiz && quizTimer > 0 && !quizSubmitted) {
      const t = setTimeout(() => setQuizTimer(quizTimer - 1), 1000);
      return () => clearTimeout(t);
    }
    if (quizTimer === 0 && !quizSubmitted) submitQuiz();
  }, [liveQuiz, quizTimer, quizSubmitted]);

  const submitQuiz = () => {
    setQuizSubmitted(true);
    if (selectedOption === null) { setQuizFeedback("Time's up! No answer selected."); return; }
    const correct = selectedOption === liveQuiz.correctIndex;
    if (correct) { setScore(s => s + 10); setQuizFeedback(`✓ Correct! +10 pts. ${liveQuiz.explanation}`); }
    else { setQuizFeedback(`✗ Incorrect. Answer was ${['A','B','C','D'][liveQuiz.correctIndex]}. ${liveQuiz.explanation}`); }
  };

  const generateAiNotes = () => {
    if (transcript.length === 0) { alert('No lecture content yet!'); return; }
    const text = transcript.map(l => l.text).join(' ').toLowerCase();
    let s = `# AI Study Notes\n*Generated for ${user.name} on ${new Date().toLocaleDateString()}*\n\n`;
    s += `## Key Concepts\n`;
    if (text.includes('hook') || text.includes('state')) {
      s += `- **useState**: Returns [currentValue, setter] for managing component state\n`;
      s += `- **useEffect**: Runs side-effects after render (API calls, timers)\n`;
      s += `- **Rules of Hooks**: Must be called at top level, only in React functions\n`;
    }
    if (text.includes('jwt') || text.includes('security')) {
      s += `- **JWT**: Header.Payload.Signature — stateless auth tokens\n`;
      s += `- **CSRF Tokens**: Prevent unauthorized cross-site requests\n`;
    }
    s += `\n## Summary\n`;
    s += `This lecture covered foundational concepts with practical examples. `;
    s += `Focus on understanding the lifecycle and rules before applying in projects.\n`;
    s += `\n## Quick Review\n`;
    s += `1. What are the two values returned by useState?\n`;
    s += `2. When does useEffect run by default?\n`;
    s += `3. Why must hooks be called at the top level?\n`;
    setAiSummary(s);
    setShowSummaryModal(true);
  };

  const downloadNotes = () => {
    const blob = new Blob([aiSummary], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'VidyastraAI_StudyNotes.md';
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  return (
    <ERPLayout user={user} onLogout={onLogout} onNavigate={onNavigate}>

      {/* Quiz Popup Modal */}
      {liveQuiz && !quizSubmitted && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <span className="label label-warning" style={{ fontSize: '11px' }}>LIVE QUIZ</span>
              <span style={{ fontWeight: 700, color: quizTimer <= 5 ? '#e74c3c' : '#f39c12', fontSize: '16px' }}>
                <span className="glyphicon glyphicon-time" style={{ marginRight: '4px' }}></span>{quizTimer}s
              </span>
            </div>
            <h4 style={{ fontWeight: 700, color: '#003A6A', marginBottom: '18px', lineHeight: '1.4' }}>{liveQuiz.question}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {liveQuiz.options.map((opt, i) => (
                <button key={i} onClick={() => setSelectedOption(i)} style={{
                  width: '100%', padding: '12px 16px', textAlign: 'left', borderRadius: '6px',
                  border: selectedOption === i ? '2px solid #003A6A' : '1px solid #dee2e6',
                  backgroundColor: selectedOption === i ? '#e8f4fd' : '#fff',
                  fontWeight: selectedOption === i ? 600 : 400, cursor: 'pointer', fontSize: '14px'
                }}>{opt}</button>
              ))}
            </div>
            <button onClick={submitQuiz} className="btn btn-primary" style={{ width: '100%', marginTop: '18px', backgroundColor: '#003A6A', border: 'none', borderRadius: '6px', fontWeight: 'bold', height: '40px' }}>
              Submit Answer
            </button>
          </div>
        </div>
      )}

      {/* Quiz Result Modal */}
      {liveQuiz && quizSubmitted && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>
              {selectedOption === liveQuiz.correctIndex ? '✅' : '❌'}
            </div>
            <h3 style={{ color: '#003A6A', marginBottom: '12px' }}>
              {selectedOption === liveQuiz.correctIndex ? 'Correct!' : 'Not Quite!'}
            </h3>
            <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>{quizFeedback}</p>
            <button onClick={() => setLiveQuiz(null)} className="btn btn-default" style={{ borderRadius: '6px', fontWeight: 'bold', padding: '8px 30px' }}>
              Back to Lecture
            </button>
          </div>
        </div>
      )}

      {/* AI Summary Modal */}
      {showSummaryModal && (
        <div className="modal-overlay">
          <div className="modal-box modal-box-lg">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #dee2e6', paddingBottom: '12px', marginBottom: '15px' }}>
              <h4 style={{ margin: 0, color: '#003A6A', fontWeight: 700 }}>
                <span className="glyphicon glyphicon-education" style={{ marginRight: '8px' }}></span>AI Summarized Notes
              </h4>
              <button onClick={() => setShowSummaryModal(false)} className="btn btn-xs btn-default" style={{ borderRadius: '50%', width: '28px', height: '28px', fontWeight: 'bold' }}>✕</button>
            </div>
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', border: '1px solid #dee2e6', fontSize: '13px', lineHeight: '22px', whiteSpace: 'pre-wrap', maxHeight: '400px', overflowY: 'auto' }}>
              {aiSummary}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px', justifyContent: 'flex-end' }}>
              <button onClick={downloadNotes} className="btn btn-primary" style={{ backgroundColor: '#003A6A', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
                <span className="glyphicon glyphicon-download" style={{ marginRight: '5px' }}></span> Download
              </button>
              <button onClick={() => setShowSummaryModal(false)} className="btn btn-default" style={{ borderRadius: '6px' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="container erp-page">
        <h2 className="erp-page-title">
          <span className="glyphicon glyphicon-user"></span> Student Dashboard
          <span style={{ marginLeft: 'auto', fontSize: '14px', fontWeight: 600, color: '#e67e22' }}>
            <span className="glyphicon glyphicon-star" style={{ marginRight: '4px' }}></span> Score: {score} pts
          </span>
        </h2>

        {/* ===== HOME VIEW ===== */}
        {view === 'home' && (
          <div className="animate-fade-in">
            {/* Welcome */}
            <div className="erp-panel" style={{ borderLeft: '4px solid #FECD0B' }}>
              <div className="erp-panel-body">
                <h4 style={{ margin: '0 0 5px', fontWeight: 700, color: '#003A6A' }}>Welcome back, {user.name}!</h4>
                <p className="text-muted" style={{ fontSize: '13px', margin: 0 }}>Select an option below to get started with your learning.</p>
              </div>
            </div>

            {/* Navigation Cards */}
            <div className="dash-nav-grid">
              <div className="dash-nav-card" onClick={() => setView('live')}>
                <div className="card-icon" style={{ backgroundColor: '#fef2f2' }}>
                  <span className="glyphicon glyphicon-facetime-video" style={{ fontSize: '24px', color: '#e74c3c' }}></span>
                </div>
                <div className="card-title">Join Live Class</div>
                <div className="card-desc">Watch the ongoing lecture stream with real-time captions</div>
                {isLive && <span className="label label-danger" style={{ marginTop: '8px', display: 'inline-block', fontSize: '10px' }}>● LIVE NOW</span>}
              </div>

              <div className="dash-nav-card" onClick={() => onNavigate('archive')}>
                <div className="card-icon" style={{ backgroundColor: '#eff6ff' }}>
                  <span className="glyphicon glyphicon-film" style={{ fontSize: '24px', color: '#2980b9' }}></span>
                </div>
                <div className="card-title">Recorded Lectures</div>
                <div className="card-desc">Watch past lectures you missed or want to review</div>
              </div>

              <div className="dash-nav-card" onClick={() => setView('notes')}>
                <div className="card-icon" style={{ backgroundColor: '#fef9e7' }}>
                  <span className="glyphicon glyphicon-book" style={{ fontSize: '24px', color: '#f39c12' }}></span>
                </div>
                <div className="card-title">My Notes & AI Summary</div>
                <div className="card-desc">Take notes and generate AI-powered study guides</div>
              </div>

              <div className="dash-nav-card" onClick={() => setView('live')}>
                <div className="card-icon" style={{ backgroundColor: '#f0fdf4' }}>
                  <span className="glyphicon glyphicon-check" style={{ fontSize: '24px', color: '#27ae60' }}></span>
                </div>
                <div className="card-title">Quiz Activity</div>
                <div className="card-desc">Your current score: {score} pts — quizzes appear during live class</div>
              </div>
            </div>
          </div>
        )}

        {/* ===== LIVE CLASS VIEW ===== */}
        {view === 'live' && (
          <div className="animate-fade-in">
            <button onClick={() => setView('home')} className="btn btn-default btn-sm" style={{ marginBottom: '15px', borderRadius: '4px' }}>
              <span className="glyphicon glyphicon-arrow-left" style={{ marginRight: '4px' }}></span> Back to Dashboard
            </button>

            <div className="row">
              <div className="col-md-8">
                {/* Stream Display */}
                <div className="erp-panel">
                  <div className="erp-panel-head">
                    <span className="glyphicon glyphicon-facetime-video"></span> Live Lecture Stream
                    <span className="label label-danger" style={{ marginLeft: '10px', fontSize: '10px' }}>● LIVE</span>
                  </div>
                  <div className="erp-panel-body" style={{ padding: 0 }}>
                    <div className="stream-screen" style={{ height: '360px' }}>
                      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#bbb', padding: '30px' }}>
                        <div style={{ width: '70%', backgroundColor: '#16213e', borderRadius: '8px', padding: '30px', textAlign: 'center' }}>
                          <span style={{ fontSize: '11px', color: '#FECD0B', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>Slide Presentation</span>
                          <h3 style={{ color: 'white', margin: '12px 0 15px', fontFamily: 'Outfit' }}>React Hooks: useState & useEffect</h3>
                          <div style={{ backgroundColor: '#0d1b2a', borderRadius: '6px', padding: '15px', textAlign: 'left', fontSize: '13px', fontFamily: 'monospace', color: '#94a3b8', lineHeight: '20px' }}>
                            const [count, setCount] = useState(0);<br/>
                            useEffect(() =&gt; &#123;<br/>
                            &nbsp;&nbsp;document.title = `Count: $&#123;count&#125;`;<br/>
                            &#125;, [count]);
                          </div>
                        </div>
                      </div>
                      <div className="live-badge"><span className="live-dot"></span> LIVE</div>
                    </div>
                  </div>
                </div>

                {/* Caption bar */}
                <div className="erp-panel" style={{ marginBottom: '15px' }}>
                  <div className="erp-panel-body" style={{ padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="label label-info" style={{ fontSize: '9px' }}>CAPTION</span>
                    <span style={{ fontSize: '13px', color: '#333', fontWeight: 500 }}>
                      {transcript.length > 0 ? transcript[transcript.length - 1].text : 'Waiting for audio...'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                {/* Transcript log */}
                <div className="erp-panel">
                  <div className="erp-panel-head"><span className="glyphicon glyphicon-comment"></span> Transcript</div>
                  <div className="erp-panel-body" style={{ height: '400px', overflowY: 'auto', fontSize: '13px' }}>
                    {transcript.map((l, i) => (
                      <div key={i} style={{ marginBottom: '6px', paddingBottom: '5px', borderBottom: '1px solid #f1f3f5' }}>
                        <span style={{ color: '#2980b9', fontSize: '10px', fontFamily: 'monospace', marginRight: '6px' }}>[{l.time}]</span>
                        <span>{l.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== NOTES VIEW ===== */}
        {view === 'notes' && (
          <div className="animate-fade-in">
            <button onClick={() => setView('home')} className="btn btn-default btn-sm" style={{ marginBottom: '15px', borderRadius: '4px' }}>
              <span className="glyphicon glyphicon-arrow-left" style={{ marginRight: '4px' }}></span> Back to Dashboard
            </button>

            <div className="row">
              <div className="col-md-7">
                <div className="erp-panel">
                  <div className="erp-panel-head"><span className="glyphicon glyphicon-pencil"></span> My Notebook</div>
                  <div className="erp-panel-body">
                    <textarea
                      className="form-control"
                      placeholder="Type your lecture notes here..."
                      value={studentNotes}
                      onChange={e => setStudentNotes(e.target.value)}
                      style={{ height: '350px', resize: 'none', borderRadius: '6px', fontSize: '14px', lineHeight: '1.6' }}
                    />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                      <button onClick={() => alert('Notes saved!')} className="btn btn-default" style={{ borderRadius: '6px' }}>
                        <span className="glyphicon glyphicon-floppy-disk" style={{ marginRight: '5px' }}></span> Save Notes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-5">
                <div className="erp-panel" style={{ borderLeft: '4px solid #FECD0B' }}>
                  <div className="erp-panel-head" style={{ backgroundColor: '#e67e22' }}>
                    <span className="glyphicon glyphicon-education"></span> AI Study Guide Generator
                  </div>
                  <div className="erp-panel-body" style={{ textAlign: 'center', padding: '30px 20px' }}>
                    <span className="glyphicon glyphicon-flash" style={{ fontSize: '40px', color: '#f39c12', display: 'block', marginBottom: '15px' }}></span>
                    <h4 style={{ fontWeight: 700, color: '#003A6A', marginBottom: '10px' }}>Generate AI Notes</h4>
                    <p className="text-muted" style={{ fontSize: '13px', marginBottom: '20px' }}>
                      Compile the live lecture transcript into a structured study guide with key concepts and review questions.
                    </p>
                    <button onClick={generateAiNotes} className="btn btn-warning" style={{ fontWeight: 'bold', borderRadius: '6px', padding: '10px 24px', fontSize: '14px' }}>
                      <span className="glyphicon glyphicon-education" style={{ marginRight: '6px' }}></span> Generate Now
                    </button>
                  </div>
                </div>

                <div className="erp-panel">
                  <div className="erp-panel-head"><span className="glyphicon glyphicon-info-sign"></span> Tips</div>
                  <div className="erp-panel-body" style={{ fontSize: '13px', color: '#555' }}>
                    <ul style={{ paddingLeft: '18px', margin: 0, lineHeight: '22px' }}>
                      <li>Join the live class first to build transcript data</li>
                      <li>The AI generator uses the transcript to create notes</li>
                      <li>Download notes as Markdown for offline studying</li>
                      <li>Use the notebook for your own personal annotations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ERPLayout>
  );
};

export default StudentDashboard;
