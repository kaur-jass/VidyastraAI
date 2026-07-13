import React from 'react';
import { Send } from 'lucide-react';

const MessagesAnnounce = ({
  chatThreads,
  activeMessageThread,
  setActiveMessageThread,
  messageReplyText,
  setMessageReplyText,
  sendFacultyMessageReply
}) => {
  return (
    <div className="view-fade-in">
      <div className="messages-split-view">
        {/* Message threads list */}
        <div className="thread-sidebar">
          {chatThreads.map((thread) => (
            <div 
              key={thread.id}
              className={`thread-item-wrapper ${activeMessageThread === thread.id ? 'active' : ''}`}
              onClick={() => setActiveMessageThread(thread.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700' }}>{thread.studentName}</h4>
                {thread.unread && (
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                )}
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontWeight: '600', color: 'var(--text)' }}>
                {thread.subject}
              </p>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                {thread.messages[thread.messages.length - 1].time}
              </span>
            </div>
          ))}
        </div>

        {/* Active Message chat thread */}
        <div className="active-thread-chat">
          {(() => {
            const activeThread = chatThreads.find(t => t.id === activeMessageThread);
            if (!activeThread) return null;
            return (
              <>
                <div className="active-thread-body-scroll">
                  {activeThread.messages.map((m, idx) => (
                    <div key={idx} className={`chat-bubble ${m.sender === 'teacher' ? 'user' : 'ai'}`}>
                      <p style={{ margin: 0 }}>{m.text}</p>
                      <span className="chat-time">{m.time}</span>
                    </div>
                  ))}
                </div>

                <div className="chat-input-bar">
                  <input
                    type="text"
                    placeholder="Type reply message to student..."
                    value={messageReplyText}
                    onChange={(e) => setMessageReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') sendFacultyMessageReply();
                    }}
                    className="chat-input-field"
                  />
                  <button 
                    onClick={sendFacultyMessageReply}
                    className="chat-send-btn"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default MessagesAnnounce;
