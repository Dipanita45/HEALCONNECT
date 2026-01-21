import Head from "next/head";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from './contact.module.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Integrate with backend or service if needed
  };

  return (
    <>
      <Head>
        <title>Contact | HealConnect</title>
        <meta name="description" content="Contact HealConnect for support, partnership, or to contribute to our healthcare mission." />
      </Head>
      
      <main className={styles.main}>
        {/* Animated background elements */}
        <div className={styles.backgroundElements}>
          <div className={styles.circleElement}></div>
          <div className={styles.circleElement}></div>
          <div className={styles.circleElement}></div>
        </div>

        {/* Add padding to account for fixed navbar */}
        <div className={styles.navbarSpacer}></div>

        <div className={styles.container}>
          <motion.header
            className={styles.header}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h1 className={styles.title}>
              Contact <span className={styles.titleAccent}>HealConnect Support</span>
            </h1>
            <p className={styles.subtitle}>
              Reach out for support, partnership, or to contribute to HealConnects mission.
            </p>
            <div className={styles.titleUnderline}></div>
          </motion.header>

          <div className={styles.content}>
            <motion.section
              className={styles.contactSection}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              <motion.div variants={fadeInUp} className={styles.contactCard}>
                <div className={styles.contactIcon}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className={styles.sectionTitle}>Get in Touch</h2>
                <div className={styles.contactInfo}>
                  <div className={styles.contactItem}>
                    <div className={styles.contactType}>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Email:
                    </div>
                    <a href="mailto:support@healconnect.com" className={styles.contactLink}>
                      support@healconnect.com
                    </a>
                  </div>
                  
                  <div className={styles.contactItem}>
                    <div className={styles.contactType}>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 16.92V19.92C22 20.52 21.49 21.03 20.88 21.05C20.28 21.06 19.5 21.07 18.83 21.07C10.57 21.07 3.92999 14.44 3.92999 6.18C3.92999 5.5 3.93999 4.72 3.94999 4.12C3.96999 3.51 4.47999 3 5.07999 3H8.07999C8.61999 3 9.07999 3.45 9.09999 3.99C9.11999 4.56 9.13999 5.13 9.15999 5.71C9.20999 6.24 8.93999 6.74 8.53999 7.04C7.94999 7.5 7.54999 8.16 7.52999 8.91C7.48999 9.93 7.49999 10.95 7.56999 11.97C7.64999 12.66 8.07999 13.27 8.69999 13.57C9.31999 13.87 10.01 13.92 10.66 13.83C11.4 13.73 12.13 13.62 12.86 13.5C13.5 13.39 14.1 13.71 14.44 14.23C15.07 15.19 15.84 16.04 16.73 16.74C17.26 17.13 17.59 17.75 17.48 18.4C17.36 19.13 17.24 19.86 17.12 20.59C17.03 21.23 17.36 21.83 17.83 22.26C18.19 22.59 18.59 22.88 19 23.12C19.54 23.44 20.17 23.12 20.45 22.59C20.74 22.06 21.03 21.53 21.32 21C21.6 20.48 21.56 19.87 21.16 19.42C20.86 19.08 20.55 18.75 20.24 18.43C19.59 17.76 18.94 17.09 18.27 16.44C17.83 16.02 17.2 15.82 16.61 15.97C15.93 16.14 15.25 16.3 14.56 16.44C14.49 16.45 14.42 16.47 14.35 16.48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Phone:
                    </div>
                    <a href="tel:+911234567890" className={styles.contactLink}>
                      +91 12345 67890
                    </a>
                  </div>
                  
                  <div className={styles.contactItem}>
                    <div className={styles.contactType}>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 19C9 19 3 16 3 9C3 5 5 3 9 3C10 3 11 3 12 4C13 3 14 3 15 3C19 3 21 5 21 9C21 16 15 19 15 19C15 19 13 21 12 21C11 21 9 19 9 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      GitHub:
                    </div>
                    <a 
                      href="https://github.com/Dipanita45/HEALCONNECT" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={styles.contactLink}
                    >
                      HEALCONNECT Repository
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.section>

            <motion.section
              className={styles.formSection}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              <motion.div variants={fadeInUp} className={styles.formCard}>
                <div className={styles.formHeader}>
                  <div className={styles.formIcon}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2 className={styles.sectionTitle}>Send Us a Message</h2>
                  <p className={styles.formSubtitle}>We will respond as quickly as possible</p>
                </div>

                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={styles.successMessage}
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h3>Message Sent Successfully!</h3>
                    <p>Thank you for reaching out! We will get back to you soon.</p>
                  </motion.div>
                ) : (
                  <motion.form 
                    onSubmit={handleSubmit} 
                    className={styles.form}
                    variants={fadeInUp}
                  >
                    <div className={styles.inputGroup}>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className={styles.formInput}
                      />
                      <label className={styles.formLabel}>Your Name</label>
                      <div className={styles.formUnderline}></div>
                    </div>
                    
                    <div className={styles.inputGroup}>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className={styles.formInput}
                      />
                      <label className={styles.formLabel}>Your Email</label>
                      <div className={styles.formUnderline}></div>
                    </div>
                    
                    <div className={styles.inputGroup}>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        className={styles.formTextarea}
                      />
                      <label className={styles.formLabel}>Your Message</label>
                      <div className={styles.formUnderline}></div>
                    </div>
                    
                    <motion.button 
                      type="submit" 
                      className={styles.submitButton}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Send Message
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.button>
                  </motion.form>
                )}
              </motion.div>
            </motion.section>

            <motion.section
              className={styles.infoSection}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
            >
              <motion.div variants={fadeInUp} className={styles.infoCard}>
                <h2 className={styles.sectionTitle}>Why Contact Us?</h2>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15 8H9V6C9 4.34 10.34 3 12 3C13.66 3 15 4.34 15 6V8Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h3>Technical Support</h3>
                    <p>Get help with any technical issues or questions about our platform.</p>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3>Quick Response</h3>
                    <p>We typically respond to all inquiries within 24 hours.</p>
                  </div>
                  
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3>Partnership Opportunities</h3>
                    <p>Interested in collaborating? We would love to hear your ideas.</p>
                  </div>
                </div>
              </motion.div>
            </motion.section>
          </div>
        </div>
      </main>
    </>
  );
}