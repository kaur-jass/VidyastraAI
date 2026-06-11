import React, { useState, useEffect, useRef } from 'react';
import ERPLayout from '../components/ERPLayout';

const Login = ({ onLogin, onNavigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const canvasRef = useRef(null);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let code = '';
    for (let i = 0; i < 5; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setCaptchaCode(code);
    setErrorMsg('');
  };

  const drawCaptcha = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#eff6ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(${Math.floor(Math.random()*100)}, ${Math.floor(Math.random()*150)}, 255, 0.4)`;
      ctx.lineWidth = Math.random() * 2 + 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
    ctx.font = 'bold 24px Courier New';
    ctx.fillStyle = '#003A6A';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < captchaCode.length; i++) {
      const x = 15 + i * 20, y = canvas.height / 2 + (Math.random() * 10 - 5);
      const angle = (Math.random() * 30 - 15) * Math.PI / 180;
      ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
      ctx.fillText(captchaCode[i], 0, 0); ctx.restore();
    }
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(0, 58, 106, ${Math.random() * 0.3})`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }
  };

  useEffect(() => { generateCaptcha(); }, []);
  useEffect(() => { if (captchaCode) drawCaptcha(); }, [captchaCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) { setErrorMsg('Please enter Username'); return; }
    if (!password.trim()) { setErrorMsg('Please enter Password'); return; }
    if (captchaInput.toLowerCase() !== captchaCode.toLowerCase()) {
      setErrorMsg('Invalid CAPTCHA. Please try again.');
      generateCaptcha(); setCaptchaInput(''); return;
    }
    const role = username.toLowerCase() === 'admin' ? 'admin' : username.toLowerCase() === 'teacher' ? 'teacher' : 'student';
    const names = { admin: 'Admin Panel', teacher: 'Dr. Sarah Verma', student: username };
    onLogin(role, names[role] || username);
  };

  const handleQuickLogin = (role) => {
    const names = { admin: 'Admin Panel', teacher: 'Dr. Sarah Verma', student: 'Rohan Sharma' };
    onLogin(role, names[role]);
  };

  return (
    <ERPLayout isPublic onNavigate={onNavigate}>
      <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px 15px' }}>
        <div className="login-card animate-fade-in">
          <div className="login-header">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#003a6a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 21a6 6 0 0 0-12 0" /><circle cx="12" cy="10" r="4" /><path d="M12 2v2" />
            </svg>
            <h1 className="login-heading">VidyastraAI Login</h1>
          </div>
          <br />

          {errorMsg && (
            <div className="alert alert-danger" style={{ fontSize: '13px', borderRadius: '6px', padding: '10px 15px', marginBottom: '12px' }}>
              <strong>Error: </strong>{errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username" style={{ fontWeight: 600, color: '#4b5563' }}>Username:</label>
              <input type="text" className="form-control" id="username" placeholder="Enter Username" value={username} onChange={e => setUsername(e.target.value)} style={{ borderRadius: '6px', height: '38px' }} />
            </div>
            <div className="form-group">
              <label htmlFor="pwd" style={{ fontWeight: 600, color: '#4b5563' }}>Password:</label>
              <input type="password" className="form-control" id="pwd" placeholder="Enter Password" value={password} onChange={e => setPassword(e.target.value)} style={{ borderRadius: '6px', height: '38px' }} />
            </div>
            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label style={{ fontWeight: 600, color: '#4b5563', display: 'block' }}>CAPTCHA:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <canvas ref={canvasRef} width="130" height="45" className="captcha-canvas" onClick={generateCaptcha} title="Click to refresh" />
                <button type="button" className="btn btn-default" onClick={generateCaptcha} style={{ height: '45px', borderRadius: '6px' }} title="Refresh">
                  <span className="glyphicon glyphicon-refresh"></span>
                </button>
              </div>
            </div>
            <div className="form-group">
              <input type="text" className="form-control" id="captcha" placeholder="Enter Captcha Here" value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} style={{ borderRadius: '6px', height: '38px' }} />
            </div>
            <br />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', height: '42px', backgroundColor: '#003A6A', border: 'none' }}>
              Login
            </button>
            <br /><br />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#6b7280' }}>* Use: <b>admin</b>, <b>teacher</b>, or <b>student</b></span>
              <a style={{ color: '#990000', cursor: 'pointer', fontSize: '14px' }} onClick={() => onNavigate('forgot')}>Forgot Password?</a>
            </div>
          </form>

          {/* Quick Demo */}
          <hr style={{ margin: '20px 0 15px' }} />
          <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginBottom: '10px' }}>Quick Demo Login:</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button onClick={() => handleQuickLogin('admin')} className="btn btn-xs" style={{ backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 600, padding: '5px 14px' }}>Admin</button>
            <button onClick={() => handleQuickLogin('teacher')} className="btn btn-xs" style={{ backgroundColor: '#2980b9', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 600, padding: '5px 14px' }}>Teacher</button>
            <button onClick={() => handleQuickLogin('student')} className="btn btn-xs" style={{ backgroundColor: '#27ae60', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 600, padding: '5px 14px' }}>Student</button>
          </div>
        </div>
      </div>
    </ERPLayout>
  );
};

export default Login;
