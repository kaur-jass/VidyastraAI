import React from 'react';

const StudentManagement = ({
  studentSearch,
  setStudentSearch,
  students
}) => {
  return (
    <div className="view-fade-in">
      <div className="gorgeous-card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>Student Performance Dashboard</h3>
          <input
            type="text"
            placeholder="Search students..."
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            style={{
              height: '36px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              padding: '0 12px',
              fontSize: '13px',
              outline: 'none',
              width: '260px'
            }}
          />
        </div>
      </div>

      <div className="gorgeous-card">
        <div className="fancy-table-container">
          <table className="fancy-table">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Student Name</th>
                <th>Attendance Rate</th>
                <th>Syllabus Completion</th>
                <th>Academic Standing</th>
              </tr>
            </thead>
            <tbody>
              {students
                .filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.roll.includes(studentSearch))
                .map((std) => (
                  <tr key={std.roll}>
                    <td>{std.roll}</td>
                    <td>
                      <span style={{ fontWeight: '700' }}>{std.name}</span>
                    </td>
                    <td>{std.attendance}%</td>
                    <td>{std.progress}%</td>
                    <td>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: std.status === 'Active' ? '#D1FAE5' : '#FEE2E2',
                        color: std.status === 'Active' ? '#059669' : '#EF4444'
                      }}>
                        {std.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;
