import React from 'react';

const MyCourses = ({
  courses,
  setLectureFilter,
  setActiveTab,
  setQuizTopic,
  triggerToast
}) => {
  return (
    <div className="view-fade-in">
      <div className="courses-grid-cards">
        {courses.map((course, idx) => (
          <div key={idx} className="course-fancy-card">
            <div className={`course-fancy-header bg-gradient-to-br ${course.bgGradient}`}>
              <span className="text-white text-xs font-bold bg-white/20 px-2.5 py-1 rounded" style={{ display: 'inline-block', marginBottom: '8px' }}>
                {course.code}
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>{course.name}</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginTop: '6px' }}>Instructor: {course.instructor}</p>
            </div>

            <div className="course-fancy-body">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Syllabus Covered</span>
                  <span style={{ color: 'var(--text)' }}>{course.progress}%</span>
                </div>
                <div className="fancy-progress-bar-container">
                  <div 
                    className="fancy-progress-bar-fill" 
                    style={{ 
                      width: `${course.progress}%`,
                      backgroundColor: course.code === 'CS201' ? '#4F46E5' : course.code === 'CS202' ? '#A855F7' : course.code === 'CS203' ? '#F59E0B' : '#10B981'
                    }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button 
                  onClick={() => {
                    setLectureFilter(course.category);
                    setActiveTab('lectures');
                    triggerToast(`Displaying lectures for ${course.name}`);
                  }}
                  style={{ flex: 1, backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', padding: '8px', fontSize: '12px', fontWeight: '600', borderRadius: '6px', cursor: 'pointer', color: 'var(--text)' }}
                >
                  Lectures
                </button>
                <button 
                  onClick={() => {
                    setQuizTopic(course.category);
                    setActiveTab('quiz');
                    triggerToast(`Preparing quiz workspace for ${course.name}`);
                  }}
                  style={{ flex: 1, backgroundColor: '#4F46E5', border: 'none', color: 'white', padding: '8px', fontSize: '12px', fontWeight: '600', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Practice Test
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
