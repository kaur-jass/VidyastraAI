import React from 'react';
import { Camera, Settings } from 'lucide-react';

const LectureRecorder = ({
  isRecording,
  recordingSeconds,
  formatRecTime,
  recCourse,
  setRecCourse,
  recTopic,
  setRecTopic,
  recQuality,
  setRecQuality,
  recMic,
  setRecMic,
  startMockRecording,
  stopMockRecording
}) => {
  return (
    <div className="view-fade-in">
      <div className="dashboard-main-grid">
        {/* Left Preview Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="gorgeous-card">
            <h3 className="section-header-title">
              <Camera className="h-4 w-4 text-indigo-500" /> Video Camera Simulator
            </h3>
            
            <div className="camera-simulation-preview">
              {isRecording ? (
                <>
                  <div className="camera-active-signal">
                    <div className="record-dot-blinking" />
                    <span>REC: {formatRecTime(recordingSeconds)}</span>
                  </div>
                  <Camera className="h-16 w-16 text-red-500 animate-pulse" />
                  <span style={{ fontSize: '14px', color: 'white', marginTop: '12px', fontWeight: '700' }}>
                    Simulated Web camera streaming active...
                  </span>
                </>
              ) : (
                <>
                  <Camera className="h-16 w-16 text-slate-700" />
                  <span style={{ fontSize: '13px', color: '#64748B', marginTop: '12px', fontWeight: '600' }}>
                    Camera feeds offline. Click start recording below.
                  </span>
                </>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {isRecording ? (
                <button 
                  onClick={stopMockRecording}
                  className="faculty-action-btn-styled"
                  style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }}
                >
                  Stop Recording
                </button>
              ) : (
                <button 
                  onClick={startMockRecording}
                  className="faculty-action-btn-styled"
                >
                  Start Recording
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Form Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="gorgeous-card">
            <h3 className="section-header-title">
              <Settings className="h-4 w-4 text-indigo-500" /> Stream Settings
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Course Select</label>
                <select 
                  value={recCourse} 
                  onChange={(e) => setRecCourse(e.target.value)}
                  style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid var(--border)', padding: '0 10px', outline: 'none' }}
                >
                  <option value="CS201">Data Structures & Algorithms (CS201)</option>
                  <option value="CS202">Database Management Systems (CS202)</option>
                  <option value="CS203">Operating Systems (CS203)</option>
                  <option value="CS204">Computer Networks (CS204)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Lecture Topic Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Graph Algorithms: BFS & DFS"
                  value={recTopic}
                  onChange={(e) => setRecTopic(e.target.value)}
                  style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid var(--border)', padding: '0 10px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Video Quality</label>
                  <select 
                    value={recQuality} 
                    onChange={(e) => setRecQuality(e.target.value)}
                    style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid var(--border)', padding: '0 10px', outline: 'none' }}
                  >
                    <option value="720p">HD 720p</option>
                    <option value="1080p">FHD 1080p</option>
                    <option value="4k">UHD 4K</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>Audio Mic Input</label>
                  <select 
                    value={recMic} 
                    onChange={(e) => setRecMic(e.target.value)}
                    style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid var(--border)', padding: '0 10px', outline: 'none' }}
                  >
                    <option value="Default Input">System Default microphone</option>
                    <option value="USB Mic">External USB Microphone</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureRecorder;
