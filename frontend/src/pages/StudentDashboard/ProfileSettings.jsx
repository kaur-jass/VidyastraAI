import React from 'react';

const ProfileSettings = ({
  profile,
  setProfile,
  handleSaveSettings
}) => {
  return (
    <div className="view-fade-in">
      <div className="settings-grid">
        {/* Left Profile card */}
        <div className="profile-side-card">
          <div className="profile-avatar-large">
            {profile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0', color: 'var(--text)' }}>{profile.name}</h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Roll No: {profile.rollNo}</span>
          
          <div style={{ borderTop: '1px solid var(--border)', marginTop: '20px', paddingTop: '20px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Degree & Major</span>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: '600' }}>{profile.degree}</p>
            </div>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Email Address</span>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: '600' }}>{profile.email}</p>
            </div>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Current Semester</span>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: '600' }}>{profile.semester}</p>
            </div>
          </div>
        </div>

        {/* Right Settings Form */}
        <div className="gorgeous-card">
          <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 20px 0', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            Configure Student Settings
          </h3>

          <form onSubmit={handleSaveSettings}>
            <div className="settings-form-group">
              <label className="settings-form-label">Full Legal Name</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="settings-input-control" 
              />
            </div>

            <div className="settings-form-group">
              <label className="settings-form-label">Contact Phone Number</label>
              <input 
                type="text" 
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="settings-input-control" 
              />
            </div>

            <div className="settings-form-group">
              <label className="settings-form-label">Primary Career Study Goal</label>
              <input 
                type="text" 
                value={profile.studyGoal}
                onChange={(e) => setProfile({ ...profile, studyGoal: e.target.value })}
                className="settings-input-control" 
              />
            </div>

            <div className="settings-form-group">
              <label className="settings-form-label">Preferred Daily Study Window</label>
              <input 
                type="text" 
                value={profile.studyTime}
                onChange={(e) => setProfile({ ...profile, studyTime: e.target.value })}
                className="settings-input-control" 
              />
            </div>

            <h4 style={{ fontSize: '14px', fontWeight: '700', margin: '24px 0 12px 0' }}>Notification Toggles</h4>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="form-toggle-row">
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>Email Summaries</span>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Get weekly progress summaries via registered email</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={profile.emailAlerts}
                  onChange={(e) => setProfile({ ...profile, emailAlerts: e.target.checked })}
                  className="toggle-switch-input" 
                />
              </div>

              <div className="form-toggle-row">
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>SMS Alerts & Reminders</span>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Receive immediate reminders about due deadlines</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={profile.smsAlerts}
                  onChange={(e) => setProfile({ ...profile, smsAlerts: e.target.checked })}
                  className="toggle-switch-input" 
                />
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-submit-settings">
                Save Configurations
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
