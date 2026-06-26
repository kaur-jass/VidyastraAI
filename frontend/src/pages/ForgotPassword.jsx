import { useState } from 'react';
import ERPLayout from '../components/ERPLayout';
import api from '../services/api';

const ForgotPassword = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const [loaderText, setLoaderText] = useState('Please Wait');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { alert('Please Enter Email ID'); return; }
    setShowLoader(true);
    setLoaderText('Sending Reset Link...');
    try {
      const res = await api.forgotPassword(email);
      setShowLoader(false);
      alert(res.message || 'Please Check your Email Inbox for Password Reset Link.');
      onNavigate('login');
    } catch (err) {
      setShowLoader(false);
      alert(err.message || 'Error requesting password reset.');
    }
  };

  return (
    <ERPLayout isPublic onNavigate={onNavigate}>
      {showLoader && (
        <div className="forgot-overlay">
          <div className="forgot-loader-container">
            <div className="forgot-loader-spin"></div>
            <div className="forgot-loader-text">{loaderText}</div>
          </div>
        </div>
      )}

      <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px 15px' }}>
        <div className="login-card animate-fade-in">
          <div className="login-header">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#003a6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 9.9-1" />
              <circle cx="12" cy="16" r="1.5" />
            </svg>
            <h1 className="login-heading">Forgot Password</h1>
          </div>
          <br /><br />
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" style={{ fontWeight: 600, color: '#4b5563' }}>Enter Email ID:</label>
              <input type="email" className="form-control" id="email" placeholder="Enter your Email ID" value={email} onChange={e => setEmail(e.target.value)} style={{ borderRadius: '6px', height: '38px' }} />
            </div>
            <br />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', height: '42px', backgroundColor: '#003A6A', border: 'none' }}>
              Submit
            </button>
            <br /><br />
            <a style={{ color: '#990000', cursor: 'pointer', fontSize: '14px' }} onClick={() => onNavigate('login')}>Click for Login Page</a>
          </form>
        </div>
      </div>
    </ERPLayout>
  );
};

export default ForgotPassword;
