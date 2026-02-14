import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaHeadset, FaTicketAlt, FaChartLine, FaUsers, FaClock, FaCheckCircle,
  FaRobot, FaPhone, FaEnvelope, FaComments
} from 'react-icons/fa';
import SupportWidget from '../components/Support/SupportWidget';
import SupportDashboard from '../components/Support/SupportDashboard';
import styles from './support.module.css';
import { useTheme } from '@/context/ThemeContext';

const Support = () => {
  const [view, setView] = useState('landing');
  const [stats, setStats] = useState({
    totalTickets: 0,
    avgResponseTime: '2.5 hours',
    satisfactionRate: '94%',
    activeAgents: 0
  });

  const { setIsMinimized, setSupportWidgetOpen } = useTheme();

  useEffect(() => {
    // Mock stats - in production, fetch from your backend
    setStats({
      totalTickets: 1247,
      avgResponseTime: '2.5 hours',
      satisfactionRate: '94%',
      activeAgents: 8
    });
  }, []);

  const handleSendEmail = () => {
  const email = 'support@healconnect.com';
  const subject = encodeURIComponent('HealConnect Support Request');
  const body = encodeURIComponent(
    'Hi HealConnect Support Team,\n\nI need help with the following issue:\n\n'
  );

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;

  window.open(gmailUrl, '_blank');
};
//2//'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'

  const features = [
    {
      icon: FaRobot,
      title: 'AI-Powered Support',
      description: 'Get instant answers to common questions with our intelligent AI assistant.',
      color: '#667eea',
      image: '/support_images/support_images/istockphoto.webp'
    },
    {
      icon: FaTicketAlt,
      title: 'Ticket Management',
      description: 'Track and manage support tickets with priority levels and status updates.',
      color: '#22c55e',
      image: '/support_images/support_images/images.jpg'
    },
    {
      icon: FaClock,
      title: '24/7 Availability',
      description: 'Round-the-clock support for urgent medical and technical issues.',
      color: '#ef4444',
      image: '/support_images/support_images/best-support-ticket-system.png'   
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Start Chat',
      description: 'Click the support widget to start a conversation with our AI assistant.',
      icon: '💬'
    },
    {
      step: 2,
      title: 'Get Help',
      description: 'AI provides instant answers or suggests relevant solutions.',
      icon: '🤖'
    },
    {
      step: 3,
      title: 'Escalate if Needed',
      description: 'If your issue isn\'t resolved, create a support ticket for human assistance.',
      icon: '🎫'
    },
    {
      step: 4,
      title: 'Track Progress',
      description: 'Monitor your ticket status and get updates until resolution.',
      icon: '📊'
    }
  ];

  if (view === 'dashboard') {
    return <SupportDashboard />;
  }

  return (
    <div className={styles.supportPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.heroText}
          >
            <h1>HealConnect Support Center</h1>
            <p>
              Get help when you need it most. Our AI-powered support system provides instant answers
              and connects you with human experts for complex issues.
            </p>
            <div className={styles.heroActions}>
              <button
                onClick={() => setView('dashboard')}
                className={styles.dashboardBtn}
              >
                <FaChartLine /> Support Dashboard
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setIsMinimized(false)
                  setSupportWidgetOpen(true)
                }}
                className={styles.chatBtn}>
                <FaHeadset /> Start Live Chat
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={styles.heroStats}
          >
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.totalTickets.toLocaleString()}</div>
              <div className={styles.statLabel}>Tickets Resolved</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.avgResponseTime}</div>
              <div className={styles.statLabel}>Avg Response Time</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.satisfactionRate}</div>
              <div className={styles.statLabel}>Satisfaction Rate</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{stats.activeAgents}</div>
              <div className={styles.statLabel}>Active Agents</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.sectionHeader}
          >
            <h2>Why Choose Our Support System?</h2>
            <p>
              Experience healthcare support that&apos;s fast, intelligent, and always available when you need it.
            </p>
          </motion.div>

          <div className={styles.featuresGrid}>
            {features.map((feature, index) => {
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={styles.featureCard}
                >
                  <div className={styles.featureImage}>
                    <img src={feature.image} alt={feature.title} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.sectionHeader}
          >
            <h2>How It Works</h2>
            <p>
              Get the help you need in four simple steps, from AI assistance to human expert support.
            </p>
          </motion.div>

          <div className={styles.stepsContainer}>
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={styles.step}
              >
                <div className={styles.stepNumber}>
                  <span>{step.step}</span>
                </div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {index < howItWorks.length - 1 && (
                  <div className={styles.stepConnector} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className={styles.channels}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.sectionHeader}
          >
            <h2>Multiple Support Channels</h2>
            <p>
              Choose the support method that works best for your needs and urgency level.
            </p>
          </motion.div>

          <div className={styles.channelsGrid}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={styles.channelCard}
            >
              <div className={styles.channelIcon}>
                <FaRobot className={styles.aiIcon} />
              </div>
              <div className={styles.badgeNew} style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                AI Assistant
              </div>
              <h3>AI Assistant</h3>
              <p>Instant answers to questions 24/7</p>
              <div className={styles.channelFeatures}>
                <span>✓ Available 24/7</span>
                <span>✓ Instant responses</span>
                <span>✓ Free to use</span>
              </div>
              <button className={styles.channelBtn}>Start Chat</button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={styles.channelCard}
            >
              <div className={styles.channelIcon}><FaTicketAlt style={{ fontSize: '48px', color: '#22c55e' }} /></div>
              <div className={styles.badgeNew} style={{background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)'}}>
                Support Tickets
              </div>
              <h3>Support Tickets</h3>
              <p>Detailed assistance for complex issues</p>
              <div className={styles.channelFeatures}>
                <span>✓ Track progress</span>
                <span>✓ Priority handling</span>
                <span>✓ Email updates</span>
              </div>
              <button className={styles.channelBtn}>Create Ticket</button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={styles.channelCard}
            >
              <div className={styles.channelIcon}><FaPhone style={{ fontSize: '48px', color: '#f59e0b' }} /></div>
              <div className={styles.badgeNew} style={{background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)'}}>
                Phone Support
              </div>
              <h3>Phone Support</h3>
              <p>Speak directly with our support team</p>
              <div className={styles.channelFeatures}>
                <span>✓ Personal assistance</span>
                <span>✓ Complex issues</span>
                <span>✓ Emergency support</span>
              </div>
              <button className={styles.channelBtn}>Call Now</button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className={`${styles.channelCard} ${styles.liveAgentCard}`}
            >
              <div className={styles.channelIcon}>
                <FaUsers className={styles.liveIcon} />
              </div>
              <div className={styles.badgeNew} style={{background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'}}>
                Live Agent Support
              </div>
              <h3>Live Agent Support</h3>
              <p>Real-time chat with our support agents</p>
              <div className={styles.channelFeatures}>
                <span>✓ Instant connection</span>
                <span>✓ Expert guidance</span>
                <span>✓ Videos & screen sharing</span>
              </div>
              <button className={`${styles.channelBtn} ${styles.liveAgentBtn}`}>Connect Now</button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className={styles.channelCard}
            >
              <div className={styles.channelIcon}><FaEnvelope style={{ fontSize: '48px', color: '#ef4444' }} /></div>
              <div className={styles.badgeNew} style={{background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'}}>
                Email Support
              </div>
              <h3>Email Support</h3>
              <p>Detailed written assistance</p>
              <div className={styles.channelFeatures}>
                <span>✓ Detailed responses</span>
                <span>✓ Documentation</span>
                <span>✓ 24h response</span>
              </div>
              <button
                className={styles.channelBtn}
                onClick={handleSendEmail}
              >
                Send Email
              </button>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className={styles.emergency}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={styles.emergencyCard}
          >
            <div className={styles.emergencyIcon}>🚨</div>
            <h2>Medical Emergency?</h2>
            <p>
              For life-threatening emergencies, call 911 immediately or visit the nearest emergency room.
              Our support system is not designed for medical emergencies.
            </p>
            <button className={styles.emergencyBtn}>
              Call 911 Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* Support Widget */}
      <SupportWidget />
    </div>
  );
};

export default Support;
