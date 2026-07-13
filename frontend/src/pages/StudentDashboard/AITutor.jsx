import React from 'react';
import { Send } from 'lucide-react';

const AITutor = ({
  chatMessages,
  aiTyping,
  chatBottomRef,
  tutorSuggestions,
  chatInput,
  setChatInput,
  handleSendChatMessage
}) => {
  return (
    <div className="view-fade-in">
      <div className="chat-container">
        {/* Messages panel */}
        <div className="chat-messages-scroll">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble ${msg.sender}`}>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.text}</p>
              <span className="chat-time">{msg.time}</span>
            </div>
          ))}
          
          {aiTyping && (
            <div className="typing-dots">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="chat-chips-container">
          {tutorSuggestions.map((s, idx) => (
            <button 
              key={idx} 
              className="chat-chip"
              onClick={() => handleSendChatMessage(s.label)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Send chat block */}
        <div className="chat-input-bar">
          <input
            type="text"
            placeholder="Type questions about Binary Search..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendChatMessage(chatInput);
            }}
            className="chat-input-field"
          />
          <button 
            onClick={() => handleSendChatMessage(chatInput)}
            className="chat-send-btn"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
