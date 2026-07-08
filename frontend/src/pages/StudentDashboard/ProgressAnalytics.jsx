import React, { useEffect, useState } from 'react';
import { TrendingUp, BookOpenCheck, AlertCircle, Loader } from 'lucide-react';
import api from '../../services/api';

const ProgressAnalytics = ({
  setLectureFilter,
  setActiveTab,
  triggerToast,
  setExpandedNoteId
}) => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.getStudentProgress();
        if (res && res.success && res.data) {
          setProgressData(res.data);
        }
      } catch (err) {
        console.error('Failed to load progress data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  // Derive topic mastery from progress records
  const topicMastery = progressData.map((p, idx) => {
    const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    return {
      topic: p.courseCode,
      value: p.completionPercentage ?? 0,
      color: colors[idx % colors.length]
    };
  });

  // Identify weak areas (below 60%)
  const weakAreas = progressData.filter(p => (p.completionPercentage ?? 0) < 60);

  if (loading) {
    return (
      <div className="view-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <Loader className="h-6 w-6 animate-spin" style={{ color: 'var(--primary)' }} />
        <span style={{ marginLeft: '12px', color: 'var(--text-muted)', fontSize: '14px' }}>Loading progress data...</span>
      </div>
    );
  }

  if (progressData.length === 0) {
    return (
      <div className="view-fade-in gorgeous-card" style={{ textAlign: 'center', padding: '48px' }}>
        <TrendingUp className="h-10 w-10" style={{ color: 'var(--text-muted)', margin: '0 auto 16px' }} />
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>No Progress Data Yet</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
          Progress records will appear here once your course activity is tracked.
        </p>
      </div>
    );
  }

  return (
    <div className="view-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Course Completion Bar Chart */}
        <div className="gorgeous-card">
          <h3 className="section-header-title">
            <TrendingUp className="h-4 w-4 text-indigo-500" /> Course Completion Overview
          </h3>

          <div className="chart-svg-container" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '16px' }}>
            {progressData.map((item, idx) => {
              const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
              const heightPct = `${Math.max(5, item.completionPercentage ?? 0)}%`;
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', marginBottom: '8px' }}>{item.completionPercentage ?? 0}%</span>
                  <div style={{ width: '100%', height: '110px', backgroundColor: '#E2E8F0', borderRadius: '4px', position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{
                      width: '100%',
                      height: heightPct,
                      background: `linear-gradient(to top, ${colors[idx % colors.length]} 0%, ${colors[(idx + 1) % colors.length]} 100%)`,
                      borderRadius: '4px',
                      transition: 'height 0.8s ease-out'
                    }} />
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', fontWeight: '600', textAlign: 'center' }}>{item.courseCode}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dashboard-main-grid">
          {/* Topic Mastery from DB */}
          <div className="gorgeous-card">
            <h3 className="section-header-title">
              <BookOpenCheck className="h-4 w-4 text-emerald-500" /> Topic Mastery Breakdown
            </h3>
            {topicMastery.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {topicMastery.map((mastery, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                      <span>{mastery.topic}</span>
                      <span>{mastery.value}%</span>
                    </div>
                    <div className="fancy-progress-bar-container">
                      <div className="fancy-progress-bar-fill" style={{ width: `${mastery.value}%`, backgroundColor: mastery.color }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No course data available.</p>
            )}
          </div>

          {/* Weak Areas from DB */}
          <div className="gorgeous-card">
            <h3 className="section-header-title">
              <AlertCircle className="h-4 w-4 text-red-500" /> Targeted Weak Areas
            </h3>
            {weakAreas.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {weakAreas.map((area, idx) => {
                  const isRed = (area.completionPercentage ?? 0) < 40;
                  return (
                    <div key={idx} style={{
                      padding: '14px',
                      borderRadius: '8px',
                      borderLeft: `4px solid ${isRed ? '#EF4444' : '#F59E0B'}`,
                      backgroundColor: isRed ? '#FEF2F2' : '#FFFBEB'
                    }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: isRed ? '#B91C1C' : '#B45309', textTransform: 'uppercase' }}>
                        {area.courseCode}
                      </span>
                      <h4 style={{ margin: '4px 0', fontSize: '13px', fontWeight: '700' }}>
                        {area.completionPercentage ?? 0}% Completion — Needs Attention
                      </h4>
                      <p style={{ fontSize: '12px', color: isRed ? '#7F1D1D' : '#78350F', margin: '4px 0 10px 0', lineHeight: 1.4 }}>
                        Quiz Score: {area.quizScore ?? 0} | Attendance: {area.attendancePercentage ?? 0}% | Assignment Score: {area.assignmentScore ?? 0}
                      </p>
                      <button
                        onClick={() => {
                          setLectureFilter(area.courseCode);
                          setActiveTab('lectures');
                          triggerToast(`Redirecting to ${area.courseCode} lecture components...`);
                        }}
                        style={{
                          backgroundColor: isRed ? '#EF4444' : '#F59E0B',
                          border: 'none', color: 'white', fontSize: '11px',
                          fontWeight: '600', padding: '4px 10px',
                          borderRadius: '4px', cursor: 'pointer'
                        }}
                      >
                        Review Lecture
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '16px', backgroundColor: '#F0FDF4', borderRadius: '8px', borderLeft: '4px solid #10B981' }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#065F46' }}>All topics performing well! 🎉</h4>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#064E3B' }}>No weak areas detected based on your current progress data.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProgressAnalytics;
