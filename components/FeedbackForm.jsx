import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./FeedbackForm.module.css";

export default function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !feedback.trim()) {
  setErrorMessage("Please fill in all required fields.");
  setShowError(true);
  setTimeout(() => setShowError(false), 3000); 
  return;
}

    setSubmittedName(name);
    setShowSuccess(true);

    setName("");
    setEmail("");
    setFeedback("");
  };

  return (
    <section className={styles.feedbackSection}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Feedback</h2>
        <p className={styles.subheading}>
          We’d love to hear your thoughts and suggestions
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.input}
            placeholder="Your full name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            className={styles.input}
            placeholder="Your email address (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <textarea
            className={styles.textarea}
            placeholder="Write your feedback here *"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />

          <button type="submit" className={styles.button}>
            Submit Feedback
          </button>
        </form>
      </div>

     
        {/* Error Toast */}
        <AnimatePresence>
          {showError && (
            <motion.div 
              className={styles.errorToast}
              initial={{ opacity: 0, y: -100, x: "-50%" }} 
              animate={{ opacity: 1, y: 0, x: "-50%" }}   
              exit={{ opacity: 0, y: -100, x: "-50%" }}  
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
               <span className={styles.errorIcon}>⚠️</span>
               {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>
      {/* Stylized Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <div className={styles.modalOverlay}>
            <motion.div 
              className={styles.successModal}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
            >
              <div className={styles.successIcon}>
                <svg viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="25" fill="none" />
                  <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
              </div>
              <h3>Thank you, {submittedName}! 💙</h3>
              <p>Your feedback has been submitted successfully.</p>
              <button 
                className={styles.closeButton} 
                onClick={() => setShowSuccess(false)}
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    
    </section>
  );
}
