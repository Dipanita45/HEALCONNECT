import { useState } from 'react';
import styles from './Monitoring.module.css';

export default function Monitoring() {
  const [data, setData] = useState({
    temperature: '',
    heartRate: '',
    bloodPressure: ''
  });

  const handleChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    alert('Health data recorded!');
    console.log(data);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Health Monitoring</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.formLabel}>Temperature (°C):</label>
        <input
          type="number"
          name="temperature"
          onChange={handleChange}
          required
          className={styles.input}
        />

        <label className={styles.formLabel}>Heart Rate (bpm):</label>
        <input
          type="number"
          name="heartRate"
          onChange={handleChange}
          required
          className={styles.input}
        />

        <label className={styles.formLabel}>Blood Pressure:</label>
        <input
          type="text"
          name="bloodPressure"
          onChange={handleChange}
          required
          className={styles.input}
        />

        <button type="submit" className={styles.button}>Record</button>
      </form>
    </div>
  );
}
