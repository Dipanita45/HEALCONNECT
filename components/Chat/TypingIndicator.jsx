import React from 'react';
import { FaRobot } from 'react-icons/fa';

export default function TypingIndicator() {
  return (
    <div className="message-row">
      <div className="message-avatar ai-avatar">
        <FaRobot size={18} />
      </div>
      <div className="typing-indicator">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
    </div>
  );
}
