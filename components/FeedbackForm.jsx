import React, { useState } from "react";
import styles from "./FeedbackForm.module.css";

export default function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !feedback.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    alert(`Thank you, ${name}! 💙\nYour feedback has been submitted successfully.`);

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
    </section>
  );
}
