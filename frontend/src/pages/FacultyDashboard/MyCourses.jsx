import React from 'react';

const MyCourses = ({
  courses,
  setLibSearch,
  setActiveTab,
  triggerToast
}) => {
  return (
    <div className="view-fade-in">
      <div className="courses-grid-cards">
        {courses.map((course, idx) => (
          <div key={idx} className="course-fancy-card">
            <div className={`course-fancy-header bg-gradient-to-br ${course.bgGradient}`}>
              <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', marginBottom: '8px' }}>
                {course.code}
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>{course.name}</h3>
              <span style={{ fontSize: '12px', display: 'block', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>
                {course.studentsCount} Students Enrolled
              </span>
            </div>

            <div className="course-fancy-body">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Syllabus Completion</span>
                  <span style={{ color: 'var(--text)' }}>{course.progress}%</span>
                </div>
                <div className="fancy-progress-bar-container">
                  <div className="fancy-progress-bar-fill" style={{ width: `${course.progress}%`, backgroundColor: '#4F46E5' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => {
                    setLibSearch(course.code);
                    setActiveTab('library');
                    triggerToast(`Displaying documents for ${course.name}`);
                  }}
                  style={{ flex: 1, backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', padding: '8px', fontSize: '12px', fontWeight: '600', borderRadius: '6px', cursor: 'pointer', color: 'var(--text)' }}
                >
                  Course Files
                </button>
                <button 
                  onClick={() => triggerToast(`Managing settings for ${course.name}`)}
                  className="faculty-action-btn-styled"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Manage Course
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
