// Support API utilities for ticket management and AI responses
import { collection, addDoc, getDocs, getDoc, query, where, orderBy, limit, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Ticket management functions
export const createSupportTicket = async (ticketData) => {
  try {
    const ticket = {
      ...ticketData,
      id: `TKT-${Date.now()}`,
      status: 'open',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      assignedTo: null,
      priority: ticketData.priority || 'normal',
      category: ticketData.category || 'general'
    };

    const docRef = await addDoc(collection(db, 'supportTickets'), ticket);
    return { success: true, ticketId: docRef.id, ticket };
  } catch (error) {
    console.error('Error creating support ticket:', error);
    return { success: false, error: error.message };
  }
};

export const getSupportTickets = async (filters = {}) => {
  try {
    let q = collection(db, 'supportTickets');
    
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    if (filters.priority) {
      q = query(q, where('priority', '==', filters.priority));
    }
    
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    
    q = query(q, orderBy('createdAt', 'desc'));
    
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    const querySnapshot = await getDocs(q);
    const tickets = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, tickets };
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return { success: false, error: error.message };
  }
};

export const updateTicketStatus = async (ticketId, status, assignedTo = null) => {
  try {
    const ticketRef = doc(db, 'supportTickets', ticketId);
    const updateData = {
      status,
      updatedAt: serverTimestamp()
    };

    if (assignedTo) {
      updateData.assignedTo = assignedTo;
    }

    await updateDoc(ticketRef, updateData);
    return { success: true };
  } catch (error) {
    console.error('Error updating ticket status:', error);
    return { success: false, error: error.message };
  }
};

