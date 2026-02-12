import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTicketAlt, FaUsers, FaClock, FaCheckCircle, FaExclamationTriangle,
  FaFilter, FaSearch, FaDownload, FaEye, FaReply, FaArchive, FaTrash,
  FaUserPlus, FaChartLine, FaBell, FaCog, FaSignOutAlt, FaHeadset,
  FaRobot, FaPhone, FaEnvelope, FaCalendarAlt, FaTrendingUp, FaTimes, FaPaperPlane
} from 'react-icons/fa';
import { getSupportTickets, subscribeToTickets, getTicketStats, addTicketMessage, updateTicketStatus } from '../../lib/ticketSync';
import styles from './support-management.module.css';

const AdminSupportManagement = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [agents, setAgents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [systemStats, setSystemStats] = useState({
    totalTickets: 0,
    avgResponseTime: '2.5 hours',
    satisfactionRate: '94%',
    activeAgents: 0,
    ticketsToday: 0,
    urgentTickets: 0,
    resolvedToday: 0
  });

  // Initialize real-time ticket synchronization
  useEffect(() => {
    // Subscribe to real-time ticket updates
    const unsubscribe = getSupportTickets((updatedTickets) => {
      setTickets(updatedTickets);

      // Update statistics
      const stats = {
        total: updatedTickets.length,
        open: updatedTickets.filter(t => t.status === 'open').length,
        inProgress: updatedTickets.filter(t => t.status === 'in_progress').length,
        resolved: updatedTickets.filter(t => t.status === 'resolved').length,
        urgent: updatedTickets.filter(t => t.priority === 'urgent').length,
        today: updatedTickets.filter(t => {
          const today = new Date();
          const ticketDate = t.createdAt?.toDate ? t.createdAt.toDate() : new Date(t.createdAt);
          return ticketDate.toDateString() === today.toDateString();
        }).length
      };

      setSystemStats(prev => ({
        ...prev,
        ...stats,
        avgResponseTime: '2.5 hours', // Calculate from actual data if needed
        satisfactionRate: '94%', // Calculate from actual data if needed
        activeAgents: agents.filter(a => a.status === 'online').length
      }));
    });

    // Cleanup on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [agents]);

  const sidebarItems = [
    { id: 'dashboard', label: 'Support Dashboard', icon: FaTicketAlt },
    { id: 'agents', label: 'Agent Management', icon: FaUsers },
    { id: 'analytics', label: 'Analytics', icon: FaChartLine },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'settings', label: 'Settings', icon: FaCog }
  ];

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notificationId) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <FaExclamationTriangle className={styles.statusIcon} />;
      case 'in_progress': return <FaClock className={styles.statusIcon} />;
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

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleReplyClick = (ticket) => {
    setSelectedTicket(ticket);
    setShowReplyModal(true);
    setReplyMessage('');
  };

  // Keyboard navigation: Close modal on Escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showReplyModal) {
        setShowReplyModal(false);
      }
    };

    if (showReplyModal) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [showReplyModal]);

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    console.log('AdminDashboard: Sending reply to ticket:', selectedTicket.id);
    console.log('AdminDashboard: Reply message:', replyMessage);

    try {
      // Add message to ticket
      const messageData = {
        type: 'agent',
        text: replyMessage,
        sender: {
          name: 'Support Agent', // In production, get from auth context
          email: 'agent@healconnect.com',
          avatar: '👨‍⚕️'
        }
      };

      console.log('AdminDashboard: Calling addTicketMessage with:', messageData);
      const result = await addTicketMessage(selectedTicket.id, messageData);
      console.log('AdminDashboard: addTicketMessage result:', result);

      if (result.success) {
        // Update ticket status to in_progress if it was open
        if (selectedTicket.status === 'open') {
          console.log('AdminDashboard: Updating ticket status to in_progress');
          await updateTicketStatus(selectedTicket.id, 'in_progress', {
            name: 'Support Agent',
            avatar: '👨‍⚕️'
          });
        }

        // Close modal and reset form
        setShowReplyModal(false);
        setReplyMessage('');
        setSelectedTicket(null);

        // Show success notification
        alert('Reply sent successfully!');
      } else {
        console.error('AdminDashboard: Failed to send reply:', result.error);
        alert('Failed to send reply: ' + result.error);
      }
    } catch (error) {
      console.error('AdminDashboard: Error sending reply:', error);
      alert('Failed to send reply. Please try again.');
    }
  };

  const handleCloseTicket = async (ticket) => {
    if (!confirm(`Are you sure you want to close ticket ${ticket.id}? This action cannot be undone.`)) {
      return;
    }

    try {
      console.log('AdminDashboard: Closing ticket:', ticket.id);

      // Add closing message
      const closingMessage = {
        type: 'agent',
        text: 'This ticket has been marked as resolved. If you have any further questions, please create a new ticket.',
        sender: {
          name: 'Support Agent',
          email: 'agent@healconnect.com',
          avatar: '👨‍⚕️'
        }
      };

      const messageResult = await addTicketMessage(ticket.id, closingMessage);

      if (messageResult.success) {
        // Update ticket status to resolved
        const statusResult = await updateTicketStatus(ticket.id, 'resolved', {
          name: 'Support Agent',
          avatar: '👨‍⚕️'
        });

        if (statusResult.success) {
          alert(`Ticket ${ticket.id} has been successfully closed.`);
        } else {
          alert('Failed to update ticket status. Please try again.');
        }
      } else {
        alert('Failed to add closing message. Please try again.');
      }
    } catch (error) {
      console.error('AdminDashboard: Error closing ticket:', error);
      alert('Failed to close ticket. Please try again.');
    }
  };

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    // Could open a detailed view modal or navigate to details page
    alert(`Viewing details for ticket ${ticket.id}\n\nSubject: ${ticket.subject}\nStatus: ${ticket.status}\nPriority: ${ticket.priority}`);
  };

  const renderDashboard = () => (
    <div className={styles.dashboardView}>
      <div className={styles.header}>
        <h2>Support Management Dashboard</h2>
        <div className={styles.headerActions}>
          <button
            className={styles.exportBtn}
            type="button"
            aria-label="Export support tickets report"
          >
            <FaDownload aria-hidden="true" /> Export Report
          </button>
          <button
            className={styles.settingsBtn}
            type="button"
            aria-label="Open settings"
          >
            <FaCog aria-hidden="true" /> Settings
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={styles.quickStats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaTicketAlt />
          </div>
          <div className={styles.statContent}>
            <h3>{systemStats.totalTickets}</h3>
            <p>Total Tickets</p>
            <span className={styles.statChange}>+12% this week</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaUsers />
          </div>
          <div className={styles.statContent}>
            <h3>{systemStats.activeAgents}/{agents.length}</h3>
            <p>Active Agents</p>
            <span className={styles.statChange}>2 online now</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaClock />
          </div>
          <div className={styles.statContent}>
            <h3>{systemStats.avgResponseTime}</h3>
            <p>Avg Response Time</p>
            <span className={styles.statChange}>-15% improvement</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaCheckCircle />
          </div>
          <div className={styles.statContent}>
            <h3>{systemStats.satisfactionRate}</h3>
            <p>Satisfaction Rate</p>
            <span className={styles.statChange}>+2% this month</span>
          </div>
        </div>
      </div>

      {/* Real-time Support Dashboard */}
      <div className={styles.supportDashboardContainer}>
        <div className={styles.dashboardHeader}>
          <h3>Recent Support Tickets</h3>
          <div className={styles.dashboardActions}>
            <button
              className={styles.refreshBtn}
              type="button"
              aria-label="Refresh ticket list"
            >
              <FaClock aria-hidden="true" /> Refresh
            </button>
            <button
              className={styles.exportBtn}
              type="button"
              aria-label="Export tickets to file"
            >
              <FaDownload aria-hidden="true" /> Export
            </button>
          </div>
        </div>

        <div className={styles.ticketsGrid}>
          {tickets.length === 0 ? (
            <div className={styles.emptyState}>
              <FaTicketAlt className={styles.emptyIcon} />
              <h3>No tickets yet</h3>
              <p>Support tickets will appear here when users create them</p>
            </div>
          ) : (
            tickets.slice(0, 6).map((ticket) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${styles.ticketCard} ${styles[ticket.status]}`}
              >
                <div className={styles.ticketHeader}>
                  <div className={styles.ticketInfo}>
                    <div className={styles.ticketId}>
                      <FaTicketAlt /> {ticket.id}
                    </div>
                    <div className={`${styles.priority} ${styles[ticket.priority]}`}>
                      {ticket.priority}
                    </div>
                  </div>
                  <div className={styles.ticketMeta}>
                    {getStatusIcon(ticket.status)}
                    <span className={styles.timeAgo}>
                      {formatTimeAgo(ticket.updatedAt || ticket.createdAt)}
                    </span>
                  </div>
                </div>

                <h4 className={styles.ticketSubject}>{ticket.subject || 'No Subject'}</h4>

                <div className={styles.ticketUser}>
                  <span className={styles.userAvatar}>{ticket.user?.avatar || '👤'}</span>
                  <div>
                    <div className={styles.userName}>{ticket.user?.name || 'Unknown User'}</div>
                    <div className={styles.userEmail}>{ticket.user?.email || 'No Email'}</div>
                  </div>
                </div>

                <div className={styles.ticketFooter}>
                  <div className={styles.tags}>
                    {(ticket.tags || []).map((tag) => (
                      <span key={tag} className={styles.tag}>
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

                <div className={styles.ticketActions}>
                  <button
                    onClick={() => handleViewDetails(ticket)}
                    className={styles.viewBtn}
                    type="button"
                    aria-label={`View details for ticket ${ticket.id}`}
                  >
                    <FaEye aria-hidden="true" /> View
                  </button>
                  <button
                    onClick={() => handleReplyClick(ticket)}
                    className={styles.replyBtn}
                    type="button"
                    aria-label={`Reply to ticket ${ticket.id}`}
                  >
                    <FaReply aria-hidden="true" /> Reply
                  </button>
                  {ticket.status !== 'resolved' && (
                    <button
                      onClick={() => handleCloseTicket(ticket)}
                      className={styles.closeBtn}
                      type="button"
                      aria-label={`Close ticket ${ticket.id}`}
                    >
                      <FaCheckCircle aria-hidden="true" /> Close
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {tickets.length > 6 && (
          <div className={styles.viewAllContainer}>
            <button
              onClick={() => setActiveView('dashboard')}
              className={styles.viewAllBtn}
              type="button"
              aria-label={`View all ${tickets.length} support tickets`}
            >
              View All {tickets.length} Tickets
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderAgents = () => (
    <div className={styles.agentsView}>
      <div className={styles.header}>
        <h2>Agent Management</h2>
        <button
          className={styles.addAgentBtn}
          type="button"
          aria-label="Add new support agent"
        >
          <FaUserPlus aria-hidden="true" /> Add Agent
        </button>
      </div>

      <div className={styles.agentsGrid}>
        {agents.map((agent) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.agentCard}
          >
            <div className={styles.agentHeader}>
              <div className={styles.agentInfo}>
                <span className={styles.agentAvatar}>{agent.avatar}</span>
                <div>
                  <h3>{agent.name}</h3>
                  <p>{agent.email}</p>
                </div>
              </div>
              <div className={`${styles.agentStatus} ${styles[agent.status]}`}>
                {agent.status}
              </div>
            </div>

            <div className={styles.agentStats}>
              <div className={styles.agentStat}>
                <span className={styles.statLabel}>Active Tickets</span>
                <span className={styles.statValue}>{agent.activeTickets}</span>
              </div>
              <div className={styles.agentStat}>
                <span className={styles.statLabel}>Total Handled</span>
                <span className={styles.statValue}>{agent.totalHandled}</span>
              </div>
              <div className={styles.agentStat}>
                <span className={styles.statLabel}>Avg Response</span>
                <span className={styles.statValue}>{agent.avgResponseTime}</span>
              </div>
              <div className={styles.agentStat}>
                <span className={styles.statLabel}>Satisfaction</span>
                <span className={styles.statValue}>{agent.satisfaction}</span>
              </div>
            </div>

            <div className={styles.agentSpecialties}>
              <h4>Specialties</h4>
              <div className={styles.specialtiesList}>
                {agent.specialties.map((specialty) => (
                  <span key={specialty} className={styles.specialty}>
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.agentActions}>
              <button
                className={styles.viewBtn}
                type="button"
                aria-label={`View details for agent ${agent.name}`}
              >
                <FaEye aria-hidden="true" /> View Details
              </button>
              <button
                className={styles.messageBtn}
                type="button"
                aria-label={`Send message to ${agent.name}`}
              >
                <FaReply aria-hidden="true" /> Message
              </button>
              <button
                className={styles.editBtn}
                type="button"
                aria-label={`Edit agent ${agent.name}`}
              >
                <FaCog aria-hidden="true" /> Edit
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className={styles.analyticsView}>
      <div className={styles.header}>
        <h2>Support Analytics</h2>
        <div className={styles.dateFilter}>
          <FaCalendarAlt aria-hidden="true" />
          <label htmlFor="analytics-date-range" className="sr-only">Select date range</label>
          <select id="analytics-date-range" aria-label="Select date range for analytics">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last year</option>
          </select>
        </div>
      </div>

      <div className={styles.analyticsGrid}>
        <div className={styles.chartCard}>
          <h3>Ticket Volume Trend</h3>
          <div className={styles.chartPlaceholder}>
            <FaTrendingUp className={styles.chartIcon} />
            <p>Interactive chart showing ticket volume over time</p>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>Response Time Analysis</h3>
          <div className={styles.chartPlaceholder}>
            <FaClock className={styles.chartIcon} />
            <p>Average response time by category and priority</p>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>Agent Performance</h3>
          <div className={styles.chartPlaceholder}>
            <FaUsers className={styles.chartIcon} />
            <p>Individual agent metrics and comparisons</p>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>Customer Satisfaction</h3>
          <div className={styles.chartPlaceholder}>
            <FaCheckCircle className={styles.chartIcon} />
            <p>Satisfaction scores and feedback trends</p>
          </div>
        </div>
      </div>

      <div className={styles.detailedStats}>
        <h3>Detailed Statistics</h3>
        <div className={styles.statsTable}>
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Today</th>
                <th>This Week</th>
                <th>This Month</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>New Tickets</td>
                <td>{systemStats.ticketsToday}</td>
                <td>142</td>
                <td>623</td>
                <td className={styles.trendUp}>↑ 8%</td>
              </tr>
              <tr>
                <td>Resolved Tickets</td>
                <td>{systemStats.resolvedToday}</td>
                <td>138</td>
                <td>587</td>
                <td className={styles.trendUp}>↑ 12%</td>
              </tr>
              <tr>
                <td>Urgent Tickets</td>
                <td>{systemStats.urgentTickets}</td>
                <td>18</td>
                <td>67</td>
                <td className={styles.trendDown}>↓ 3%</td>
              </tr>
              <tr>
                <td>Avg Response Time</td>
                <td>2.1h</td>
                <td>2.3h</td>
                <td>2.5h</td>
                <td className={styles.trendUp}>↑ 15%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className={styles.notificationsView}>
      <div className={styles.header}>
        <h2>Notifications</h2>
        <button
          onClick={markAllNotificationsRead}
          className={styles.markReadBtn}
          type="button"
          aria-label="Mark all notifications as read"
        >
          Mark All Read
        </button>
      </div>

      <div className={styles.notificationsList}>
        {notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <FaBell className={styles.emptyIcon} />
            <h3>No notifications</h3>
            <p>You&apos;re all caught up!</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
              onClick={() => handleNotificationClick(notification.id)}
            >
              <div className={styles.notificationIcon}>
                {notification.type === 'urgent_ticket' && <FaExclamationTriangle />}
                {notification.type === 'agent_offline' && <FaUsers />}
                {notification.type === 'high_priority' && <FaBell />}
              </div>
              <div className={styles.notificationContent}>
                <p>{notification.message}</p>
                <span className={styles.notificationTime}>
                  {notification.timestamp.toLocaleTimeString()}
                </span>
              </div>
              {!notification.read && (
                <div className={styles.notificationDot} />
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className={styles.settingsView}>
      <div className={styles.header}>
        <h2>Support Settings</h2>
      </div>

      <div className={styles.settingsGrid}>
        <div className={styles.settingCard}>
          <h3>AI Assistant Configuration</h3>
          <div className={styles.settingOptions}>
            <label>
              <input type="checkbox" defaultChecked />
              Enable AI auto-responses
            </label>
            <label>
              <input type="checkbox" defaultChecked />
              Auto-escalate complex issues
            </label>
            <label>
              Response confidence threshold:
              <input type="range" min="0" max="100" defaultValue="75" />
            </label>
          </div>
        </div>

        <div className={styles.settingCard}>
          <h3>Ticket Settings</h3>
          <div className={styles.settingOptions}>
            <label>
              Auto-assignment:
              <select>
                <option>By category</option>
                <option>By workload</option>
                <option>Round robin</option>
                <option>Manual</option>
              </select>
            </label>
            <label>
              Default priority:
              <select>
                <option>Low</option>
                <option>Normal</option>
                <option>High</option>
              </select>
            </label>
            <label>
              Auto-close inactive tickets after:
              <input type="number" defaultValue="7" /> days
            </label>
          </div>
        </div>

        <div className={styles.settingCard}>
          <h3>Notification Settings</h3>
          <div className={styles.settingOptions}>
            <label>
              <input type="checkbox" defaultChecked />
              Email notifications for urgent tickets
            </label>
            <label>
              <input type="checkbox" defaultChecked />
              Push notifications for agents
            </label>
            <label>
              <input type="checkbox" />
              Daily summary reports
            </label>
          </div>
        </div>

        <div className={styles.settingCard}>
          <h3>Performance Monitoring</h3>
          <div className={styles.settingOptions}>
            <label>
              <input type="checkbox" defaultChecked />
              Track response times
            </label>
            <label>
              <input type="checkbox" defaultChecked />
              Customer satisfaction surveys
            </label>
            <label>
              <input type="checkbox" defaultChecked />
              Agent performance metrics
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.adminSupport}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <FaHeadset className={styles.logoIcon} />
          <h2>Support Admin</h2>
        </div>

        <nav className={styles.sidebarNav} aria-label="Support admin navigation">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                type="button"
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={styles.navIcon} aria-hidden="true" />
                <span>{item.label}</span>
                {item.id === 'notifications' && unreadNotifications > 0 && (
                  <span className={styles.notificationBadge} aria-label={`${unreadNotifications} unread notifications`}>
                    {unreadNotifications}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <button
            className={styles.logoutBtn}
            type="button"
            aria-label="Logout from admin panel"
          >
            <FaSignOutAlt aria-hidden="true" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'agents' && renderAgents()}
        {activeView === 'analytics' && renderAnalytics()}
        {activeView === 'notifications' && renderNotifications()}
        {activeView === 'settings' && renderSettings()}
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {showReplyModal && selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => setShowReplyModal(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reply-modal-title"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={styles.replyModal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalHeader}>
                <h3 id="reply-modal-title">Reply to Ticket</h3>
                <button
                  onClick={() => setShowReplyModal(false)}
                  className={styles.closeModal}
                  type="button"
                  aria-label="Close dialog"
                >
                  <FaTimes aria-hidden="true" />
                </button>
              </div>

              <div className={styles.ticketInfo}>
                <div className={styles.ticketSummary}>
                  <div className={styles.ticketId}>
                    <FaTicketAlt /> {selectedTicket.id}
                  </div>
                  <div className={`${styles.priority} ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </div>
                  <div className={`${styles.status} ${styles[selectedTicket.status]}`}>
                    {selectedTicket.status.replace('_', ' ')}
                  </div>
                </div>
                <h4 className={styles.ticketSubject}>{selectedTicket.subject}</h4>
                <div className={styles.ticketUser}>
                  <span className={styles.userAvatar}>{selectedTicket.user?.avatar || '👤'}</span>
                  <div>
                    <div className={styles.userName}>{selectedTicket.user?.name || 'Unknown User'}</div>
                    <div className={styles.userEmail}>{selectedTicket.user?.email || 'No Email'}</div>
                  </div>
                </div>
              </div>

              <div className={styles.replyForm}>
                <label htmlFor="reply-message" className={styles.replyLabel}>
                  Your Reply
                </label>
                <textarea
                  id="reply-message"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your response here..."
                  className={styles.replyTextarea}
                  rows={6}
                  aria-label="Type your reply message"
                  aria-required="true"
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  onClick={() => setShowReplyModal(false)}
                  className={styles.cancelBtn}
                  type="button"
                  aria-label="Cancel and close dialog"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={!replyMessage.trim()}
                  className={styles.sendBtn}
                  type="button"
                  aria-label="Send reply to customer"
                >
                  <FaPaperPlane aria-hidden="true" /> Send Reply
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSupportManagement;
