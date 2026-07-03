import React from 'react';

const ProfileSettings = ({
  profile,
  setProfile,
  handleSaveProfile
}) => {
  return (
    <div className="view-fade-in">
      <div className="settings-grid">
        <div className="profile-side-card">
          <div className="profile-avatar-large">
            SV
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0', color: 'var(--text)' }}>{profile.name}</h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Faculty ID: CSE-FAC-8822</span>
          
          <div style={{ borderTop: '1px solid var(--border)', marginTop: '20px', paddingTop: '20px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Department</span>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: '600' }}>{profile.department}</p>
            </div>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Email Address</span>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: '600' }}>{profile.email}</p>
            </div>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>Office Space</span>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', fontWeight: '600' }}>{profile.office}</p>
            </div>
          </div>
        </div>

        <div className="gorgeous-card">
          <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 20px 0', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            Configure Faculty Parameters
          </h3>

          <form onSubmit={handleSaveProfile}>
            <div className="settings-form-group">
              <label className="settings-form-label">Full Name & Title</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="settings-input-control" 
              />
            </div>

            <div className="settings-form-group">
              <label className="settings-form-label">Office Location</label>
              <input 
                type="text" 
                value={profile.office}
                onChange={(e) => setProfile({ ...profile, office: e.target.value })}
                className="settings-input-control" 
              />
            </div>

            <div className="settings-form-group">
              <label className="settings-form-label">Contact Mobile</label>
              <input 
                type="text" 
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="settings-input-control" 
              />
            </div>

            <h4 style={{ fontSize: '14px', fontWeight: '700', margin: '24px 0 12px 0' }}>Syllabus Automations</h4>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="form-toggle-row">
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>Direct SMS Notifications</span>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Get SMS alerts when students submit assignments</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={profile.smsAlerts}
                  onChange={(e) => setProfile({ ...profile, smsAlerts: e.target.checked })}
                  className="toggle-switch-input" 
                />
              </div>

              <div className="form-toggle-row">
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>AI Automated Grading Suggestions</span>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Pre-fill grading scores based on code compilation drafts</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={profile.autoGrader}
                  onChange={(e) => setProfile({ ...profile, autoGrader: e.target.checked })}
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
