import React from 'react';

const ContentLibrary = ({
  libSearch,
  setLibSearch,
  libraryResources,
  togglePublishStatus,
  deleteLibraryResource
}) => {
  return (
    <div className="view-fade-in">
      {/* Toolbar */}
      <div className="gorgeous-card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontWeight: '700', fontSize: '15px' }}>Course Resource Archive</h3>
          
          <input
            type="text"
            placeholder="Search documents..."
            value={libSearch}
            onChange={(e) => setLibSearch(e.target.value)}
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

      {/* Resources Table */}
      <div className="gorgeous-card">
        <div className="fancy-table-container">
          <table className="fancy-table">
            <thead>
              <tr>
                <th>Resource Name</th>
                <th>Subject</th>
                <th>File Size</th>
                <th>Uploaded Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {libraryResources
                .filter(res => res.title.toLowerCase().includes(libSearch.toLowerCase()) || res.subject.toLowerCase().includes(libSearch.toLowerCase()))
                .map((res) => (
                  <tr key={res.id}>
                    <td>
                      <span style={{ fontWeight: '700' }}>{res.title}</span>
                    </td>
                    <td>{res.subject}</td>
                    <td>{res.size}</td>
                    <td>{res.date}</td>
                    <td>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: res.status === 'Published' ? '#D1FAE5' : '#F1F5F9',
                        color: res.status === 'Published' ? '#059669' : '#64748B'
                      }}>
                        {res.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          onClick={() => togglePublishStatus(res.id)}
                          style={{ border: 'none', backgroundColor: '#EEF2FF', color: 'var(--primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                        >
                          {res.status === 'Published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button 
                          onClick={() => deleteLibraryResource(res.id)}
                          style={{ border: 'none', backgroundColor: '#FEF2F2', color: '#EF4444', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      </div>
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

export default ContentLibrary;