export const addTicketMessage = async (ticketId, message) => {
  try {
    const ticketRef = doc(db, 'supportTickets', ticketId);
    const messageData = {
      ...message,
      timestamp: serverTimestamp()
    };

    // Get current ticket data
    const ticketSnap = await getDoc(ticketRef);
    const ticketData = ticketSnap.data();
    
    // Add message to existing messages array
    const updatedMessages = [...(ticketData.messages || []), messageData];
    
    await updateDoc(ticketRef, {
      messages: updatedMessages,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error adding ticket message:', error);
    return { success: false, error: error.message };
  }
};

// AI response generation
export const generateAIResponse = (userMessage, context = {}) => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Medical emergency detection
  if (containsEmergencyKeywords(lowerMessage)) {
    return {
      text: "⚠️ If this is a medical emergency, please call 911 immediately or go to the nearest emergency room. For non-urgent medical issues, I can help you connect with healthcare providers or guide you to appropriate resources.",
      suggestions: ['Find a doctor', 'Schedule appointment', 'Medical emergency'],
      needsEscalation: false,
      priority: 'urgent'
    };
  }

  // Appointment-related queries
  if (containsAppointmentKeywords(lowerMessage)) {
    return {
      text: "I can help you schedule an appointment! You can book appointments through your dashboard, or I can guide you through the process. What type of appointment do you need?",
      suggestions: ['Book with existing doctor', 'Find new doctor', 'Urgent appointment', 'Cancel appointment'],
      needsEscalation: false,
      category: 'appointment'
    };
  }

  // Prescription-related queries
  if (containsPrescriptionKeywords(lowerMessage)) {
    return {
      text: "For prescription-related queries, I can help you view your current prescriptions, request refills, or connect you with a pharmacist. What specific help do you need with your medications?",
      suggestions: ['View prescriptions', 'Request refill', 'Medication side effects', 'Pharmacy locator'],
      needsEscalation: false,
      category: 'medical'
    };
  }

  // Account/login issues
  if (containsAccountKeywords(lowerMessage)) {
    return {
      text: "I can help you with account issues! For password resets, click 'Forgot Password' on the login page. For other account problems, I can connect you with our support team.",
      suggestions: ['Reset password', 'Account locked', 'Login issues', 'Update profile'],
      needsEscalation: true,
      category: 'account'
    };
  }

  // Billing/payment issues
  if (containsBillingKeywords(lowerMessage)) {
    return {
      text: "Billing and insurance questions often require personal account access. I'd recommend connecting with our billing team for accurate information about your specific situation.",
      suggestions: ['Billing inquiry', 'Insurance question', 'Payment issue', 'Refund request'],
      needsEscalation: true,
      category: 'billing'
    };
  }

  // Technical support
  if (containsTechnicalKeywords(lowerMessage)) {
    return {
      text: "I can help with technical issues! Common problems include app crashes, login issues, or feature questions. What specific technical issue are you experiencing?",
      suggestions: ['App not working', 'Feature not working', 'Bug report', 'Performance issue'],
      needsEscalation: false,
      category: 'technical'
    };
  }

  // Default response
  return {
    text: "I'm here to help you with HealConnect! I can assist with appointments, prescriptions, finding doctors, and general questions. For complex issues, I can connect you with our support team.",
    suggestions: ['Find a doctor', 'Schedule appointment', 'Technical support', 'Billing help', 'Account issues'],
    needsEscalation: false,
    category: 'general'
  };
};

// Keyword detection helpers
const containsEmergencyKeywords = (message) => {
  const emergencyKeywords = [
    'emergency', 'urgent', 'dying', 'chest pain', 'heart attack', 'stroke',
    'bleeding', 'unconscious', 'difficulty breathing', 'severe pain',
    'call 911', 'ambulance', 'emergency room'
  ];
  return emergencyKeywords.some(keyword => message.includes(keyword));
};

const containsAppointmentKeywords = (message) => {
  const appointmentKeywords = [
    'appointment', 'schedule', 'book', 'visit', 'consultation',
    'see doctor', 'doctor visit', 'checkup', 'follow up'
  ];
  return appointmentKeywords.some(keyword => message.includes(keyword));
};

const containsPrescriptionKeywords = (message) => {
  const prescriptionKeywords = [
    'prescription', 'medicine', 'medication', 'drug', 'refill',
    'pharmacy', 'dose', 'side effect', 'pill'
  ];
  return prescriptionKeywords.some(keyword => message.includes(keyword));
};

const containsAccountKeywords = (message) => {
  const accountKeywords = [
    'login', 'password', 'account', 'profile', 'sign in', 'log in',
    'forgot password', 'reset password', 'account locked'
  ];
  return accountKeywords.some(keyword => message.includes(keyword));
};

const containsBillingKeywords = (message) => {
  const billingKeywords = [
    'billing', 'payment', 'charge', 'invoice', 'cost', 'price',
    'insurance', 'refund', 'credit card'
  ];
  return billingKeywords.some(keyword => message.includes(keyword));
};

const containsTechnicalKeywords = (message) => {
  const technicalKeywords = [
    'app', 'website', 'not working', 'error', 'bug', 'crash',
    'slow', 'feature', 'technical', 'glitch', 'problem'
  ];
  return technicalKeywords.some(keyword => message.includes(keyword));
};

// Support analytics
export const getSupportStats = async () => {
  try {
    const ticketsQuery = query(
      collection(db, 'supportTickets'),
      orderBy('createdAt', 'desc'),
      limit(1000)
    );
    
    const querySnapshot = await getDocs(ticketsQuery);
    const tickets = querySnapshot.docs.map(doc => doc.data());
    
    const stats = {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in_progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      urgent: tickets.filter(t => t.priority === 'urgent').length,
      avgResponseTime: calculateAvgResponseTime(tickets),
      satisfactionRate: calculateSatisfactionRate(tickets)
    };

    return { success: true, stats };
  } catch (error) {
    console.error('Error fetching support stats:', error);
    return { success: false, error: error.message };
  }
};

const calculateAvgResponseTime = (tickets) => {
  // This would calculate actual response time based on message timestamps
  // For now, return a mock value
  return '2.5 hours';
};

const calculateSatisfactionRate = (tickets) => {
  // This would calculate based on user feedback
  // For now, return a mock value
  return '94%';
};

// Auto-assignment logic
export const assignTicketToAgent = async (ticketId, category, priority) => {
  try {
    // Logic to find the best available agent based on category and priority
    const availableAgents = await getAvailableAgents(category);
    
    if (availableAgents.length === 0) {
      return { success: false, error: 'No agents available' };
    }

    // Select agent with least tickets or highest rating
    const selectedAgent = selectBestAgent(availableAgents, priority);
    
    const result = await updateTicketStatus(ticketId, 'in_progress', selectedAgent);
    
    if (result.success) {
      // Notify agent
      await notifyAgent(selectedAgent.id, ticketId);
    }

    return result;
  } catch (error) {
    console.error('Error assigning ticket:', error);
    return { success: false, error: error.message };
  }
};

const getAvailableAgents = async (category) => {
  // Mock implementation - would query actual agents from database
  return [
    { id: 'agent1', name: 'Sarah Johnson', specialties: ['general', 'account'], activeTickets: 3 },
    { id: 'agent2', name: 'Mike Chen', specialties: ['technical', 'medical'], activeTickets: 5 },
    { id: 'agent3', name: 'Emily Davis', specialties: ['billing', 'appointment'], activeTickets: 2 }
  ].filter(agent => agent.specialties.includes(category) || agent.specialties.includes('general'));
};

const selectBestAgent = (agents, priority) => {
  // Prioritize agents with fewer tickets for urgent issues
  if (priority === 'urgent') {
    return agents.reduce((best, agent) => 
      agent.activeTickets < best.activeTickets ? agent : best
    );
  }
  
  // Otherwise, select randomly or based on rating
  return agents[0];
};

const notifyAgent = async (agentId, ticketId) => {
  // Implementation to notify agent (email, push notification, etc.)
  console.log(`Notifying agent ${agentId} about ticket ${ticketId}`);
  return { success: true };
};

export default {
  createSupportTicket,
  getSupportTickets,
  updateTicketStatus,
  addTicketMessage,
  generateAIResponse,
  getSupportStats,
  assignTicketToAgent
};
