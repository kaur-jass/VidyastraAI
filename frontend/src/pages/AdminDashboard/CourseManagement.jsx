import React from 'react';
import { Search, Plus } from 'lucide-react';

const CourseManagement = ({
  courseSearch,
  setCourseSearch,
  setShowAddCourseModal,
  filteredCourses,
  triggerToast,
  setEditingCourse,
  setShowEditCourseModal
}) => {
  return (
    <div className="animate-fade-in">
      <div className="controls-row">
        <div className="search-input-wrapper">
          <Search className="search-icon-inside h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search courses catalog by name, code or faculty..." 
            className="search-input-field"
            value={courseSearch}
            onChange={(e) => setCourseSearch(e.target.value)}
          />
        </div>
        
        <button 
          className="btn-primary-rect" 
          onClick={() => setShowAddCourseModal(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Create Course</span>
        </button>
      </div>

      <div className="premium-table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Curriculum Category</th>
              <th>Faculty Assigned</th>
              <th>Students Enrolled</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No matching courses configured.
                </td>
              </tr>
            ) : (
              filteredCourses.map((c) => (
                <tr key={c.code}>
                  <td><strong style={{ color: 'var(--primary)' }}>{c.code}</strong></td>
                  <td><strong style={{ color: 'var(--text)' }}>{c.name}</strong></td>
                  <td>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#F1F5F9', color: '#475569' }}>
                      {c.category}
                    </span>
                  </td>
                  <td>{c.instructor}</td>
                  <td>
                    <strong style={{ color: '#0F172A' }}>{c.enrollments}</strong> students
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn-action-small"
                      onClick={() => {
                        setEditingCourse(c);
                        setShowEditCourseModal(true);
                      }}
                    >
                      Manage Course
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

export default CourseManagement;
