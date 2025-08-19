import styles from './Contact.module.css';

export default function Contact() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Contact Us</h2>
      <p className={styles.detail}>Email: support@healconnect.com</p>
      <p className={styles.detail}>Phone: +91 12345 67890</p>
    </div>
  );
}
