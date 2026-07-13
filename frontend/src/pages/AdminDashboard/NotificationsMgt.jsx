import React from 'react';
import { Bell } from 'lucide-react';

const NotificationsMgt = ({
  notifications,
  unreadNotificationsCount,
  markAllNotificationsAsRead,
  deleteNotification
}) => {
  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div className="section-header-title" style={{ margin: 0 }}>
          <Bell className="h-5 w-5 text-indigo-600" />
          <span>Admin Alerts & Event Feed</span>
        </div>
        {unreadNotificationsCount > 0 && (
          <button className="btn-primary-rect" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={markAllNotificationsAsRead}>
            Mark All As Read
          </button>
        )}
      </div>

      <div className="gorgeous-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
            No alerts currently logged in feed.
          </div>
        ) : (
          notifications.map((n) => (
            <div 
              key={n.id} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '16px', 
                borderRadius: '8px', 
                border: '1px solid var(--border)',
                backgroundColor: n.read ? 'white' : 'var(--primary-light)',
                borderLeft: n.read ? '1px solid var(--border)' : '4px solid var(--primary)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '14px', fontWeight: n.read ? '500' : '700', color: 'var(--text)' }}>
                  {n.text}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{n.time}</span>
              </div>

              <button 
                className="btn-action-small btn-action-danger"
                style={{ color: 'var(--danger)' }}
                onClick={() => deleteNotification(n.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsMgt;
