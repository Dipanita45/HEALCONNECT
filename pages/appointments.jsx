import { useState } from 'react';
import styles from './Appointments.module.css';

export default function Appointments() {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    doctor: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    alert('Appointment booked!');
    console.log(formData);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Book Appointment</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.formLabel}>Patient Name:</label>
        <input
          type="text"
          name="name"
          onChange={handleChange}
          required
          className={styles.input}
        />

        <label className={styles.formLabel}>Date:</label>
        <input
          type="date"
          name="date"
          onChange={handleChange}
          required
          className={styles.input}
        />

        <label className={styles.formLabel}>Doctor's Name:</label>
        <input
          type="text"
          name="doctor"
          onChange={handleChange}
          required
          className={styles.input}
        />

        <button type="submit" className={styles.button}>Book</button>
      </form>
    </div>
  );
}
