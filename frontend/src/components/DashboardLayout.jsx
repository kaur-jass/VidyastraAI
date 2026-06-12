import React, { useState } from 'react';

const DashboardLayout = ({
  user,
  onLogout,
  activeTab,
  onTabChange,
  sidebarItems,
  dashboardTitle,
  roleLabel,
  roleBadgeClass, // 'teacher', 'student', 'admin'
  notificationCount = 3,
  notifications = [],
  children
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const currentFormattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="vidyastra-dashboard-root">
      {/* Global Scoped Dashboard Layout Stylesheet */}
      <style>{`
        .vidyastra-dashboard-root {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #f3f4f6;
          font-family: 'Inter', sans-serif;
          color: #1f2937;
        }
        
        /* Unified Top Header */
        .dash-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #002e5b;
          color: white;
          padding: 8px 24px;
          height: 64px;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .header-logo-img {
          height: 42px;
          width: auto;
        }
        .header-center {
          font-family: 'Outfit', sans-serif;
          font-size: 18px;
          font-weight: 700;
        }
        .header-center-brand {
          color: #fecd0b;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
        }
        .bell-btn {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          position: relative;
          padding: 4px;
          transition: transform 0.2s;
        }
        .bell-btn:hover {
          transform: scale(1.1);
        }
        .badge-red {
          position: absolute;
          top: -2px;
          right: -2px;
          background-color: #ef4444;
          color: white;
          font-size: 9px;
          border-radius: 50%;
          width: 14px;
          height: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .user-menu-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: background-color 0.2s;
        }
        .user-menu-trigger:hover {
          background-color: rgba(255,255,255,0.1);
        }
        .user-avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .user-avatar-icon {
          width: 18px;
          height: 18px;
          color: #4b5563;
        }
        .user-profile-name {
          font-size: 14px;
          font-weight: 600;
          color: white;
        }
        .user-role-badge-teacher {
          background-color: #e2e8f0;
          color: #1e293b;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 4px;
          margin-left: 4px;
        }
        .user-role-badge-student {
          background-color: #2563eb;
          color: white;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 4px;
          margin-left: 4px;
        }
        .user-role-badge-admin {
          background-color: #2563eb;
          color: white;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 4px;
          margin-left: 4px;
        }
        .dropdown-chevron {
          font-size: 10px;
          color: #cbd5e1;
        }

        /* Container Layout */
        .dash-body {
          display: flex;
          flex: 1;
        }
        
        /* Sidebar Vertical navigation */
        .dash-sidebar {
          width: 240px;
          background-color: white;
          border-right: 1px solid #e5e7eb;
          padding: 16px 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex-shrink: 0;
        }
        .sidebar-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 500;
          color: #4b5563;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }
        .sidebar-item-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sidebar-item:hover {
          background-color: #f3f4f6;
          color: #002e5b;
        }
        .sidebar-item.active {
          background-color: #002e5b;
          color: white;
          font-weight: 600;
        }
        .sidebar-indicator {
          font-size: 10px;
          color: #9ca3af;
        }
        .sidebar-item.active .sidebar-indicator {
          color: white;
        }
        
        /* Content Area */
        .dash-content {
          flex: 1;
          padding: 24px 30px;
          background-color: #f9fafb;
          overflow-y: auto;
        }
        
        /* Header Title Banner */
        .greeting-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .greeting-title {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 4px 0;
        }
        .greeting-sub {
          color: #6b7280;
          font-size: 14px;
          margin: 0;
        }
        .date-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 500;
          color: #4b5563;
        }

        /* Responsive clean tables */
        .table-responsive-new {
          overflow-x: auto;
          width: 100%;
        }
        .custom-table-new {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .custom-table-new th {
          background-color: #f9fafb;
          color: #4b5563;
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: left;
          padding: 12px 16px;
          border-bottom: 2px solid #e5e7eb;
        }
        .custom-table-new td {
          padding: 12px 16px;
          border-bottom: 1px solid #f3f4f6;
          vertical-align: middle;
        }
        .custom-table-new tr:hover td {
          background-color: #f9fafb;
        }
        
        /* Panel Styles */
        .panel-card-new {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
        }
        .panel-header-new {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #f3f4f6;
          padding-bottom: 12px;
          margin-bottom: 12px;
        }
        .panel-title-new {
          font-size: 15px;
          font-weight: 700;
          color: #002e5b;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
        }

        /* Notification Box */
        .notification-dropdown-box {
          position: absolute;
          top: 55px;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          width: 320px;
          border-radius: 8px;
          padding: 12px;
          z-index: 105;
        }
        .notif-header {
          font-weight: bold;
          font-size: 14px;
          border-bottom: 1px solid #f3f4f6;
          padding-bottom: 8px;
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
          color: #002e5b;
        }
        .notif-item {
          padding: 8px;
          border-radius: 4px;
          font-size: 12px;
          border-bottom: 1px solid #f9fafb;
          color: #4b5563;
          cursor: pointer;
        }
        .notif-item:hover {
          background-color: #f3f4f6;
          color: #002e5b;
        }
        
        /* Floating Toast notification */
        .floating-toast-new {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: #002e5b;
          color: white;
          padding: 14px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          font-size: 14px;
          font-weight: 500;
          z-index: 999;
          border-left: 4px solid #fecd0b;
          animation: slide-in-toast 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slide-in-toast {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        /* Profile Dropdown Box */
        .profile-dropdown-box {
          position: absolute;
          top: 55px;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          width: 200px;
          border-radius: 8px;
          padding: 8px 0;
          z-index: 105;
        }
        .profile-dropdown-item {
          padding: 10px 16px;
          font-size: 13px;
          color: #4b5563;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .profile-dropdown-item:hover {
          background-color: #f3f4f6;
          color: #002e5b;
        }

        /* Footer */
        .dash-footer {
          background-color: #002e5b;
          color: white;
          padding: 12px;
          text-align: center;
          font-size: 13px;
          margin-top: auto;
          box-shadow: 0 -1px 3px rgba(0,0,0,0.1);
        }

        .animate-fade-in {
          animation: fadeIn 0.35s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Reusable Stat Card and Grid Styles */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }
        .stat-card-new {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        .stat-meta {
          display: flex;
          flex-direction: column;
        }
        .stat-number-new {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          line-height: 1.2;
        }
        .stat-label-new {
          font-size: 13px;
          color: #4b5563;
          font-weight: 500;
        }
        .stat-subtext-new {
          font-size: 11px;
          margin-top: 2px;
          font-weight: 600;
        }
        .color-blue-bg { background-color: #eff6ff; color: #1d4ed8; }
        .color-green-bg { background-color: #f0fdf4; color: #15803d; }
        .color-purple-bg { background-color: #faf5ff; color: #7e22ce; }
        .color-red-bg { background-color: #fef2f2; color: #dc2626; }
        .color-orange-bg { background-color: #fff7ed; color: #c2410c; }
      `}</style>

      {/* Header */}
      <header className="dash-header">
        <div className="header-left">
          <img 
            className="header-logo-img" 
            src="https://v1.nitj.ac.in/erp/Images/logo.png" 
            alt="NIT Jalandhar Logo" 
          />
        </div>

        <div className="header-center">
          <span className="header-center-brand">VidyastraAI</span> | {dashboardTitle}
        </div>

        <div className="header-right">
          {/* Notifications */}
          <button className="bell-btn" onClick={() => { setShowNotifications(!showNotifications); setShowProfileDropdown(false); }}>
            <span className="glyphicon glyphicon-bell"></span>
            <span className="badge-red">{notificationCount}</span>
          </button>
          
          {showNotifications && (
            <div className="notification-dropdown-box">
              <div className="notif-header">
                <span>Notifications</span>
                <span style={{ color: '#2563eb', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }} onClick={() => triggerToast("Cleared notifications")}>Mark read</span>
              </div>
              {notifications.map((n, i) => (
                <div key={i} className="notif-item" onClick={() => { if (onTabChange && n.tab) onTabChange(n.tab); setShowNotifications(false); }}>
                  {n.text}
                </div>
              ))}
            </div>
          )}

          {/* User profile menu */}
          <div className="user-menu-trigger" onClick={() => { setShowProfileDropdown(!showProfileDropdown); setShowNotifications(false); }}>
            <div className="user-avatar-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="user-avatar-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="user-profile-name">{user?.name || "User"}</span>
            <span className={`user-role-badge-${roleBadgeClass}`}>{roleLabel}</span>
            <span className="glyphicon glyphicon-chevron-down dropdown-chevron"></span>
          </div>

          {showProfileDropdown && (
            <div className="profile-dropdown-box">
              <div className="profile-dropdown-item" onClick={() => { if (onTabChange) onTabChange('settings'); setShowProfileDropdown(false); }}>
                <span className="glyphicon glyphicon-cog"></span> Settings
              </div>
              <div className="profile-dropdown-item" style={{ color: '#ef4444', borderTop: '1px solid #f3f4f6' }} onClick={onLogout}>
                <span className="glyphicon glyphicon-log-out"></span> Sign Out
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Body with Sidebar */}
      <div className="dash-body">
        <aside className="dash-sidebar">
          {sidebarItems.map(item => (
            <button 
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`} 
              onClick={() => onTabChange(item.id)}
            >
              <div className="sidebar-item-content">
                <span className={`glyphicon ${item.icon}`}></span>
                <span>{item.label}</span>
              </div>
              {item.hasSubmenu && <span className="glyphicon glyphicon-chevron-right sidebar-indicator"></span>}
            </button>
          ))}
        </aside>

        <main className="dash-content">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="dash-footer">
        Copyright © 2026 VidyastraAI Learning System
      </footer>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="floating-toast-new">
          <span className="glyphicon glyphicon-info-sign" style={{ marginRight: '8px' }}></span>
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
