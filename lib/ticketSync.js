// Real-time ticket synchronization between user support widget and admin dashboard
import { collection, addDoc, getDocs, query, where, orderBy, limit, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Global ticket storage for real-time updates
let globalTicketCache = [];
let globalTicketListeners = [];

// Create a new support ticket
export const createSupportTicket = async (ticketData) => {
  try {
    // First create the document in Firestore to get the document ID
    const docRef = await addDoc(collection(db, 'supportTickets'), {
      ...ticketData,
      status: 'open',
      priority: ticketData.priority || 'normal',
      category: ticketData.category || 'general',
      userId: ticketData.userId || null, // Ensure userId is saved at top level
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      assignedTo: null,
      messages: ticketData.messages || [],
      tags: ticketData.tags || []
    });

    // Add the custom ID and Firestore ID to the document
    const ticketWithCustomId = {
      id: `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      firestoreId: docRef.id
    };

    // Update the document with the custom ID
    await updateDoc(docRef, ticketWithCustomId);

    // Create the complete ticket object for cache
    const ticket = {
      ...ticketData,
      ...ticketWithCustomId,
      status: 'open',
      priority: ticketData.priority || 'normal',
      category: ticketData.category || 'general',
      userId: ticketData.userId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      assignedTo: null,
      messages: ticketData.messages || [],
      tags: ticketData.tags || []
    };

    // Add to local cache
    globalTicketCache.push(ticket);

    // Notify all listeners
    notifyTicketListeners('created', ticket);

    console.log('Ticket created:', ticket);
    return { success: true, ticketId: docRef.id, ticket: ticket };
  } catch (error) {
    console.error('Error creating support ticket:', error);
    return { success: false, error: error.message };
  }
};

// Get all tickets with real-time updates
export const getSupportTickets = (callback, userId = null, role = null) => {
  try {
    let q;

    if (role === 'admin') {
      q = query(
        collection(db, 'supportTickets'),
        orderBy('createdAt', 'desc')
      );
    } else if (userId) {
      q = query(
        collection(db, 'supportTickets'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
    } else {
      if (callback) callback([]);
      return () => { };
    }

    // Initial load
    getDocs(q).then((querySnapshot) => {
      const tickets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        firestoreId: doc.id,
        ...doc.data()
      }));

      globalTicketCache = tickets;
      if (callback) callback(tickets);
    }).catch(error => {
      console.error('Error fetching initial tickets:', error);
    });

    // Real-time listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tickets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        firestoreId: doc.id,
        ...doc.data()
      }));

      globalTicketCache = tickets;
      if (callback) callback(tickets);
      notifyTicketListeners('updated', tickets);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error getting support tickets:', error);
    return null;
  }
};

// Update ticket status
export const updateTicketStatus = async (ticketId, status, assignedTo = null) => {
  try {
    // Find the ticket in cache to get the Firestore document ID
    const ticket = globalTicketCache.find(t =>
      t.id === ticketId || t.firestoreId === ticketId
    );

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Use the Firestore document ID for the update
    const firestoreId = ticket.firestoreId || ticketId;

    // Update in Firestore using the correct document ID
    const ticketRef = doc(db, 'supportTickets', firestoreId);
    const updateData = {
      status,
      updatedAt: serverTimestamp()
    };

    if (assignedTo) {
      updateData.assignedTo = assignedTo;
    }

    await updateDoc(ticketRef, updateData);

    // Update cache
    const ticketIndex = globalTicketCache.findIndex(t =>
      t.id === ticketId || t.firestoreId === ticketId
    );

    if (ticketIndex !== -1) {
      globalTicketCache[ticketIndex] = { ...globalTicketCache[ticketIndex], ...updateData };
    }

    // Notify listeners
    notifyTicketListeners('updated', globalTicketCache);

    return { success: true };
  } catch (error) {
    console.error('Error updating ticket status:', error);
    return { success: false, error: error.message };
  }
};

// Add message to ticket
export const addTicketMessage = async (ticketId, message) => {
  try {
    console.log('TicketSync: Adding message to ticket:', ticketId);
    console.log('TicketSync: Message data:', message);

    // Find the ticket in cache to get the Firestore document ID
    const ticket = globalTicketCache.find(t =>
      t.id === ticketId || t.firestoreId === ticketId
    );

    console.log('TicketSync: Found ticket in cache:', ticket);

    if (!ticket) {
      console.error('TicketSync: Ticket not found in cache');
      throw new Error('Ticket not found');
    }

    // Use the Firestore document ID for the update
    const firestoreId = ticket.firestoreId || ticketId;
    console.log('TicketSync: Using Firestore ID:', firestoreId);

    // Create message with proper timestamp handling
    const messageData = {
      ...message,
      timestamp: new Date().toISOString() // Use ISO string instead of serverTimestamp for array items
    };

    console.log('TicketSync: Formatted message data:', messageData);

    // Update in Firestore using the correct document ID
    const ticketRef = doc(db, 'supportTickets', firestoreId);
    const updatedMessages = [...(ticket.messages || []), messageData];

    console.log('TicketSync: Updating Firestore with messages:', updatedMessages);

    await updateDoc(ticketRef, {
      messages: updatedMessages,
      updatedAt: serverTimestamp() // Only use serverTimestamp for top-level fields
    });

    console.log('TicketSync: Firestore update successful');

    // Update cache
    const ticketIndex = globalTicketCache.findIndex(t =>
      t.id === ticketId || t.firestoreId === ticketId
    );

    if (ticketIndex !== -1) {
      globalTicketCache[ticketIndex] = {
        ...globalTicketCache[ticketIndex],
        messages: updatedMessages,
        updatedAt: new Date()
      };
      console.log('TicketSync: Updated local cache');
    }

    // Notify listeners
    notifyTicketListeners('updated', globalTicketCache);
    console.log('TicketSync: Notified listeners');

    return { success: true };
  } catch (error) {
    console.error('TicketSync: Error adding ticket message:', error);
    return { success: false, error: error.message };
  }
};

// Subscribe to ticket updates
export const subscribeToTickets = (callback, userId = null, role = null) => {
  const listenerId = Date.now().toString();
  globalTicketListeners.push({ id: listenerId, callback });

  if (userId || role === 'admin') {
    getSupportTickets(null, userId, role);
  }

  // Immediately send current cache
  if (callback) {
    callback(globalTicketCache);
  }

  return listenerId;
};

// Unsubscribe from ticket updates
export const unsubscribeFromTickets = (listenerId) => {
  globalTicketListeners = globalTicketListeners.filter(listener => listener.id !== listenerId);
};

// Notify all listeners
const notifyTicketListeners = (action, data) => {
  globalTicketListeners.forEach(listener => {
    try {
      listener.callback(data, action);
    } catch (error) {
      console.error('Error notifying ticket listener:', error);
    }
  });
};

// Get ticket statistics
export const getTicketStats = () => {
  const stats = {
    total: globalTicketCache.length,
    open: globalTicketCache.filter(t => t.status === 'open').length,
    inProgress: globalTicketCache.filter(t => t.status === 'in_progress').length,
    resolved: globalTicketCache.filter(t => t.status === 'resolved').length,
    urgent: globalTicketCache.filter(t => t.priority === 'urgent').length,
    today: globalTicketCache.filter(t => {
      const today = new Date();
      const ticketDate = t.createdAt?.toDate ? t.createdAt.toDate() : new Date(t.createdAt);
      return ticketDate.toDateString() === today.toDateString();
    }).length
  };

  return stats;
};

// Initialize ticket sync
export const initializeTicketSync = () => {
  console.log('Initializing ticket synchronization...');

  // Set up real-time listener
  getSupportTickets((tickets) => {
    console.log('Tickets synchronized:', tickets.length);
  });
};

export default {
  createSupportTicket,
  getSupportTickets,
  updateTicketStatus,
  addTicketMessage,
  subscribeToTickets,
  unsubscribeFromTickets,
  getTicketStats,
  initializeTicketSync
};
