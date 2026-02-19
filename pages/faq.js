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
      answer: "HEALCONNECT is a secure digital healthcare platform that helps patients find and consult doctors, schedule appointments, manage prescriptions, and optionally share remote monitoring data. It is designed to streamline routine care and provide continuity between in-person and virtual visits."
    },
    {
      question: "How do I create an account?",
      answer: "To create an account, go to the 'Sign Up' page, provide basic personal details (name, email, phone), verify your email address, and complete your profile. For clinicians, additional verification steps may be required before you can accept appointments."
    },
    {
      question: "How do I book an appointment?",
      answer: "Open the 'Appointments' page, choose a specialty or search for a doctor, review their available time slots, select a convenient slot, and confirm. You will receive an email and an in-app notification with the appointment details and any pre-visit instructions."
    },
    {
      question: "Can I access my prescriptions online?",
      answer: "Yes. After a consultation, prescriptions issued by your doctor are stored in the 'Prescriptions' section. You can view details, download a PDF, or share prescriptions with pharmacies and other providers as permitted by your settings."
    },
    {
      question: "Is my health data secure and private?",
      answer: "Protecting your data is a priority. We use encryption in transit and at rest, follow industry best practices, and aim to comply with relevant regulations (for example, HIPAA/GDPR where applicable). Access controls, audit logs, and permission settings let you control who can see your information. See our Privacy Policy for full details."
    },
    {
      question: "How does remote monitoring work and what devices are supported?",
      answer: "Remote monitoring lets you share vitals (e.g., heart rate, SpO2, blood pressure, glucose) either by connecting supported wearable/IoT devices or by manually entering readings in the 'Monitoring' section. Supported device models and integrations are listed in the Monitoring documentation; if your device isn't listed you can still enter data manually."
    },
    {
      question: "What if I need emergency help?",
      answer: "HEALCONNECT is not an emergency service. If you are experiencing a life‑threatening emergency, call your local emergency number immediately. Use HEALCONNECT for non-emergency care, follow-up, and chronic condition management."
    },
    {
      question: "Can I share reports with multiple doctors?",
      answer: "Yes. You can share medical reports, visit summaries, and monitoring data with other providers from your dashboard. Sharing is secure and auditable; you will see which providers have access and can revoke access at any time."
    },
    {
      question: "How long is my data retained and who can access it?",
      answer: "Retention policies depend on local regulations and our Privacy Policy. Generally, medical records are retained for a period required by law or until you request deletion where permitted. Access is restricted to you, the clinicians you authorize, and system administrators for maintenance and compliance—all access is logged."
    },
    {
      question: "How do I reset my password or recover my account?",
      answer: "Click 'Forgot Password' on the login page to receive a password reset email. If you lose access to your registered email or phone, contact Support via the 'Contact' page and provide identity verification details so we can assist with account recovery."
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
              key={faq.question}
              className={styles.faqItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: faqs.indexOf(faq) * 0.1 }}
              whileHover={{ y: -3 }}
            >
              <button
                id={`faq-question-${index}`}
                className={styles.faqQuestion}
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className={styles.questionText}>
                  <span className={styles.questionNumber}>Q{faqs.indexOf(faq) + 1}.</span>
                  {faq.question}
                </span>
                <motion.span
                  className={styles.chevron}
                  animate={{ rotate: activeIndex === faqs.indexOf(faq) ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.span>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
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
                          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14M12 12H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FAQ;
