import React from 'react';
import { Search, Plus } from 'lucide-react';
import api from '../../services/api';

const UserManagement = ({
  userSearch,
  setUserSearch,
  userRoleFilter,
  setUserRoleFilter,
  setShowAddUserModal,
  filteredUsers,
  triggerToast,
  setUsersList
}) => {
  return (
    <div className="animate-fade-in">
      {/* Controls block */}
      <div className="controls-row">
        <div className="search-input-wrapper">
          <Search className="search-icon-inside h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            className="search-input-field"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
        </div>

        <div className="filter-buttons-row">
          {['All', 'Admin', 'Faculty', 'Student'].map((role) => (
            <button 
              key={role} 
              className={`btn-filter-pill ${userRoleFilter === role ? 'active' : ''}`}
              onClick={() => setUserRoleFilter(role)}
            >
              {role}s
            </button>
          ))}
        </div>

        <button className="btn-primary-rect" onClick={() => setShowAddUserModal(true)}>
          <Plus className="h-4 w-4" />
          <span>Register User</span>
        </button>
      </div>

      {/* Roster Table */}
      <div className="premium-table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>System Role</th>
              <th>Identifier Info</th>
              <th>Roster Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No profiles matching search criteria.
                </td>
              </tr>
            ) : (
              filteredUsers.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong style={{ color: 'var(--text)' }}>{item.name}</strong>
                  </td>
                  <td style={{ color: '#475569' }}>{item.email}</td>
                  <td>
                    <span className={`badge-role ${item.role.toLowerCase()}`}>
                      {item.role}
                    </span>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {item.role === 'Student' && `Roll: ${item.roll}`}
                    {item.role === 'Faculty' && `Dept: ${item.dept}`}
                    {item.role === 'Admin' && 'System Access'}
                  </td>
                  <td>
                    <span className={`badge-status ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn-action-small"
                      title="Edit user details"
                      onClick={() => triggerToast(`Edit details for ${item.name} — coming soon.`, 'info')}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-action-small btn-action-danger"
                      style={{ color: 'var(--danger)', marginLeft: '8px' }}
                      onClick={async () => {
                        const newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
                        try {
                          await api.toggleUserStatus(item._id || item.id, newStatus);
                          setUsersList(prev => prev.map(u => (u._id || u.id) === (item._id || item.id) ? { ...u, status: newStatus } : u));
                          triggerToast(`${item.name} status updated to ${newStatus}!`);
                        } catch (err) {
                          console.error(err);
                          triggerToast(err.message || "Failed to update user status", "error");
                        }
                      }}
                    >
                      {item.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
