import React from 'react';
import { Check, Play, Clock } from 'lucide-react';

const LectureLibrary = ({
  lectureFilter,
  setLectureFilter,
  lectureSearch,
  setLectureSearch,
  lectures,
  toggleLectureWatched
}) => {
  return (
    <div className="view-fade-in">
      {/* Filter and Search Bar Row */}
      <div className="gorgeous-card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {['All', 'DSA', 'DBMS', 'OS', 'CN'].map((cat) => (
              <button
                key={cat}
                onClick={() => setLectureFilter(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: lectureFilter === cat ? 'var(--primary)' : '#EEF2FF',
                  color: lectureFilter === cat ? 'white' : 'var(--primary)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search input field */}
          <input
            type="text"
            placeholder="Search lecture topic..."
            value={lectureSearch}
            onChange={(e) => setLectureSearch(e.target.value)}
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

      {/* Lecture Archive Listing Table */}
      <div className="gorgeous-card">
        <div className="fancy-table-container">
          <table className="fancy-table">
            <thead>
              <tr>
                <th>Watch Status</th>
                <th>Lecture Topic</th>
                <th>Course</th>
                <th>Duration</th>
                <th>Uploaded Date</th>
              </tr>
            </thead>
            <tbody>
              {lectures
                .filter(l => lectureFilter === 'All' || l.subject === lectureFilter)
                .filter(l => l.topic.toLowerCase().includes(lectureSearch.toLowerCase()))
                .map((lecture) => (
                  <tr key={lecture.id}>
                    <td>
                      <button 
                        className={`btn-watch-toggle ${lecture.watched ? 'watched' : 'unwatched'}`}
                        onClick={() => toggleLectureWatched(lecture.id)}
                        title={lecture.watched ? 'Mark as Not Watched' : 'Mark as Watched'}
                      >
                        {lecture.watched ? <Check className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </button>
                    </td>
                    <td>
                      <span style={{ fontWeight: '600', color: lecture.watched ? 'var(--text-muted)' : 'var(--text)' }}>
                        {lecture.topic}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: 'var(--primary)' }}>
                        {lecture.subject}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <Clock className="h-3.5 w-3.5" /> {lecture.duration}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{lecture.date}</span>
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

export default LectureLibrary;
