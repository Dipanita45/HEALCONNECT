import React from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaUser, FaPhoneAlt } from 'react-icons/fa';

export default function MessageBubble({ message }) {
  const { text, sender, timestamp, isEmergency, isTip } = message;
  const isAI = sender === 'ai';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`message-row ${!isAI ? 'user' : ''}`}
    >
      <div className={`message-avatar ${isAI ? 'ai-avatar' : 'user-avatar'}`}>
        {isAI ? <FaRobot size={18} /> : <FaUser size={16} />}
      </div>
      
      <div className="message-content">
        <div className={`message-bubble ${isAI ? 'ai' : 'user'} ${isEmergency ? 'emergency' : ''}`}>
          {text}
          {isEmergency && (
            <div className="mt-3">
              <a href="tel:112" className="emergency-btn">
                <FaPhoneAlt /> Call Emergency (112)
              </a>
            </div>
          )}
          {isTip && (
            <div className="health-tip-card">
              <p className="m-0 font-semibold mb-1">💡 Health Tip</p>
              <p className="m-0">Consistency is key to a healthy lifestyle!</p>
            </div>
          )}
        </div>
        <div className="message-timestamp">
          {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </motion.div>
  );
}
