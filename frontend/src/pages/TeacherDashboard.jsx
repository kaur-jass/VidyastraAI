import React, { useState, useEffect, useRef } from 'react';
import ERPLayout from '../components/ERPLayout';

const TeacherDashboard = ({ user, onLogout, onNavigate, lectures, setLectures }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Streaming state
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('react');
  const [streamDuration, setStreamDuration] = useState(0);
  const [transcript, setTranscript] = useState([]);



  // Webcam
  const videoRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);

  // Quiz
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [customOptions, setCustomOptions] = useState(['', '', '', '']);
  const [customAnswer, setCustomAnswer] = useState(0);

  // Students
  const [connectedStudents, setConnectedStudents] = useState([
    { id: 1, name: 'Amit Sharma', score: 0, lastAnswer: null, speed: 0 },
    { id: 2, name: 'Priya Patel', score: 0, lastAnswer: null, speed: 0 },
    { id: 3, name: 'Rohan Gupta', score: 0, lastAnswer: null, speed: 0 },
    { id: 4, name: 'Anjali Verma', score: 0, lastAnswer: null, speed: 0 },
    { id: 5, name: 'Vikram Singh', score: 0, lastAnswer: null, speed: 0 },
  ]);
  const [quizResults, setQuizResults] = useState({ A: 0, B: 0, C: 0, D: 0, total: 0 });

  // Timer
  useEffect(() => {
    let interval;
    if (isStreaming) { interval = setInterval(() => setStreamDuration(p => p + 1), 1000); }
    else { setStreamDuration(0); }
    return () => clearInterval(interval);
  }, [isStreaming]);

  const TOPIC_SCRIPTS = {
    react: [
      { text: "Good morning class! Today we will learn about React Hooks.", keyword: "react" },
      { text: "The most fundamental Hook is useState. It returns a state variable and an updater function.", keyword: "state" },
      { text: "Next, we have useEffect, which lets us perform side effects in functional components.", keyword: "effect" },
    ],
    security: [
      { text: "Today we will cover Web Application Security basics.", keyword: "security" },
      { text: "We often use JWT (JSON Web Tokens) to verify users securely.", keyword: "jwt" },
      { text: "Let's talk about Cross-Site Request Forgery, or CSRF.", keyword: "csrf" },
    ],
    physics: [
      { text: "Let's explore Newton's Laws of Motion.", keyword: "motion" },
      { text: "The First Law states that an object stays at rest unless acted on by a force.", keyword: "force" },
      { text: "The Second Law: force equals mass times acceleration.", keyword: "mass" },
    ],
  };

  const TOPIC_QUIZZES = {
    react: [
      { id: 'q1', keyword: 'state', question: 'What does the useState Hook return?', options: ['A: A single state value', 'B: A function to update state only', 'C: An array with current state and updater', 'D: A DOM reference'], correctIndex: 2, explanation: 'useState returns [currentState, setStateFunction].' },
      { id: 'q2', keyword: 'effect', question: 'Which Hook handles side-effects?', options: ['A: useState', 'B: useEffect', 'C: useContext', 'D: useReducer'], correctIndex: 1, explanation: 'useEffect handles side-effects like API calls.' },
    ],
    security: [
      { id: 'q3', keyword: 'jwt', question: 'What are the three parts of a JWT?', options: ['A: Username, Password, Captcha', 'B: Header, Payload, Signature', 'C: ClientID, Secret, Scope', 'D: Request, Response, Cookies'], correctIndex: 1, explanation: 'JWT = Header.Payload.Signature' },
      { id: 'q4', keyword: 'csrf', question: 'What prevents Cross-Site Request Forgery?', options: ['A: Anti-CSRF Tokens', 'B: Hashing Passwords', 'C: Captcha only', 'D: HTTPS only'], correctIndex: 0, explanation: 'Anti-CSRF tokens validate request origin.' },
    ],
    physics: [
      { id: 'q5', keyword: 'force', question: "Newton's First Law is also known as?", options: ['A: Law of Momentum', 'B: Law of Inertia', 'C: Law of Gravity', 'D: Law of Acceleration'], correctIndex: 1, explanation: "It's the Law of Inertia." },
      { id: 'q6', keyword: 'mass', question: 'What does F = ma stand for?', options: ['A: Friction = Mass × Acceleration', 'B: Force = Mass × Acceleration', 'C: Force = Mass / Acceleration', 'D: Frequency = Mass × Amplitude'], correctIndex: 1, explanation: 'Force = Mass × Acceleration.' },
    ],
  };

  const addTranscriptLine = (text) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setTranscript(prev => [...prev, { time, text }]);
    const lower = text.toLowerCase();
    (TOPIC_QUIZZES[selectedTopic] || []).forEach(q => {
      if (lower.includes(q.keyword)) {
        setAiSuggestions(prev => prev.some(s => s.id === q.id) ? prev : [q, ...prev]);
      }
    });
  };

  // Simulated transcript
  useEffect(() => {
    let timer, idx = 0;
    if (isStreaming) {
      const script = TOPIC_SCRIPTS[selectedTopic] || [];
      timer = setInterval(() => {
        if (idx < script.length) { addTranscriptLine(script[idx].text); idx++; }
        else { idx = 0; }
      }, 6000);
    }
    return () => clearInterval(timer);
  }, [isStreaming, selectedTopic]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setCameraStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) { console.warn("Camera unavailable, using simulation.", e); }
  };

  const stopCamera = () => {
    if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); setCameraStream(null); }
  };

  const handleStartStream = () => {
    setIsStreaming(true); setTranscript([]); setAiSuggestions([]); setActiveQuiz(null);
    setQuizResults({ A: 0, B: 0, C: 0, D: 0, total: 0 }); startCamera();
    setActiveTab('classroom');
  };

  const handleStopStream = () => {
    stopCamera(); setIsStreaming(false);
    const topicNames = { react: 'React Hooks', security: 'Web Security Basics', physics: "Newton's Laws" };
    setLectures([{ id: Date.now(), topic: topicNames[selectedTopic], date: new Date().toLocaleDateString(), duration: formatTime(streamDuration), transcript: [...transcript], quizzes: activeQuiz ? [{ question: activeQuiz.question, correctIndex: activeQuiz.correctIndex }] : [] }, ...lectures]);
    alert('Lecture archived successfully!');
    setActiveTab('overview');
  };

  const handlePushQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setQuizResults({ A: 0, B: 0, C: 0, D: 0, total: 0 });
    window.dispatchEvent(new CustomEvent('new-live-quiz', { detail: quiz }));
    setConnectedStudents(prev => prev.map(s => ({ ...s, lastAnswer: null, speed: 0 })));
    let idx = 0;
    const timer = setInterval(() => {
      if (idx < connectedStudents.length) {
        const answer = Math.random() < 0.8 ? quiz.correctIndex : Math.floor(Math.random() * 4);
        const letter = ['A','B','C','D'][answer];
        const speed = parseFloat((Math.random() * 3 + 1).toFixed(1));
        setConnectedStudents(prev => prev.map((s, i) => i === idx ? { ...s, lastAnswer: letter, speed, score: answer === quiz.correctIndex ? s.score + 10 : s.score } : s));
        setQuizResults(prev => ({ ...prev, [letter]: prev[letter] + 1, total: prev.total + 1 }));
        idx++;
      } else { clearInterval(timer); }
    }, 1000);
  };

  const handleCustomQuiz = () => {
    if (!customQuestion.trim() || customOptions.some(o => !o.trim())) { alert('Fill all fields!'); return; }
    handlePushQuiz({ id: 'c' + Date.now(), question: customQuestion, options: customOptions.map((o, i) => `${['A','B','C','D'][i]}: ${o}`), correctIndex: customAnswer, explanation: 'Custom question.' });
    setCustomQuestion(''); setCustomOptions(['','','','']);
  };



  const formatTime = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <ERPLayout user={user} onLogout={onLogout} onNavigate={onNavigate}>
      <div className="container erp-page">
        <h2 className="erp-page-title">
          <span className="glyphicon glyphicon-blackboard"></span> Instructor Dashboard
        </h2>

        {/* Stats */}
        <div className="stat-row">
          <div className="stat-card info"><div className="stat-number">{lectures.length}</div><div className="stat-label">Total Lectures</div></div>
          <div className="stat-card success"><div className="stat-number">{connectedStudents.length}</div><div className="stat-label">Students Connected</div></div>
          <div className="stat-card accent"><div className="stat-number">{aiSuggestions.length}</div><div className="stat-label">AI Quizzes Ready</div></div>
          <div className="stat-card">
            <div className="stat-number" style={{ color: isStreaming ? '#e74c3c' : '#999' }}>
              {isStreaming ? formatTime(streamDuration) : 'OFF'}
            </div>
            <div className="stat-label">Stream Status</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="erp-tabs">
          <button className={`erp-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <span className="glyphicon glyphicon-home"></span> Overview
          </button>
          <button className={`erp-tab ${activeTab === 'classroom' ? 'active' : ''}`} onClick={() => setActiveTab('classroom')}>
            <span className="glyphicon glyphicon-facetime-video"></span> Live Classroom
          </button>
          <button className={`erp-tab ${activeTab === 'quiz' ? 'active' : ''}`} onClick={() => setActiveTab('quiz')}>
            <span className="glyphicon glyphicon-question-sign"></span> Quiz Manager
          </button>
          <button className={`erp-tab ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>
            <span className="glyphicon glyphicon-list-alt"></span> Student Results
          </button>
        </div>

        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            <div className="row">
              <div className="col-md-6">
                <div className="erp-panel">
                  <div className="erp-panel-head"><span className="glyphicon glyphicon-play-circle"></span> Start a New Lecture</div>
                  <div className="erp-panel-body">
                    <div className="form-group">
                      <label style={{ fontWeight: 600 }}>Select Topic:</label>
                      <select className="form-control" value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)} disabled={isStreaming} style={{ borderRadius: '6px' }}>
                        <option value="react">React Hooks (useState & useEffect)</option>
                        <option value="security">Web Security (JWT & CSRF)</option>
                        <option value="physics">Physics (Newton's Laws)</option>
                      </select>
                    </div>
                    <button onClick={handleStartStream} disabled={isStreaming} className="btn btn-primary" style={{ width: '100%', backgroundColor: '#003A6A', border: 'none', borderRadius: '6px', fontWeight: 'bold', height: '40px' }}>
                      <span className="glyphicon glyphicon-facetime-video" style={{ marginRight: '6px' }}></span>
                      {isStreaming ? 'Lecture In Progress...' : 'Start Live Lecture'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="erp-panel">
                  <div className="erp-panel-head"><span className="glyphicon glyphicon-film"></span> Recent Lectures</div>
                  <div className="erp-panel-body">
                    {lectures.length === 0 ? (
                      <p className="text-muted" style={{ textAlign: 'center', padding: '20px 0' }}>No lectures archived yet.</p>
                    ) : (
                      <table className="erp-table">
                        <thead><tr><th>Topic</th><th>Date</th><th>Duration</th></tr></thead>
                        <tbody>
                          {lectures.slice(0, 4).map(l => (
                            <tr key={l.id}><td>{l.topic}</td><td>{l.date}</td><td>{l.duration}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== LIVE CLASSROOM TAB ===== */}
        {activeTab === 'classroom' && (
          <div className="animate-fade-in">
            <div className="row">
              {/* Video + Whiteboard */}
              <div className="col-md-7">
                <div className="erp-panel">
                  <div className="erp-panel-head">
                    <span className="glyphicon glyphicon-facetime-video"></span> Camera Feed
                    {isStreaming && <span className="label label-danger" style={{ marginLeft: '10px', fontSize: '10px' }}>● LIVE</span>}
                  </div>
                  <div className="erp-panel-body" style={{ padding: 0 }}>
                    <div className="stream-screen" style={{ height: '390px' }}>
                      {cameraStream ? (
                        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                          <span className="glyphicon glyphicon-facetime-video" style={{ fontSize: '45px', opacity: 0.3, marginBottom: '10px' }}></span>
                          <span style={{ fontSize: '15px' }}>{isStreaming ? 'Simulation Mode (No Camera)' : 'Start lecture to enable camera'}</span>
                        </div>
                      )}
                      {isStreaming && <div className="live-badge"><span className="live-dot"></span> LIVE — {formatTime(streamDuration)}</div>}
                    </div>
                  </div>
                </div>

                {isStreaming && (
                  <button onClick={handleStopStream} className="btn btn-danger" style={{ width: '100%', borderRadius: '6px', fontWeight: 'bold', height: '40px', marginBottom: '20px' }}>
                    <span className="glyphicon glyphicon-stop" style={{ marginRight: '6px' }}></span> Stop & Archive Lecture
                  </button>
                )}
              </div>

              {/* Transcript */}
              <div className="col-md-5">
                <div className="erp-panel">
                  <div className="erp-panel-head"><span className="glyphicon glyphicon-comment"></span> Live Transcript</div>
                  <div className="erp-panel-body" style={{ height: '460px', overflowY: 'auto', fontSize: '13px' }}>
                    {transcript.length === 0 ? (
                      <p className="text-muted" style={{ textAlign: 'center', paddingTop: '40px' }}>
                        {isStreaming ? 'Listening... start speaking.' : 'Start the lecture to see transcript.'}
                      </p>
                    ) : transcript.map((l, i) => (
                      <div key={i} style={{ marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid #f1f3f5' }}>
                        <span style={{ color: '#2980b9', fontSize: '11px', fontFamily: 'monospace', marginRight: '8px' }}>[{l.time}]</span>
                        <span>{l.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== QUIZ MANAGER TAB ===== */}
        {activeTab === 'quiz' && (
          <div className="animate-fade-in">
            <div className="row">
              <div className="col-md-6">
                <div className="erp-panel">
                  <div className="erp-panel-head"><span className="glyphicon glyphicon-flash"></span> AI-Suggested Questions</div>
                  <div className="erp-panel-body">
                    {aiSuggestions.length === 0 ? (
                      <p className="text-muted" style={{ textAlign: 'center', padding: '20px 0' }}>Start a lecture and speak about the topic to generate AI quiz suggestions.</p>
                    ) : aiSuggestions.map(q => (
                      <div key={q.id} style={{ border: '1px solid #ffeaa7', backgroundColor: '#fef9e7', borderRadius: '6px', padding: '12px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span className="label label-warning" style={{ fontSize: '10px' }}>AI GENERATED</span>
                          <span style={{ fontSize: '11px', color: '#e67e22', fontWeight: 600 }}>keyword: "{q.keyword}"</span>
                        </div>
                        <p style={{ fontWeight: 600, fontSize: '13px', marginBottom: '8px' }}>{q.question}</p>
                        <button onClick={() => handlePushQuiz(q)} disabled={activeQuiz?.id === q.id} className="btn btn-xs btn-warning" style={{ fontWeight: 'bold' }}>
                          <span className="glyphicon glyphicon-send" style={{ marginRight: '4px' }}></span>
                          {activeQuiz?.id === q.id ? 'Pushed' : 'Push to Students'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="erp-panel">
                  <div className="erp-panel-head"><span className="glyphicon glyphicon-plus"></span> Create Custom Quiz</div>
                  <div className="erp-panel-body">
                    <div className="form-group">
                      <label style={{ fontWeight: 600, fontSize: '13px' }}>Question:</label>
                      <input type="text" className="form-control" placeholder="Enter your question..." value={customQuestion} onChange={e => setCustomQuestion(e.target.value)} style={{ borderRadius: '6px' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                      {customOptions.map((o, i) => (
                        <div key={i} className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '12px', color: '#6c757d' }}>Option {['A','B','C','D'][i]}:</label>
                          <input type="text" className="form-control" value={o} onChange={e => { const n = [...customOptions]; n[i] = e.target.value; setCustomOptions(n); }} style={{ borderRadius: '6px' }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <label style={{ fontSize: '12px', marginRight: '6px' }}>Correct:</label>
                        <select value={customAnswer} onChange={e => setCustomAnswer(+e.target.value)} style={{ borderRadius: '4px', padding: '3px 8px' }}>
                          <option value={0}>A</option><option value={1}>B</option><option value={2}>C</option><option value={3}>D</option>
                        </select>
                      </div>
                      <button onClick={handleCustomQuiz} className="btn btn-primary" style={{ backgroundColor: '#003A6A', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
                        <span className="glyphicon glyphicon-send" style={{ marginRight: '4px' }}></span> Push Quiz
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Quiz Results */}
                {activeQuiz && (
                  <div className="erp-panel">
                    <div className="erp-panel-head"><span className="glyphicon glyphicon-stats"></span> Live Results</div>
                    <div className="erp-panel-body">
                      <p style={{ fontWeight: 600, fontSize: '13px', marginBottom: '12px' }}>Q: {activeQuiz.question}</p>
                      {['A','B','C','D'].map((letter, idx) => {
                        const count = quizResults[letter];
                        const pct = quizResults.total > 0 ? Math.round((count / quizResults.total) * 100) : 0;
                        const correct = idx === activeQuiz.correctIndex;
                        return (
                          <div key={letter} style={{ marginBottom: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '2px' }}>
                              <span style={{ fontWeight: correct ? 700 : 400, color: correct ? '#27ae60' : '#333' }}>Option {letter} {correct && '✓'}</span>
                              <span className="text-muted">{count} ({pct}%)</span>
                            </div>
                            <div style={{ height: '6px', backgroundColor: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', backgroundColor: correct ? '#27ae60' : '#003A6A', transition: 'width 0.4s' }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== RESULTS TAB ===== */}
        {activeTab === 'results' && (
          <div className="animate-fade-in">
            <div className="erp-panel">
              <div className="erp-panel-head"><span className="glyphicon glyphicon-list-alt"></span> Student Performance</div>
              <div className="erp-panel-body">
                <table className="erp-table">
                  <thead>
                    <tr><th>#</th><th>Student Name</th><th>Last Answer</th><th>Response Time</th><th>Total Score</th></tr>
                  </thead>
                  <tbody>
                    {[...connectedStudents].sort((a, b) => b.score - a.score).map((s, i) => (
                      <tr key={s.id}>
                        <td>{i + 1}</td>
                        <td style={{ fontWeight: 600 }}>
                          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#27ae60', marginRight: '8px' }}></span>
                          {s.name}
                        </td>
                        <td>
                          {s.lastAnswer ? (
                            <span className={`label ${s.lastAnswer === ['A','B','C','D'][activeQuiz?.correctIndex] ? 'label-success' : 'label-danger'}`}>
                              {s.lastAnswer}
                            </span>
                          ) : <span className="text-muted">—</span>}
                        </td>
                        <td>{s.speed ? `${s.speed}s` : '—'}</td>
                        <td style={{ fontWeight: 700, color: '#003A6A' }}>{s.score} pts</td>
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

export default TeacherDashboard;
