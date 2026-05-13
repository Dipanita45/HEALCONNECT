import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaTrash, FaRobot } from 'react-icons/fa';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import QuickReplies from './QuickReplies';
import { generateAIResponse } from './aiEngine';

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('healconnect_chat_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    } else {
      // Add welcome message if no history
      setMessages([{
        id: 'welcome-1',
        text: "Hello! I'm your HEALCONNECT AI Assistant. I can help you with symptom suggestions, health tips, and appointment guidance. How can I help you today?",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      }]);
    }
  }, []);

  // Save to localStorage when messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('healconnect_chat_history', JSON.stringify(messages.slice(-100)));
    }
  }, [messages]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      try {
        const response = generateAIResponse(text);
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          text: response.text,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          isEmergency: response.isEmergency,
          isTip: response.isTip
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error("AI processing error:", error);
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I encountered an error processing your request.",
          sender: 'ai',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }, 1000 + Math.random() * 1000);
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      localStorage.removeItem('healconnect_chat_history');
      setMessages([{
        id: Date.now().toString(),
        text: "Chat history cleared. How can I help you today?",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      }]);
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-avatar">
            <FaRobot />
          </div>
          <div className="chat-header-info">
            <h2>HEALCONNECT AI Assistant</h2>
            <div className="chat-header-status">
              <span className="status-dot"></span> Online
            </div>
          </div>
          <div className="ml-auto flex items-center">
            <button onClick={handleClear} className="chat-clear-btn" title="Clear Chat">
              <FaTrash />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <QuickReplies onSelect={handleSend} />

        {/* Input Area */}
        <div className="chat-input-bar">
          <textarea
            className="chat-input"
            placeholder="Type your health question here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(inputText);
              }
            }}
            rows={1}
          />
          <button 
            className="chat-send-btn" 
            onClick={() => handleSend(inputText)}
            disabled={!inputText.trim() || isTyping}
          >
            <FaPaperPlane />
          </button>
        </div>

        <div className="chat-disclaimer">
          ⚠️ AI Assistant provides general guidance only and does not replace professional medical advice.
        </div>

      </div>
    </div>
  );
}
