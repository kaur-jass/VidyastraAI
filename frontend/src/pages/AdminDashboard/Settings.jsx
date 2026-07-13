import React from 'react';
import { Settings } from 'lucide-react';

const AdminSettings = ({
  settingsForm,
  setSettingsForm,
  handleSaveSettings,
  triggerToast
}) => {
  return (
    <div className="animate-fade-in">
      <div className="settings-layout">
        {/* Left side nav links */}
        <div className="settings-nav-sidebar">
          <span className="settings-nav-link active">General Platform</span>
          <span className="settings-nav-link" onClick={() => triggerToast("SMTP Configuration loaded", "info")}>SMTP Relay Setup</span>
          <span className="settings-nav-link" onClick={() => triggerToast("Authentication audit policies loaded", "info")}>Auth Credentials Policies</span>
          <span className="settings-nav-link" onClick={() => triggerToast("Data Retention logs audit loaded", "info")}>Log Retention Policies</span>
        </div>

        {/* Settings Input Form */}
        <div className="gorgeous-card">
          <h3 className="section-header-title">
            <Settings className="h-5 w-5 text-indigo-600" />
            <span>System Parameters Configuration</span>
          </h3>

          <form onSubmit={handleSaveSettings}>
            <div className="form-group-control">
              <label className="form-label-styled">Academic Site Title</label>
              <input 
                type="text" 
                className="form-input-text" 
                value={settingsForm.siteTitle}
                onChange={(e) => setSettingsForm({...settingsForm, siteTitle: e.target.value})}
              />
            </div>

            <div className="form-group-control">
              <label className="form-label-styled">System Notification Email Address</label>
              <input 
                type="email" 
                className="form-input-text" 
                value={settingsForm.adminEmail}
                onChange={(e) => setSettingsForm({...settingsForm, adminEmail: e.target.value})}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
              <div className="form-group-control">
                <label className="form-label-styled">SMTP Relay Hostname</label>
                <input 
                  type="text" 
                  className="form-input-text" 
                  value={settingsForm.smtpHost}
                  onChange={(e) => setSettingsForm({...settingsForm, smtpHost: e.target.value})}
                />
              </div>
              <div className="form-group-control">
                <label className="form-label-styled">SMTP Port</label>
                <input 
                  type="text" 
                  className="form-input-text" 
                  value={settingsForm.smtpPort}
                  onChange={(e) => setSettingsForm({...settingsForm, smtpPort: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group-control">
              <label className="form-label-styled">SMTP Username</label>
              <input 
                type="text" 
                className="form-input-text" 
                value={settingsForm.smtpUser}
                onChange={(e) => setSettingsForm({...settingsForm, smtpUser: e.target.value})}
              />
            </div>

            <div className="form-group-control">
              <label className="form-label-styled">SMTP Password / API Key</label>
              <input 
                type="password" 
                className="form-input-text" 
                value={settingsForm.smtpPass}
                onChange={(e) => setSettingsForm({...settingsForm, smtpPass: e.target.value})}
              />
            </div>

            <div style={{ margin: '20px 0' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
                Automated Trigger Alerts
              </h4>

              <div className="toggle-switch-row">
                <div>
                  <strong style={{ fontSize: '13px', color: 'var(--text)' }}>Notify on New Users Registration</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Email admins when new students register</span>
                </div>
                <button 
                  type="button"
                  className={`toggle-switch-btn ${settingsForm.notifyOnNewUsers ? 'active' : ''}`}
                  onClick={() => setSettingsForm({...settingsForm, notifyOnNewUsers: !settingsForm.notifyOnNewUsers})}
                >
                  <div className="toggle-switch-handle" />
                </button>
              </div>

              <div className="toggle-switch-row">
                <div>
                  <strong style={{ fontSize: '13px', color: 'var(--text)' }}>Enforce Student Verification</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Require email verification link response</span>
                </div>
                <button 
                  type="button"
                  className={`toggle-switch-btn ${settingsForm.requireEmailVerification ? 'active' : ''}`}
                  onClick={() => setSettingsForm({...settingsForm, requireEmailVerification: !settingsForm.requireEmailVerification})}
                >
                  <div className="toggle-switch-handle" />
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary-rect" style={{ width: '100%', justifyContent: 'center' }}>
              Save System Configurations
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
