import React, { useState } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FAQ.module.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is HEALCONNECT?",
      answer: "HEALCONNECT is a digital healthcare platform that connects patients with doctors for seamless appointment booking, prescription management, and remote health monitoring."
    },
    {
      question: "How do I book an appointment?",
      answer: "Navigate to the 'Appointments' section, select your preferred doctor, choose an available time slot, and confirm your booking."
    },
    {
      question: "Can I access my prescriptions online?",
      answer: "Yes! All your prescriptions are stored securely in the 'Prescriptions' section after your doctor issues them."
    },
    {
      question: "Is my health data secure?",
      answer: "Absolutely. We use end-to-end encryption and comply with HIPAA/GDPR standards to protect your sensitive health information."
    },
    {
      question: "How does remote monitoring work?",
      answer: "Connect your wearable devices or manually input vitals in the 'Monitoring' section. Your doctor can view this data in real-time during consultations."
    },
    {
      question: "What if I need emergency help?",
      answer: "HEALCONNECT is not for emergencies. In critical situations, please contact local emergency services immediately."
    },
    {
      question: "Can I share reports with multiple doctors?",
      answer: "Yes, you can securely share medical reports with any doctor in your network via the 'Share' option in your dashboard."
    },
    {
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page and follow the instructions sent to your registered email."
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>HEALCONNECT - FAQs</title>
        <meta name="description" content="Frequently asked questions about HEALCONNECT" />
      </Head>

  {/* Animated background elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.circleElement}></div>
        <div className={styles.circleElement}></div>
        <div className={styles.circleElement}></div>
      </div>

{/* Navbar spacer */}
      <div className={styles.navbarSpacer}></div>

      <motion.div 
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.header 
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className={styles.title}>
            Frequently Asked <span className={styles.titleAccent}>Questions</span>
          </h1>
          <p className={styles.subtitle}>
            Find answers to common questions about our platform
          </p>
          <div className={styles.titleUnderline}></div>
        </motion.header>

        <motion.div 
          className={styles.faqContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              className={styles.faqItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -3 }}
            >
              <button 
                className={styles.faqQuestion}
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
              >
                <span className={styles.questionText}>
                  <span className={styles.questionNumber}>Q{index + 1}.</span>
                  {faq.question}
                </span>
                <motion.span 
                  className={styles.chevron}
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.span>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div 
                    className={styles.faqAnswer}
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    style={{ transformOrigin: 'top' }}
                  >
                    <div className={styles.answerContent}>
                      <span className={styles.answerIcon}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <p>{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className={styles.helpSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className={styles.helpContent}>
            <div className={styles.helpIcon}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14M12 12H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={styles.helpTitle}>Still have questions?</h3>
            <p className={styles.helpText}>Contact our support team for personalized assistance</p>
            <motion.button 
              className={styles.helpButton}
              onClick={() => window.location.href = '/contact'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Support
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FAQ;
