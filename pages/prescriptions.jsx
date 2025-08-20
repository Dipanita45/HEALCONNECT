'use client'
import { useState } from 'react'
import { useTheme } from '@/context/ThemeContext'
import styles from './Prescriptions.module.css'

export default function Prescriptions() {
  const [formData, setFormData] = useState({
    medicine: '',
    dosage: '',
    notes: ''
  });
  const { theme } = useTheme();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    alert('Prescription submitted!');
    console.log(formData);
  };

  return (
    <div className={`${styles.container} ${theme === 'dark' ? styles.dark : ''}`}>
      <h2 className={styles.title}>Prescription Form</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.formLabel}>Medicine Name:</label>
        <input
          type="text"
          name="medicine"
          onChange={handleChange}
          required
          className={`${styles.input} ${theme === 'dark' ? styles.darkInput : ''}`}
        />

        <label className={styles.formLabel}>Dosage:</label>
        <input
          type="text"
          name="dosage"
          onChange={handleChange}
          required
          className={`${styles.input} ${theme === 'dark' ? styles.darkInput : ''}`}
        />

        <label className={styles.formLabel}>Additional Notes:</label>
        <textarea
          name="notes"
          onChange={handleChange}
          className={`${styles.textarea} ${theme === 'dark' ? styles.darkTextarea : ''}`}
        />

        <button type="submit" className={styles.button}>Submit</button>
      </form>
    </div>
  );
}