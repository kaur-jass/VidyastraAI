import React from 'react';
import { Send } from 'lucide-react';

const AIAssistant = ({
  aiChatMessages,
  aiChatTyping,
  facultyAiSuggestions,
  aiChatInput,
  setAiChatInput,
  handleSendAiAssistantMessage
}) => {
  return (
    <div className="view-fade-in">
      <div className="chat-container">
        <div className="chat-messages-scroll">
          {aiChatMessages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble ${msg.sender}`}>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.text}</p>
              <span className="chat-time">{msg.time}</span>
            </div>
          ))}
          
          {aiChatTyping && (
            <div className="typing-dots">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          )}
        </div>

        <div className="chat-chips-container">
          {facultyAiSuggestions.map((s, idx) => (
            <button 
              key={idx} 
              className="chat-chip"
              onClick={() => handleSendAiAssistantMessage(s.label)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="chat-input-bar">
          <input
            type="text"
            placeholder="Ask AI to compile quizzes, draft emails, or analyze syllabus..."
            value={aiChatInput}
            onChange={(e) => setAiChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendAiAssistantMessage(aiChatInput);
            }}
            className="chat-input-field"
          />
          <button 
            onClick={() => handleSendAiAssistantMessage(aiChatInput)}
            className="chat-send-btn"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
