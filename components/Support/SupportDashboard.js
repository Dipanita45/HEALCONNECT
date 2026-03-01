import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaTicketAlt, FaClock, FaCheckCircle, FaExclamationTriangle,
  FaUser, FaRobot, FaFilter, FaSearch, FaDownload, FaEye,
  FaReply, FaArchive, FaTrash, FaPlus, FaChartLine, FaUsers,
  FaCommentDots, FaHourglassHalf, FaBan
} from 'react-icons/fa';
import styles from './SupportDashboard.module.css';

const SupportDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    urgent: 0
  });

  // Mock data - in production, this would come from your backend
  useEffect(() => {
    const mockTickets = [
      {
        id: 'TKT-1640995200000',
        subject: 'Cannot login to my account',
        category: 'account',
        priority: 'high',
        status: 'open',
        user: {
          name: 'John Doe',
          email: 'john@example.com',
          avatar: '👤'
        },
        createdAt: new Date('2024-01-15T10:30:00'),
        updatedAt: new Date('2024-01-15T10:30:00'),
        messages: [
          {
            type: 'user',
            text: 'I have been trying to login for the past hour but keep getting an error message.',
            timestamp: new Date('2024-01-15T10:30:00')
          }
        ],
        assignedTo: null,
        tags: ['login', 'account', 'urgent']
      },
      {
        id: 'TKT-1640991600000',
        question: 'How do I schedule an appointment?',
        category: 'general',
        priority: 'normal',
        status: 'in_progress',
        user: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          avatar: '👩'
        },
        createdAt: new Date('2024-01-15T09:30:00'),
        updatedAt: new Date('2024-01-15T10:15:00'),
        messages: [
          {
            type: 'user',
            text: 'I need to schedule a follow-up appointment with my doctor.',
            timestamp: new Date('2024-01-15T09:30:00')
          },
          {
            type: 'ai',
            text: 'I can help you schedule an appointment. You can book through your dashboard or I can guide you through the process.',
            timestamp: new Date('2024-01-15T09:32:00')
          },
          {
            type: 'agent',
            text: 'I see you need to schedule a follow-up. Let me check your doctor\'s availability...',
            timestamp: new Date('2024-01-15T10:15:00')
          }
        ],
        assignedTo: {
          name: 'Sarah Johnson',
          avatar: '👩‍⚕️'
        },
        tags: ['appointment', 'scheduling']
      },
      {
        id: 'TKT-1640988000000',
        subject: 'Prescription refill request',
        category: 'medical',
        priority: 'normal',
        status: 'resolved',
        user: {
          name: 'Mike Wilson',
          email: 'mike@example.com',
          avatar: '👨'
        },
        createdAt: new Date('2024-01-15T08:30:00'),
        updatedAt: new Date('2024-01-15T11:00:00'),
        messages: [
          {
            type: 'user',
            text: 'I need a refill for my blood pressure medication.',
            timestamp: new Date('2024-01-15T08:30:00')
          },
          {
            type: 'agent',
            text: 'I\'ve processed your prescription refill request. It should be ready for pickup in 24 hours.',
            timestamp: new Date('2024-01-15T11:00:00')
          }
        ],
        assignedTo: {
          name: 'Dr. Emily Chen',
          avatar: '👩‍⚕️'
        },
        tags: ['prescription', 'refill', 'completed']
      }
    ];

    setTickets(mockTickets);

    // Calculate stats
    const ticketStats = {
      total: mockTickets.length,
      open: mockTickets.filter(t => t.status === 'open').length,
      inProgress: mockTickets.filter(t => t.status === 'in_progress').length,
      resolved: mockTickets.filter(t => t.status === 'resolved').length,
      urgent: mockTickets.filter(t => t.priority === 'urgent').length
    };
    setStats(ticketStats);
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = filter === 'all' || ticket.status === filter;
    const matchesSearch =
      (ticket.subject?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (ticket.user?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (ticket.user?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <FaExclamationTriangle className={styles.statusIcon} />;
      case 'in_progress': return <FaHourglassHalf className={styles.statusIcon} />;
      case 'resolved': return <FaCheckCircle className={styles.statusIcon} />;
      default: return <FaTicketAlt className={styles.statusIcon} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return styles.urgent;
      case 'high': return styles.high;
      case 'normal': return styles.normal;
      case 'low': return styles.low;
      default: return styles.normal;
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const updateTicketStatus = (ticketId, newStatus) => {
    setTickets(prev => prev.map(ticket =>
      ticket.id === ticketId
        ? { ...ticket, status: newStatus, updatedAt: new Date() }
        : ticket
    ));
  };

  const assignTicket = (ticketId, agentName) => {
    setTickets(prev => prev.map(ticket =>
      ticket.id === ticketId
        ? {
          ...ticket,
          assignedTo: { name: agentName, avatar: '👤' },
          status: 'in_progress',
          updatedAt: new Date()
        }
        : ticket
    ));
  };

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <FaTicketAlt className={styles.headerIcon} />
          <div>
            <h1>Support Dashboard</h1>
            <p>Manage customer support tickets and inquiries</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.createTicketBtn}>
            <FaPlus /> Create Ticket
          </button>
          <button className={styles.exportBtn}>
            <FaDownload /> Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${styles.statCard} ${styles.total}`}
        >
          <div className={styles.statIcon}>
            <FaTicketAlt />
          </div>
          <div className={styles.statContent}>
            <h3>{stats.total}</h3>
            <p>Total Tickets</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${styles.statCard} ${styles.open}`}
        >
          <div className={styles.statIcon}>
            <FaExclamationTriangle />
          </div>
          <div className={styles.statContent}>
            <h3>{stats.open}</h3>
            <p>Open Tickets</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`${styles.statCard} ${styles.inProgress}`}
        >
          <div className={styles.statIcon}>
            <FaHourglassHalf />
          </div>
          <div className={styles.statContent}>
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`${styles.statCard} ${styles.resolved}`}
        >
          <div className={styles.statIcon}>
            <FaCheckCircle />
          </div>
          <div className={styles.statContent}>
            <h3>{stats.resolved}</h3>
            <p>Resolved</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`${styles.statCard} ${styles.urgent}`}
        >
          <div className={styles.statIcon}>
            <FaBan />
          </div>
          <div className={styles.statContent}>
            <h3>{stats.urgent}</h3>
            <p>Urgent</p>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filters}>
          <button
            onClick={() => setFilter('all')}
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
          >
            <FaFilter /> All
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`${styles.filterBtn} ${filter === 'open' ? styles.active : ''}`}
          >
            <FaExclamationTriangle /> Open
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`${styles.filterBtn} ${filter === 'in_progress' ? styles.active : ''}`}
          >
            <FaHourglassHalf /> In Progress
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`${styles.filterBtn} ${filter === 'resolved' ? styles.active : ''}`}
          >
            <FaCheckCircle /> Resolved
          </button>
        </div>
      </div>

      {/* Tickets List */}
      <div className={styles.ticketsContainer}>
        <div className={styles.ticketsList}>
          <h2>Tickets ({filteredTickets.length})</h2>

          {filteredTickets.length === 0 ? (
            <div className={styles.emptyState}>
              <FaTicketAlt className={styles.emptyIcon} />
              <h3>No tickets found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className={styles.tickets}>
              {filteredTickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className={`${styles.ticket} ${styles[ticket.status]}`}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className={styles.ticketHeader}>
                    <div className={styles.ticketInfo}>
                      <div className={styles.ticketId}>
                        <FaTicketAlt /> {ticket.id}
                      </div>
                      <div className={`${styles.priority} ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </div>
                    </div>
                    <div className={styles.ticketMeta}>
                      {getStatusIcon(ticket.status)}
                      <span className={styles.timeAgo}>
                        {formatTimeAgo(ticket.updatedAt)}
                      </span>
                    </div>
                  </div>

                  <h3 className={styles.ticketSubject}>{ticket.subject || 'No Subject'}</h3>

                  <div className={styles.ticketUser}>
                    <span className={styles.userAvatar}>{ticket.user?.avatar || '👤'}</span>
                    <div>
                      <div className={styles.userName}>{ticket.user?.name || 'Unknown User'}</div>
                      <div className={styles.userEmail}>{ticket.user?.email || 'No Email'}</div>
                    </div>
                  </div>

                  <div className={styles.ticketFooter}>
                    <div className={styles.tags}>
                      {(ticket.tags || []).map((tag, index) => (
                        <span key={index} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    {ticket.assignedTo && (
                      <div className={styles.assignedTo}>
                        <span className={styles.agentAvatar}>{ticket.assignedTo.avatar}</span>
                        <span>{ticket.assignedTo.name}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Ticket Detail View */}
        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={styles.ticketDetail}
          >
            <div className={styles.detailHeader}>
              <div className={styles.detailInfo}>
                <h2>{selectedTicket?.subject || 'No Subject'}</h2>
                <div className={styles.detailMeta}>
                  <span className={`${styles.priority} ${getPriorityColor(selectedTicket?.priority || 'normal')}`}>
                    {selectedTicket?.priority || 'normal'}
                  </span>
                  <span className={`${styles.status} ${styles[selectedTicket?.status || 'open']}`}>
                    {(selectedTicket?.status || 'open').replace('_', ' ')}
                  </span>
                  <span className={styles.ticketId}>
                    {selectedTicket?.id || 'Unknown'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className={styles.closeDetail}
              >
                ×
              </button>
            </div>

            <div className={styles.detailContent}>
              <div className={styles.userInfo}>
                <span className={styles.userAvatar}>{selectedTicket?.user?.avatar || '👤'}</span>
                <div>
                  <h3>{selectedTicket?.user?.name || 'Unknown User'}</h3>
                  <p>{selectedTicket?.user?.email || 'No Email'}</p>
                </div>
              </div>

              <div className={styles.messages}>
                {(selectedTicket?.messages || []).map((message, index) => (
                  <div key={index} className={`${styles.message} ${styles[message.type]}`}>
                    <div className={styles.messageHeader}>
                      {message.type === 'user' && (
                        <>
                          <span className={styles.userAvatar}>{selectedTicket?.user?.avatar || '👤'}</span>
                          <span>{selectedTicket?.user?.name || 'User'}</span>
                        </>
                      )}
                      {message.type === 'ai' && (
                        <>
                          <FaRobot className={styles.aiAvatar} />
                          <span>AI Assistant</span>
                        </>
                      )}
                      {message.type === 'agent' && (
                        <>
                          <span className={styles.agentAvatar}>👤</span>
                          <span>Support Agent</span>
                        </>
                      )}
                      <span className={styles.messageTime}>
                        {message.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <p className={styles.messageText}>{message.text}</p>
                  </div>
                ))}
              </div>

              <div className={styles.actions}>
                <select
                  value={selectedTicket?.status || 'open'}
                  onChange={(e) => updateTicketStatus(selectedTicket?.id || '', e.target.value)}
                  className={styles.statusSelect}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>

                <button className={styles.replyBtn}>
                  <FaReply /> Reply
                </button>

                <button className={styles.archiveBtn}>
                  <FaArchive /> Archive
                </button>

                <button className={styles.deleteBtn}>
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SupportDashboard;
