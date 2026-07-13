import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Check, 
  Video, 
  Award, 
  Clock, 
  TrendingUp, 
  FileText, 
  ClipboardList, 
  Sparkles 
} from 'lucide-react';

const StudentHome = ({
  profile,
  watchedLecturesCount,
  lectures,
  courses,
  lectureProgressPercent,
  quizScorePoints,
  setActiveTab,
  setLectureFilter,
  setQuizTopic,
  triggerToast
}) => {
  return (
    <div className="view-fade-in">
      {/* Premium Welcome Banner */}
      <div className="gradient-banner">
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px', fontFamily: 'var(--heading-font)' }}>
            Welcome back, {profile.name}! 👋
          </h2>
          <p style={{ color: '#E0E7FF', fontSize: '14px', maxWidth: '480px' }}>
            You have watched {watchedLecturesCount} of {lectures.length} total lectures this semester. Complete your next quiz to maintain your streak!
          </p>
        </div>
        <GraduationCap className="gradient-banner-bg-sparks" />
      </div>

      {/* Metric Cards Grid */}
      <div className="metrics-grid">
        <div className="metric-card-styled">
          <div className="metric-icon-box" style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)' }}>
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="metric-value">{courses.length}</div>
            <div className="metric-label">Subjects Enrolled</div>
          </div>
        </div>

        <div className="metric-card-styled">
          <div className="metric-icon-box" style={{ backgroundColor: '#ECFDF5', color: '#10B981' }}>
            <Check className="h-5 w-5" />
          </div>
          <div>
            <div className="metric-value">92%</div>
            <div className="metric-label">Average Attendance</div>
          </div>
        </div>

        <div className="metric-card-styled">
          <div className="metric-icon-box" style={{ backgroundColor: '#FAF5FF', color: '#8B5CF6' }}>
            <Video className="h-5 w-5" />
          </div>
          <div>
            <div className="metric-value">{lectureProgressPercent}%</div>
            <div className="metric-label">Lecture Progress</div>
          </div>
        </div>

        <div className="metric-card-styled">
          <div className="metric-icon-box" style={{ backgroundColor: '#FFF7ED', color: '#F59E0B' }}>
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="metric-value">{quizScorePoints} pts</div>
            <div className="metric-label">AI Quiz Score</div>
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="dashboard-main-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Upcoming Classes */}
          <div className="gorgeous-card">
            <h3 className="section-header-title">
              <Clock className="h-4 w-4 text-indigo-500" /> Upcoming Classes
            </h3>
            <div className="fancy-table-container">
              <table className="fancy-table">
                <thead>
                  <tr>
                    <th>Class/Subject</th>
                    <th>Time slot</th>
                    <th>Instructor & Location</th>
                    <th>Status / Action</th>
                  </tr>
                </thead>
                <tbody>
                  {courses && courses.length > 0 ? (
                    courses.slice(0, 3).map((course, idx) => (
                      <tr key={idx}>
                        <td>
                          <span style={{ fontWeight: '700', color: '#1E293B' }}>{course.name}</span>
                          <span style={{ fontSize: '11px', display: 'block', color: 'var(--text-muted)' }}>{course.code} • {course.category || 'Theory'}</span>
                        </td>
                        <td>{course.schedule || 'TBA'}</td>
                        <td>{course.instructor || 'TBA'}</td>
                        <td>
                          <button className="btn-join-class" onClick={() => triggerToast(`Navigating to ${course.name} module...`, "success")}>
                            Access Course
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                        You are not enrolled in any courses yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="gorgeous-card">
            <h3 className="section-header-title">
              <TrendingUp className="h-4 w-4 text-emerald-500" /> Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                No recent activity to display.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="gorgeous-card" style={{ border: '1px dashed #A5B4FC', background: '#F5F3FF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#6D28D9' }}>
              <Sparkles className="h-5 w-5 animate-pulse" />
              <h3 style={{ margin: 0, fontWeight: '700', fontSize: '15px', fontFamily: 'var(--heading-font)' }}>AI Learning Advisor</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#5B21B6', lineHeight: '1.5', marginBottom: '16px' }}>
              I've analyzed your academic footprint, quiz responses, and video lecture progress. Here are my tailored suggestions:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {courses && courses.length > 0 ? (
                courses.slice(0, 3).map((course, idx) => (
                  <div key={idx} style={{ backgroundColor: 'white', padding: '14px', borderRadius: '8px', border: '1px solid #E9D5FF' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#7C3AED', textTransform: 'uppercase' }}>{course.code} Recommendation</span>
                    <p style={{ fontSize: '12px', color: 'var(--text)', margin: '4px 0 10px 0', fontWeight: '500' }}>
                      Review recent materials for {course.name} and practice with the AI Tutor to stay ahead.
                    </p>
                    <button onClick={() => setActiveTab('tutor')} style={{ backgroundColor: '#F5F3FF', border: '1px solid #C084FC', color: '#7C3AED', fontSize: '11px', fontWeight: '700', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                      Launch AI Tutor →
                    </button>
                  </div>
                ))
              ) : (
                <div style={{ backgroundColor: 'white', padding: '14px', borderRadius: '8px', border: '1px solid #E9D5FF' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#7C3AED', textTransform: 'uppercase' }}>General Recommendation</span>
                  <p style={{ fontSize: '12px', color: 'var(--text)', margin: '4px 0 10px 0', fontWeight: '500' }}>
                    Enroll in courses to receive personalized AI learning paths and quiz suggestions.
                  </p>
                  <button onClick={() => setActiveTab('courses')} style={{ backgroundColor: '#7C3AED', border: 'none', color: 'white', fontSize: '11px', fontWeight: '700', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                    Explore Courses ✦
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
