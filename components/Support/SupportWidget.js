import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHeadset, FaTimes, FaPaperPlane, FaUser, FaRobot,
  FaTicketAlt, FaClock, FaCheckCircle, FaExclamationTriangle,
  FaPaperclip, FaSmile, FaMicrophone, FaPhone
} from 'react-icons/fa';
import { createSupportTicket, subscribeToTickets, unsubscribeFromTickets, updateTicketStatus, addTicketMessage } from '../../lib/ticketSync';
import styles from './SupportWidget.module.css';
import { useTheme } from '@/context/ThemeContext';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useRouter } from 'next/router';
import EmojiPicker from 'emoji-picker-react';

// Local cache for tickets to avoid global dependency issues
const localTicketCache = [];

const SupportWidget = () => {
  const { isMinimized, setIsMinimized, supportWidgetOpen, setSupportWidgetOpen, showTicketModal, setShowTicketModal } = useTheme();
  const isOpen = supportWidgetOpen;
  const setIsOpen = setSupportWidgetOpen;
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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
  const [lastIntent, setLastIntent] = useState(null);

  // Initialize currentUser and userRole as null to avoid undefined errors
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // const [isMinimized, setIsMinimized] = useState(false);
  const [focusedMessageIndex, setFocusedMessageIndex] = useState(-1);
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null); // ADD THIS
  const chatContainerRef = useRef(null);

  const router = useRouter();
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();


  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);


  const handleVoiceInput = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

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


  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Detect keyboard user
      if (event.key === 'Tab') {
        setIsKeyboardUser(true);
      }

      // Global shortcuts when widget is closed
      if (!isOpen) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
          event.preventDefault();
          setIsOpen(true);
          return;
        }
        return;
      }

      // Don't handle keyboard events when modal is open (let modal handle them)
      if (showTicketModal) {
        if (event.key === 'Escape') {
          event.preventDefault();
          setShowTicketModal(false);
          setSupportWidgetOpen(false);
          inputRef.current?.focus();
        }
        return;
      }

      // Escape key to close widget
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        setFocusedMessageIndex(-1);
        return;
      }

      // Ctrl/Cmd + K to close widget
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      // Navigation within messages when not focused on input
      if (document.activeElement !== inputRef.current && messages.length > 0) {
        switch (event.key) {
          case 'ArrowUp':
            event.preventDefault();
            navigateMessages('up');
            break;
          case 'ArrowDown':
            event.preventDefault();
            navigateMessages('down');
            break;
          case 'Home':
            event.preventDefault();
            setFocusedMessageIndex(0);
            break;
          case 'End':
            event.preventDefault();
            setFocusedMessageIndex(messages.length - 1);
            break;
          case 'Enter':
          case ' ':
            if (focusedMessageIndex >= 0) {
              event.preventDefault();
              // Focus back to input after selecting a message
              inputRef.current?.focus();
              setFocusedMessageIndex(-1);
            }
            break;
        }
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isOpen, showTicketModal, messages, focusedMessageIndex]);

  // Reset chat state on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
      setIsMinimized(false);
      setMessages([]);
      setLastIntent(null);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const navigateMessages = (direction) => {
    if (direction === 'up') {
      setFocusedMessageIndex(prev => {
        if (prev <= 0) return messages.length - 1;
        return prev - 1;
      });
    } else {
      setFocusedMessageIndex(prev => {
        if (prev >= messages.length - 1) return 0;
        return prev + 1;
      });
    }
  };

  // Modal accessibility and focus management
  useEffect(() => {
    if (showTicketModal) {
      // Store the element that had focus before modal opened
      const previousFocus = document.activeElement;

      // Find all focusable elements in the modal
      const modalElement = document.querySelector(`.${styles.modal}`);
      if (modalElement) {
        const focusableElements = modalElement.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length > 0) {
          // Focus first element in modal
          focusableElements[0].focus();
        }
      }

      // Trap focus within modal
      const handleModalKeyDown = (event) => {
        if (event.key === 'Tab') {
          const modalElement = document.querySelector(`.${styles.modal}`);
          if (modalElement) {
            const focusableElements = modalElement.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey) {
              // Shift + Tab (going backwards)
              if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
              }
            } else {
              // Tab (going forwards)
              if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
              }
            }
          }
        }
      };

      document.addEventListener('keydown', handleModalKeyDown);

      return () => {
        document.removeEventListener('keydown', handleModalKeyDown);
        // Restore focus to previous element when modal closes
        if (previousFocus && typeof previousFocus.focus === 'function') {
          previousFocus.focus();
        }
      };
    }
  }, [showTicketModal]);

  // Focus management for messages
  useEffect(() => {
    if (focusedMessageIndex >= 0 && focusedMessageIndex < messages.length) {
      const messageElements = document.querySelectorAll('[data-message-index]');
      const targetElement = messageElements[focusedMessageIndex];
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [focusedMessageIndex]);

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
    }, currentUser?.uid, userRole);

    return () => {
      console.log('SupportWidget: Cleaning up ticket subscription');
      unsubscribeFromTickets(listenerId);
      // Clear processed message IDs when unmounting
      setProcessedMessageIds(new Set());
      setIsProcessing(false);
    };
  }, [currentTicket, isProcessing]);

  const adjustTextareaHeight = (element) => {
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
  };

  const generateAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    const specialties = ['cardiologist', 'pediatrician', 'neurologist', 'general checkup', 'dentist', 'dermatologist', 'orthopedic', 'psychiatrist'];

    // Define comprehensive knowledge base and intent map
    const intentMap = {
      greeting: {
        keywords: ['hi', 'hello', 'hey', 'greetings', 'morning', 'evening'],
        variants: [
          "Hello! I'm the HealConnect AI Assistant. How can I help you today?",
          "Hi there! Welcome to HealConnect. What can I assist you with?",
          "Greetings! I'm here to help you navigate our healthcare platform. What are you looking for?"
        ],
        suggestions: [
          'Schedule Appointment',
          'My Prescriptions',
          'Health Stats'
        ]
      },
      emergency: {
        keywords: ['emergency', 'urgent', '911', 'critical', 'bleeding', 'unconscious', 'severe pain'],
        variants: [
          "If this is a medical emergency, please call 911 immediately or go to the nearest emergency room. Your safety is our priority.",
          "EMERGENCY detected. Please stop using this chat and call emergency services or 911 right now.",
          "For urgent medical crises, please do not wait for a chat response. Contact 911 or your local emergency department immediately."
        ],
        suggestions: [
          { label: 'Emergency Contact', path: '/contact' },
          'Emergency numbers'
        ],
        escalate: false
      },
      appointment_booking: {
        keywords: ['book', 'schedule', 'new appointment', 'see a doctor', 'meet doctor', ...specialties],
        variants: [
          "I can help you schedule an appointment! You can book directly through our **Appointments** page or I can guide you. What specialty are you looking for?",
          "Scheduling is easy! Would you like to see our list of **specialist doctors** or book a follow-up with your current provider?",
          "Ready to book? You can choose a doctor and a time slot from the **Appointments** section."
        ],
        suggestions: [
          'Cardiologist',
          'Pediatrician',
          'General Checkup',
          { label: 'Go to Appointments', path: '/appointments' }
        ],
        escalate: false
      },
      appointment_status: {
        keywords: ['my appointment', 'when is my', 'cancel appointment', 'reschedule', 'upcoming visit'],
        variants: [
          "You can view and manage all your upcoming visits in the **Appointments history** section.",
          "To check your appointment status or reschedule, please head over to your **patient portal** dashboard.",
          "Your upcoming appointments are listed in the history tab. Would you like me to take you there?"
        ],
        suggestions: [
          { label: 'Go to Appointments', path: '/appointments' },
          'Dashboard'
        ],
        escalate: false
      },
      prescription: {
        keywords: ['prescription', 'medicine', 'refill', 'pills', 'dosage', 'medication', 'my meds'],
        variants: [
          "I can help with health records! You can view your current prescriptions and request refills in the **Prescriptions** tab.",
          "Looking for your medications? Your **active prescriptions** and refill history are available in your medical profile.",
          "For refills and dosage info, please check the **Medications** section of your dashboard."
        ],
        suggestions: [
          { label: 'View Prescriptions', path: '/prescriptions' },
          'Request Refill'
        ],
        escalate: false
      },
      monitoring: {
        keywords: ['vitals', 'health stats', 'blood pressure', 'heart rate', 'monitoring', 'glucose', 'weight'],
        variants: [
          "You can track your vitals and health progress in the 'Monitoring' section. It shows real-time data from your connected devices.",
          "Monitoring your health is important. You can view all your health statistics and trends on the Monitoring page.",
          "Would you like to see your latest health stats? I can take you to the monitoring dashboard."
        ],
        suggestions: [
          { label: 'View Health Stats', path: '/monitoring' },
          'Health trends'
        ]
      },
      profile: {
        keywords: ['profile', 'my info', 'settings', 'account', 'personal details'],
        variants: [
          "You can update your personal information and account settings in your Profile page.",
          "Need to change your details? Access your profile to update your contact info or medical history.",
          "Your account settings and profile information are managed centrally in the Profile section."
        ],
        suggestions: [
          { label: 'Go to Profile', path: '/profile' },
          'Update info'
        ]
      },
      about_company: {
        keywords: ['about', 'healconnect', 'who are you', 'what is this', 'how it works', 'open source', 'legal', 'terms', 'privacy'],
        variants: [
          "HealConnect is a modern healthcare platform. You can learn more about our mission on the 'About' page or check our 'Open Source' contributions.",
          "We offer various services including telemedicine and remote monitoring. Check out the 'How it Works' page for a deep dive.",
          "You can find our terms of service and privacy policy in the legal section of our website."
        ],
        suggestions: [
          'About Us',
          { label: 'How it Works', path: '/how-it-works' },
          'Open Source'
        ]
      },
      contact: {
        keywords: ['contact', 'support', 'help', 'assist', 'talk to human', 'phone', 'email', 'address', 'location'],
        variants: [
          "Need to get in touch? You can find our contact details on the 'Contact' page.",
          "Our support team is available via phone or email. Check the contact section for more info.",
          "If you'd like to visit us or send a direct message, please visit our contact page."
        ],
        suggestions: [
          { label: 'Contact Page', path: '/contact' },
          'Call support'
        ]
      },
      faq: {
        keywords: ['faq', 'questions', 'common issues', 'help me with', 'tutorial'],
        variants: [
          "Have questions? Our FAQ page covers everything from booking to billing.",
          "You might find what you're looking for in our frequently asked questions section.",
          "I recommend checking our FAQ for detailed answers to common patient questions."
        ],
        suggestions: [
          'View FAQ',
          { label: 'How it Works', path: '/how-it-works' }
        ]
      },
      thanks: {
        keywords: ['thanks', 'thank you', 'bye', 'goodbye', 'awesome', 'great', 'fixed'],
        variants: [
          "You're very welcome! Is there anything else I can help with?",
          "Glad I could help! Have a great day with HealConnect.",
          "Anytime! I'm here if you need further assistance."
        ],
        suggestions: [
          'Goodbye',
          { label: 'Back to Home', path: '/' }
        ]
      }
    };

    // Find matching intent
    let matchedIntent = null;
    for (const [intent, data] of Object.entries(intentMap)) {
      if (data.keywords.some(kw => lowerMessage.includes(kw))) {
        matchedIntent = intent;
        break;
      }
    }

    // Default intent if no match
    if (!matchedIntent) {
      const defaultResponse = {
        text: "I'm here to help you with HealConnect! I can assist with appointments, prescriptions, monitoring, and general questions. For complex issues, I can connect you with our support team.",
        suggestions: [
          { label: 'Find a Doctor', path: '/appointments' },
          { label: 'Schedule Appointment', path: '/appointments' },
          { label: 'Technical support', path: '/contact' },
          { label: 'Billing help', path: '/contact' }
        ],
        needsEscalation: false
      };

      if (lastIntent === 'default') {
        defaultResponse.text = "I'm still learning, but I'm best at handling medical records, appointments, and vitals. Try asking 'When is my next appointment?' or 'Show my meds'.";
      }

      setLastIntent('default');
      return defaultResponse;
    }

    const data = intentMap[matchedIntent];

    // Context awareness & Response construction
    let responseText;
    let suggestions = data.suggestions;
    const isSpecialty = specialties.some(s => lowerMessage.includes(s));

    if (matchedIntent === 'appointment_booking' && isSpecialty) {
      const specialtyName = specialties.find(s => lowerMessage.includes(s));
      responseText = `Great, I'll help you find a ${specialtyName.charAt(0).toUpperCase() + specialtyName.slice(1)}! You can view their availability and book now. Should I take you to the booking page?`;
      suggestions = [
        { label: `Book ${specialtyName.charAt(0).toUpperCase() + specialtyName.slice(1)}`, path: '/appointments' },
        { label: 'Browse All Specialists', path: '/appointments' }
      ];
    } else if (lastIntent === matchedIntent) {
      const otherVariants = (data.variants || []).slice(1);
      responseText = "As I mentioned, " + (otherVariants[Math.floor(Math.random() * otherVariants.length)] || (data.variants && data.variants[0]) || "I'm here to help.");
    } else {
      responseText = (data.variants && data.variants[0]) || "I'm here to help.";
    }

    setLastIntent(matchedIntent);

    return {
      text: responseText,
      suggestions: suggestions,
      needsEscalation: !!data.escalate
    };
  };

  const sendMessage = async (messageText) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse = generateAIResponse(textToSend);
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

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };


  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      setLastIntent(null);
    }
  };

  const handleDownloadTranscript = () => {
    if (messages.length === 0) return;

    let transcriptText = "HealConnect Support Chat Transcript\n";
    transcriptText += "Date: " + new Date().toLocaleString() + "\n\n";

    messages.forEach(msg => {
      const sender = msg.type === 'user' ? 'You' : (msg.type === 'ai' ? 'AI Assistant' : 'System');
      const time = new Date(msg.timestamp).toLocaleTimeString();
      transcriptText += `[${time}] ${sender}: ${msg.text}\n`;
    });

    const blob = new Blob([transcriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `healconnect-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileMessage = {
      id: Date.now(),
      type: 'user',
      text: `Uploaded file: ${file.name}`,
      file: file,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, fileMessage]);

    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const renderMessageText = (text) => {
    if (!text) return null;

    // Simple parser for bold text and basic newlines
    const paragraphs = text.split('\n').filter(p => p.trim() !== '');

    return paragraphs.map((paragraph, pIndex) => {
      // Parse bold **text**
      const parts = paragraph.split(/(\*\*.*?\*\*)/g);

      const renderParts = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      return <p key={pIndex}>{renderParts}</p>;
    });
  };

  const handleSuggestionClick = (suggestion) => {
    if (typeof suggestion === 'object' && suggestion.path) {
      const confirmNav = confirm(`Would you like to navigate to ${suggestion.label}?`);
      if (confirmNav) {
        setIsMinimized(true);
        router.push(suggestion.path);
      }
    } else {
      const label = typeof suggestion === 'object' ? suggestion.label : suggestion;
      setInputValue(label);
      sendMessage(label);
    }
  };

  const createTicket = async () => {
    try {
      // Guard against null currentUser
      if (!currentUser || !currentUser.uid) {
        const errorMessage = {
          id: Date.now(),
          type: 'system',
          text: 'Error: You must be logged in to create a support ticket. Please log in first.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      const ticketPayload = {
        subject: ticketData.subject,
        category: ticketData.category,
        priority: ticketData.priority,
        description: ticketData.description,
        userId: currentUser.uid, // Add security context
        user: {
          name: currentUser.displayName || 'Current User',
          email: currentUser.email || 'user@example.com',
          avatar: currentUser.photoURL || '👤'
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
        className={styles.widgetButton}
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaHeadset />
      </motion.button>
    );
  }

  return (
    <>
      {!showTicketModal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${styles.supportWidget} ${isMinimized ? styles.minimized : ''}`}
          role="application"
          aria-label="Support chat widget"
          aria-live="polite"
          ref={chatContainerRef}
        >


          {!isMinimized && (
            <>
              {/* Header */}
              <div className={styles.header}>
                <div className={styles.headerLeft}>
                  <FaHeadset className={styles.headerIcon} aria-hidden="true" />
                  <div>
                    <h3>HealConnect Support</h3>
                    <span className={styles.status}>
                      <span className={styles.onlineDot}></span>
                      Online - AI Assistant
                    </span>
                  </div>
                </div>
                <div className={styles.headerActions}>
                  {messages.length > 0 && (
                    <>
                      <button
                        onClick={handleDownloadTranscript}
                        className={styles.headerBtn}
                        aria-label="Download Transcript"
                        title="Download Transcript"
                      >
                        ↓
                      </button>
                      <button
                        onClick={handleClearChat}
                        className={styles.headerBtn}
                        aria-label="Clear Chat"
                        title="Clear Chat"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className={styles.minimizeBtn}
                    aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                    aria-expanded={!isMinimized}
                  >
                    {isMinimized ? '□' : '−'}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={styles.closeBtn}
                    aria-label="Close support chat"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
              {/* Messages Area */}
              <div className={styles.messagesArea}>
                {messages.length === 0 && (
                  <div className={styles.welcomeMessage}>
                    <FaRobot className={styles.welcomeIcon} />
                    <h4>Welcome to HealConnect Support!</h4>
                    <p>I&apos;m your AI assistant. How can I help you today&lsquo;</p>
                    <div className={styles.quickActions}>
                      <button onClick={() => handleSuggestionClick({ label: 'Schedule Appointment', path: '/appointments' })}>
                        📅 Schedule Appointment
                      </button>
                      <button onClick={() => handleSuggestionClick({ label: 'Technical support', path: '/contact' })}>
                        🔧 Technical Support
                      </button>
                      <button onClick={() => handleSuggestionClick({ label: 'How it Works', path: '/how-it-works' })}>
                        📖 How it Works
                      </button>
                    </div>
                  </div>
                )}

                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${styles.message} ${styles[message.type]} ${focusedMessageIndex === index ? styles.focused : ''}`}
                    data-message-index={index}
                    tabIndex={isKeyboardUser ? 0 : -1}
                    role="article"
                    aria-label={`${message.type} message: ${message.text.substring(0, 50)}${message.text.length > 50 ? '...' : ''}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        inputRef.current?.focus();
                        setFocusedMessageIndex(-1);
                      }
                    }}
                    onFocus={() => setFocusedMessageIndex(index)}
                    onBlur={() => setFocusedMessageIndex(-1)}
                  >
                    <div className={styles.messageContent}>
                      {message.type === 'ai' && (
                        <FaRobot className={styles.avatar} aria-hidden="true" />
                      )}
                      {message.type === 'user' && (
                        <FaUser className={styles.avatar} aria-hidden="true" />
                      )}
                      {message.type === 'agent' && (
                        <div className={styles.agentAvatar} aria-hidden="true">
                          {message.sender?.avatar || '👨‍⚕️'}
                        </div>
                      )}
                      {message.type === 'system' && (
                        <FaTicketAlt className={styles.avatar} aria-hidden="true" />
                      )}
                      <div className={styles.messageText}>
                        {message.type === 'agent' && (
                          <div className={styles.agentInfo}>
                            <strong>{message.sender?.name || 'Support Agent'}</strong>
                            <span className={styles.agentRole}>Support Agent</span>
                          </div>
                        )}
                        <div className={styles.parsedText}>
                          {renderMessageText(message.text)}
                        </div>
                        {message.file && (
                          <div className={styles.filePreview}>
                            📄 {message.file.name}
                          </div>
                        )}
                        {message.suggestions && (
                          <div className={styles.suggestions} role="list" aria-label="Suggested actions">
                            {message.suggestions.map((suggestion, index) => {
                              const label = typeof suggestion === 'object' ? suggestion.label : suggestion;
                              return (
                                <button
                                  key={index}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className={styles.suggestionBtn}
                                  role="listitem"
                                  aria-label={`Suggestion: ${label}`}
                                >
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                        {message.needsEscalation && (
                          <button
                            onClick={() => setShowTicketModal(true)}
                            className={styles.escalateBtn}
                            aria-label="Create support ticket"
                          >
                            <FaTicketAlt /> Create Support Ticket
                          </button>
                        )}
                        {message.ticket && (
                          <div className={styles.ticketInfo} role="region" aria-label="Ticket information">
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
                    <span className={styles.timestamp} aria-label={`Message time: ${message.timestamp.toLocaleTimeString()}`}>
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

              {showEmojiPicker && (
                <div className={styles.emojiPickerContainer}>
                  <EmojiPicker
                    onEmojiClick={(emojiData) => {
                      setInputValue(prev => prev + emojiData.emoji);
                      setShowEmojiPicker(false);
                    }}
                  />
                </div>
              )}
              {/* Input Area */}
              <div className={styles.inputArea}>
                <div className={styles.inputContainer}>
                  <button className={styles.attachBtn} aria-label="Attach file" tabIndex={0}>
                    <FaPaperclip />
                  </button>
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      adjustTextareaHeight(e.target);
                    }}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    className={styles.messageInput}
                    aria-label="Type your message"
                    aria-describedby="input-help"
                    rows={1}
                  />
                  <button
                    className={styles.emojiBtn}
                    aria-label="Add emoji"
                    tabIndex={0}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <FaSmile />
                  </button>
                  <button
                    onClick={handleVoiceInput}
                    className={`${styles.voiceBtn} ${listening ? styles.micActive : ''}`}
                    aria-label="Voice input"
                    type="button"
                  >
                    <FaMicrophone />
                  </button>
                  <button
                    onClick={sendMessage}
                    disabled={!inputValue.trim()}
                    className={styles.sendBtn}
                    aria-label="Send message"
                    aria-disabled={!inputValue.trim()}
                    tabIndex={0}
                  >
                    <FaPaperPlane />
                  </button>
                </div>
                <div id="input-help" className="sr-only">
                  Press Enter to send, Shift+Enter for new line
                </div>
                <div className={styles.inputActions}>
                  {currentTicket && currentTicket.status !== 'resolved' ? (
                    <button
                      onClick={handleCloseTicket}
                      className={styles.closeTicketBtn}
                      aria-label="Close current ticket"
                      tabIndex={0}
                    >
                      <FaCheckCircle /> Close Ticket
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowTicketModal(true)}
                      className={styles.createTicketBtn}
                      aria-label="Create support ticket"
                      tabIndex={0}
                    >
                      <FaTicketAlt /> Create Ticket
                    </button>
                  )}
                  <button
                    onClick={() => window.open('tel:+1-800-HEALCONNECT')}
                    className={styles.callBtn}
                    aria-label="Request phone call"
                    tabIndex={0}
                  >
                    <FaPhone /> Request Call
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Ticket Modal */}
      <AnimatePresence>
        {showTicketModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => {
              setShowTicketModal(false);
              setSupportWidgetOpen(false);
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={styles.modal}
              onClick={(e) => e.stopPropagation()}
              role="document"
              tabIndex={-1}
            >
              <div className={styles.modalHeader}>
                <h2 id="modal-title" className={styles.modalTitle}>
                  Create Support Ticket
                </h2>
                <button
                  onClick={() => {
                    setShowTicketModal(false);
                    setSupportWidgetOpen(false);
                  }}
                  className={styles.closeModal}
                  aria-label="Close ticket creation modal"
                  tabIndex={0}
                >
                  <FaTimes />
                </button>
              </div>

              <div className={styles.modalBody}>
                <p id="modal-description" className={styles.modalDescription}>
                  Please provide details about your issue so we can assist you better.
                </p>

                <form onSubmit={createTicket} className={styles.ticketForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="ticket-subject" className={styles.formLabel}>
                      Subject *
                    </label>
                    <input
                      id="ticket-subject"
                      type="text"
                      value={ticketData.subject}
                      onChange={(e) => setTicketData(prev => ({ ...prev, subject: e.target.value }))}
                      className={styles.formInput}
                      placeholder="Brief description of your issue"
                      required
                      aria-required="true"
                      aria-describedby="subject-help"
                    />
                    <small id="subject-help" className={styles.formHelp}>
                      Be specific about your issue for faster resolution
                    </small>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="ticket-category" className={styles.formLabel}>
                      Category
                    </label>
                    <select
                      id="ticket-category"
                      value={ticketData.category}
                      onChange={(e) => setTicketData(prev => ({ ...prev, category: e.target.value }))}
                      className={styles.formSelect}
                      aria-describedby="category-help"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing Question</option>
                      <option value="appointment">Appointment Issue</option>
                      <option value="prescription">Prescription Help</option>
                      <option value="emergency">Emergency</option>
                    </select>
                    <small id="category-help" className={styles.formHelp}>
                      Select the category that best describes your issue
                    </small>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="ticket-priority" className={styles.formLabel}>
                      Priority Level
                    </label>
                    <div
                      className={styles.priorityOptions}
                      role="radiogroup"
                      aria-labelledby="ticket-priority"
                      aria-describedby="priority-help"
                    >
                      {['normal', 'high', 'urgent'].map((priority) => (
                        <label key={priority} className={styles.priorityOption}>
                          <input
                            type="radio"
                            name="priority"
                            value={priority}
                            checked={ticketData.priority === priority}
                            onChange={(e) => setTicketData(prev => ({ ...prev, priority: e.target.value }))}
                            className={styles.priorityRadio}
                            aria-describedby={`${priority}-desc`}
                          />
                          <span className={styles.priorityLabel}>
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </span>
                          <span id={`${priority}-desc`} className="sr-only">
                            {priority === 'urgent' && 'Urgent priority for critical issues'}
                            {priority === 'high' && 'High priority for important issues'}
                            {priority === 'normal' && 'Normal priority for general inquiries'}
                          </span>
                        </label>
                      ))}
                    </div>
                    <small id="priority-help" className={styles.formHelp}>
                      Choose urgent only for critical medical emergencies
                    </small>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="ticket-description" className={styles.formLabel}>
                      Description *
                    </label>
                    <textarea
                      id="ticket-description"
                      value={ticketData.description}
                      onChange={(e) => setTicketData(prev => ({ ...prev, description: e.target.value }))}
                      className={styles.formTextarea}
                      placeholder="Please describe your issue in detail..."
                      rows={4}
                      required
                      aria-required="true"
                      aria-describedby="description-help"
                    />
                    <small id="description-help" className={styles.formHelp}>
                      Include any relevant details, error messages, or steps you've already taken
                    </small>
                  </div>

                  <div className={styles.formActions}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowTicketModal(false);
                        setSupportWidgetOpen(false);
                      }}
                      className={styles.cancelBtn}
                      aria-label="Cancel ticket creation"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!ticketData.subject || !ticketData.description}
                      className={styles.submitBtn}
                      aria-disabled={!ticketData.subject || !ticketData.description}
                      aria-label="Create support ticket"
                    >
                      <FaTicketAlt /> Create Ticket
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SupportWidget;
