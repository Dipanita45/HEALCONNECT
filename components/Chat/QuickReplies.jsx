import React from 'react';

export default function QuickReplies({ onSelect }) {
  const replies = [
    "I have a headache",
    "How to book an appointment?",
    "Give me a health tip",
    "Emergency help"
  ];

  return (
    <div className="quick-replies">
      {replies.map((reply, idx) => (
        <button 
          key={idx} 
          className="quick-reply-chip"
          onClick={() => onSelect(reply)}
        >
          {reply}
        </button>
      ))}
    </div>
  );
}
