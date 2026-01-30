import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHeadset, FaTimes, FaPaperPlane, FaUser, FaRobot, 
  FaTicketAlt, FaClock, FaCheckCircle, FaExclamationTriangle,
  FaPaperclip, FaSmile, FaMicrophone, FaPhone
} from 'react-icons/fa';
import { createSupportTicket, subscribeToTickets, unsubscribeFromTickets, updateTicketStatus, addTicketMessage } from '../../lib/ticketSync';
import styles from './SupportWidget.module.css';

// Local cache for tickets to avoid global dependency issues
const localTicketCache = [];

const SupportWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [ticketData, setTicketData] = useState({
    subject: '',
    category: 'general',
    priority: 'normal',
    description: ''
  });

  // Track processed message IDs to prevent duplicates
  const [processedMessageIds, setProcessedMessageIds] = useState(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Subscribe to real-time ticket updates
  useEffect(() => {
    console.log('SupportWidget: Setting up ticket subscription');
    
    // Set up real-time listener
    const listenerId = subscribeToTickets((updatedTickets) => {
      console.log('SupportWidget: Received tickets update:', updatedTickets);
      
      // Prevent processing if already processing
      if (isProcessing) {
        console.log('SupportWidget: Already processing, skipping update');
        return;
      }
      
      // Ensure updatedTickets is an array
      const ticketsArray = Array.isArray(updatedTickets) ? updatedTickets : [];
      
      // Update local cache
      localTicketCache.length = 0;
      localTicketCache.push(...ticketsArray);
      
      // If we have a current ticket, check for updates
      if (currentTicket) {
        console.log('SupportWidget: Looking for ticket:', currentTicket.id);
        const updatedTicket = ticketsArray.find(t => 
          t.id === currentTicket.id || t.firestoreId === currentTicket.firestoreId
        );
        
        console.log('SupportWidget: Found updated ticket:', updatedTicket);
        
        if (updatedTicket && updatedTicket.messages) {
          console.log('SupportWidget: Ticket has messages:', updatedTicket.messages.length);
          console.log('SupportWidget: Current messages:', messages.length);
          console.log('SupportWidget: Processed message IDs:', Array.from(processedMessageIds));
          
          // Set processing flag to prevent loops
          setIsProcessing(true);
          
          // Filter out messages that have already been processed
          const newMessages = updatedTicket.messages.filter(msg => {
            // Create a unique ID for this message
            const msgId = `${new Date(msg.timestamp).getTime()}-${msg.type}-${msg.text.substring(0, 20)}`;
            return !processedMessageIds.has(msgId);
          });
          
          console.log('SupportWidget: New messages to add:', newMessages.length);
          
          if (newMessages.length > 0) {
            // Add new messages to the chat
            const formattedMessages = newMessages.map((msg, index) => {
              const msgId = `${new Date(msg.timestamp).getTime()}-${msg.type}-${msg.text.substring(0, 20)}`;
              
              console.log('SupportWidget: Processing message:', {
                id: msgId,
                text: msg.text,
                type: msg.type,
                timestamp: msg.timestamp
              });
              
              return {
                id: msgId,
                type: msg.type,
                text: msg.text,
                timestamp: new Date(msg.timestamp),
                sender: msg.sender
              };
            });
            
            console.log('SupportWidget: Adding formatted messages:', formattedMessages);
            
            // Update messages and processed IDs in one go
            setMessages(prev => {
              const updated = [...prev, ...formattedMessages];
              console.log('SupportWidget: Final updated messages array:', updated);
              return updated;
            });
            
            // Update processed message IDs
            setProcessedMessageIds(prev => {
              const newIds = new Set(prev);
              formattedMessages.forEach(msg => newIds.add(msg.id));
              console.log('SupportWidget: Updated processed IDs:', Array.from(newIds));
              return newIds;
            });
            
            // Update current ticket reference
            setCurrentTicket(updatedTicket);
          } else {
            console.log('SupportWidget: No new messages found');
          }
          
          // Clear processing flag
          setIsProcessing(false);
        }
      }
    });

    return () => {
      console.log('SupportWidget: Cleaning up ticket subscription');
      unsubscribeFromTickets(listenerId);
      // Clear processed message IDs when unmounting
      setProcessedMessageIds(new Set());
      setIsProcessing(false);
    };
  }, [currentTicket, isProcessing]);

  const generateAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Common health-related queries
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      return {
        text: "If this is a medical emergency, please call 911 immediately or go to the nearest emergency room. For non-urgent medical issues, I can help you connect with a healthcare provider or guide you to the right resources.",
        suggestions: ['Find a doctor', 'Schedule appointment', 'Medical emergency'],
        needsEscalation: false
      };
    }
    
    if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
      return {
        text: "I can help you schedule an appointment! You can book appointments through our dashboard, or I can guide you through the process. What type of appointment do you need?",
        suggestions: ['Book with existing doctor', 'Find new doctor', 'Urgent appointment'],
        needsEscalation: false
      };
    }
    
    if (lowerMessage.includes('prescription') || lowerMessage.includes('medicine')) {
      return {
        text: "For prescription-related queries, I can help you view your current prescriptions, request refills, or connect you with a pharmacist. What specific help do you need with your medications?",
        suggestions: ['View prescriptions', 'Request refill', 'Medication side effects'],
        needsEscalation: false
      };
    }
    
    if (lowerMessage.includes('login') || lowerMessage.includes('password') || lowerMessage.includes('account')) {
      return {
        text: "I can help you with account issues! For password resets, click 'Forgot Password' on the login page. For other account problems, I can connect you with our support team.",
        suggestions: ['Reset password', 'Account locked', 'Login issues'],
        needsEscalation: true
      };
    }
    
    if (lowerMessage.includes('billing') || lowerMessage.includes('payment') || lowerMessage.includes('insurance')) {
      return {
        text: "Billing and insurance questions often require personal account access. I'd recommend connecting with our billing team for accurate information about your specific situation.",
        suggestions: ['Billing inquiry', 'Insurance question', 'Payment issue'],
        needsEscalation: true
      };
    }
    
    // Default response
    return {
      text: "I'm here to help you with HealConnect! I can assist with appointments, prescriptions, finding doctors, and general questions. For complex issues, I can connect you with our support team.",
      suggestions: ['Find a doctor', 'Schedule appointment', 'Technical support', 'Billing help'],
      needsEscalation: false
    };
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: aiResponse.text,
        suggestions: aiResponse.suggestions,
        needsEscalation: aiResponse.needsEscalation,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    sendMessage();
  };

  const createTicket = async () => {
    try {
      const ticketPayload = {
        subject: ticketData.subject,
        category: ticketData.category,
        priority: ticketData.priority,
        description: ticketData.description,
        user: {
          name: 'Current User', // In production, get from auth context
          email: 'user@example.com', // In production, get from auth context
          avatar: '👤'
        },
        messages: messages,
        tags: ticketData.tags || []
      };

      const result = await createSupportTicket(ticketPayload);
      
      if (result.success) {
        const ticket = result.ticket;
        setCurrentTicket(ticket);
        setShowTicketModal(false);
        
        // Add system message about ticket creation
        const ticketMessage = {
          id: Date.now() + 2,
          type: 'system',
          text: `Support ticket ${ticket.id} has been created successfully! Our team will respond within 24 hours. You can track the status below.`,
          ticket: ticket,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, ticketMessage]);
        
        // Reset form
        setTicketData({
          subject: '',
          category: 'general',
          priority: 'normal',
          description: ''
        });
      } else {
        // Show error message
        const errorMessage = {
          id: Date.now(),
          type: 'system',
          text: `Error creating ticket: ${result.error}. Please try again.`,
          timestamp: new Date(),
          isError: true
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      const errorMessage = {
        id: Date.now(),
        type: 'system',
        text: 'Failed to create ticket. Please try again later.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleCloseTicket = async () => {
    if (!currentTicket || currentTicket.status === 'resolved') {
      return;
    }

    if (!confirm('Are you sure you want to close this ticket? This action cannot be undone.')) {
      return;
    }

    try {
      // Add closing message
      const closingMessage = {
        type: 'user',
        text: 'I would like to close this ticket. My issue has been resolved.',
        sender: {
          name: 'Current User',
          email: 'user@example.com',
          avatar: '👤'
        }
      };

      const messageResult = await addTicketMessage(currentTicket.id, closingMessage);
      
      if (messageResult.success) {
        // Update ticket status to resolved
        const statusResult = await updateTicketStatus(currentTicket.id, 'resolved', {
          name: 'Current User',
          avatar: '👤'
        });
        
        if (statusResult.success) {
          // Add system message about ticket closure
          const closureMessage = {
            id: Date.now(),
            type: 'system',
            text: `Ticket ${currentTicket.id} has been closed. Thank you for using HealConnect Support!`,
            timestamp: new Date()
          };

          setMessages(prev => [...prev, closureMessage]);
          setCurrentTicket(prev => ({ ...prev, status: 'resolved' }));
        } else {
          alert('Failed to update ticket status. Please try again.');
        }
      } else {
        alert('Failed to add closing message. Please try again.');
      }
    } catch (error) {
      console.error('Error closing ticket:', error);
      alert('Failed to close ticket. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={styles.floatingButton}
      >
        <FaHeadset size={24} />
        <span className={styles.notificationDot}></span>
      </motion.button>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${styles.supportWidget} ${isMinimized ? styles.minimized : ''}`}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <FaHeadset className={styles.headerIcon} />
            <div>
              <h3>HealConnect Support</h3>
              <span className={styles.status}>
                <span className={styles.onlineDot}></span>
                Online - AI Assistant
              </span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className={styles.minimizeBtn}
            >
              {isMinimized ? '□' : '−'}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className={styles.closeBtn}
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Area */}
            <div className={styles.messagesArea}>
              {messages.length === 0 && (
                <div className={styles.welcomeMessage}>
                  <FaRobot className={styles.welcomeIcon} />
                  <h4>Welcome to HealConnect Support!</h4>
                  <p>I'm your AI assistant. How can I help you today?</p>
                  <div className={styles.quickActions}>
                    <button onClick={() => handleSuggestionClick('I need to schedule an appointment')}>
                      📅 Schedule Appointment
                    </button>
                    <button onClick={() => handleSuggestionClick('I have a technical issue')}>
                      🔧 Technical Support
                    </button>
                    <button onClick={() => handleSuggestionClick('I need help with my prescription')}>
                      💊 Prescription Help
                    </button>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${styles.message} ${styles[message.type]}`}
                >
                  <div className={styles.messageContent}>
                    {message.type === 'ai' && (
                      <FaRobot className={styles.avatar} />
                    )}
                    {message.type === 'user' && (
                      <FaUser className={styles.avatar} />
                    )}
                    {message.type === 'agent' && (
                      <div className={styles.agentAvatar}>
                        {message.sender?.avatar || '👨‍⚕️'}
                      </div>
                    )}
                    {message.type === 'system' && (
                      <FaTicketAlt className={styles.avatar} />
                    )}
                    <div className={styles.messageText}>
                      {message.type === 'agent' && (
                        <div className={styles.agentInfo}>
                          <strong>{message.sender?.name || 'Support Agent'}</strong>
                          <span className={styles.agentRole}>Support Agent</span>
                        </div>
                      )}
                      <p>{message.text}</p>
                      {message.suggestions && (
                        <div className={styles.suggestions}>
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className={styles.suggestionBtn}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                      {message.needsEscalation && (
                        <button
                          onClick={() => setShowTicketModal(true)}
                          className={styles.escalateBtn}
                        >
                          <FaTicketAlt /> Create Support Ticket
                        </button>
                      )}
                      {message.ticket && (
                        <div className={styles.ticketInfo}>
                          <div className={styles.ticketHeader}>
                            <FaTicketAlt /> Ticket {message.ticket.id}
                          </div>
                          <div className={styles.ticketDetails}>
                            <p><strong>Subject:</strong> {message.ticket.subject}</p>
                            <p><strong>Priority:</strong> {message.ticket.priority}</p>
                            <p><strong>Status:</strong> 
                              <span className={`${styles.status} ${styles[message.ticket.status]}`}>
                                {message.ticket.status}
                              </span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={styles.timestamp}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
              ))}

              {isTyping && (
                <div className={`${styles.message} ${styles.ai}`}>
                  <div className={styles.messageContent}>
                    <FaRobot className={styles.avatar} />
                    <div className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className={styles.inputArea}>
              <div className={styles.inputContainer}>
                <button className={styles.attachBtn}>
                  <FaPaperclip />
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className={styles.messageInput}
                />
                <button className={styles.emojiBtn}>
                  <FaSmile />
                </button>
                <button className={styles.voiceBtn}>
                  <FaMicrophone />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim()}
                  className={styles.sendBtn}
                >
                  <FaPaperPlane />
                </button>
              </div>
              <div className={styles.inputActions}>
                {currentTicket && currentTicket.status !== 'resolved' ? (
                  <button
                    onClick={handleCloseTicket}
                    className={styles.closeTicketBtn}
                  >
                    <FaCheckCircle /> Close Ticket
                  </button>
                ) : (
                  <button
                    onClick={() => setShowTicketModal(true)}
                    className={styles.createTicketBtn}
                  >
                    <FaTicketAlt /> Create Ticket
                  </button>
                )}
                <button className={styles.callBtn}>
                  <FaPhone /> Request Call
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* Ticket Modal */}
      <AnimatePresence>
        {showTicketModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => setShowTicketModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3>Create Support Ticket</h3>
                <button onClick={() => setShowTicketModal(false)}>
                  <FaTimes />
                </button>
              </div>
              
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Subject *</label>
                  <input
                    type="text"
                    value={ticketData.subject}
                    onChange={(e) => setTicketData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Category *</label>
                  <select
                    value={ticketData.category}
                    onChange={(e) => setTicketData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing & Payment</option>
                    <option value="medical">Medical Question</option>
                    <option value="account">Account Issue</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Priority *</label>
                  <div className={styles.priorityOptions}>
                    {['low', 'normal', 'high', 'urgent'].map(priority => (
                      <button
                        key={priority}
                        onClick={() => setTicketData(prev => ({ ...prev, priority }))}
                        className={`${styles.priorityBtn} ${styles[priority]} ${ticketData.priority === priority ? styles.active : ''}`}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Description *</label>
                  <textarea
                    value={ticketData.description}
                    onChange={(e) => setTicketData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Please provide detailed information about your issue..."
                    rows={4}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  onClick={() => setShowTicketModal(false)}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  onClick={createTicket}
                  disabled={!ticketData.subject || !ticketData.description}
                  className={styles.submitBtn}
                >
                  <FaTicketAlt /> Create Ticket
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SupportWidget;
