import React from 'react';
import { Sparkles, Download } from 'lucide-react';

const AINotes = ({
  notes,
  expandedNoteId,
  setExpandedNoteId,
  handleDownloadNote
}) => {
  return (
    <div className="view-fade-in">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {notes.map((note) => (
          <div key={note.id} className="gorgeous-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ backgroundColor: '#EEF2FF', color: 'var(--primary)', fontWeight: '700', fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>
                    {note.subject}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Generated: {note.date}</span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '8px 0 6px 0', color: 'var(--text)' }}>
                  {note.title}
                </h3>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {note.tags.map(t => (
                    <span key={t} style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{t}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setExpandedNoteId(expandedNoteId === note.id ? null : note.id)}
                  style={{ backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', color: 'var(--text)' }}
                >
                  {expandedNoteId === note.id ? 'Hide Summary' : 'View AI Summary ✦'}
                </button>
                <button
                  onClick={() => handleDownloadNote(note.title)}
                  className="btn-join-class"
                  style={{ padding: '8px 14px' }}
                >
                  <Download className="h-4 w-4" /> Download PDF
                </button>
              </div>
            </div>

            {expandedNoteId === note.id && (
              <div className="note-summary-expandable">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: '700', fontSize: '12px', marginBottom: '8px' }}>
                  <Sparkles className="h-4 w-4" /> AI Generated Summary
                </div>
                <p style={{ margin: 0, lineHeight: '1.6' }}>{note.summary}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AINotes;
