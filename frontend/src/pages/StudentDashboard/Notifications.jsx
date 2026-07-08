import React from 'react';

const Notifications = ({
  unreadNotificationsCount,
  markAllNotificationsRead,
  notifications
}) => {
  return (
    <div className="view-fade-in">
      <div className="gorgeous-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>
            You have {unreadNotificationsCount} unread system alerts
          </span>
          {unreadNotificationsCount > 0 && (
            <button 
              onClick={markAllNotificationsRead}
              style={{ border: 'none', background: 'transparent', color: 'var(--primary)', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
            >
              Mark all as read
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: notif.read ? 'white' : '#F5F3FF',
                borderColor: notif.read ? 'var(--border)' : '#DDD6FE',
                borderWidth: '1px',
                borderStyle: 'solid',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                marginTop: '2px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: notif.read ? 'transparent' : '#8B5CF6',
                flexShrink: 0
              }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '13.5px', fontWeight: notif.read ? '500' : '700', color: 'var(--text)' }}>
                  {notif.text}
                </p>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
