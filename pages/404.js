import Link from 'next/link';
import Head from 'next/head';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | HEALCONNECT</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Head>
      
      <div style={styles.container}>
        <div style={styles.content}>
          <h1 style={styles.title}>404</h1>
          <h2 style={styles.subtitle}>Page Not Found</h2>
          <p style={styles.message}>
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <p style={styles.instructions}>
            Please check the URL or use the navigation below.
          </p>
          
          <div style={styles.buttonContainer}>
            <Link href="/" style={styles.homeButton}>
              Home
            </Link>
            <Link href="/login" style={styles.secondaryButton}>
              Login
            </Link>
            <Link href="/appointments" style={styles.secondaryButton}>
              Appointments
            </Link>
            <Link href="/contact" style={styles.secondaryButton}>
              Contact
            </Link>
          </div>
          
          <div style={styles.links}>
            <Link href="/about" style={styles.link}>About</Link>
            <span style={styles.separator}>•</span>
            <Link href="/faq" style={styles.link}>FAQ</Link>
            <span style={styles.separator}>•</span>
            <Link href="/monitoring" style={styles.link}>Monitoring</Link>
            <span style={styles.separator}>•</span>
            <Link href="/prescriptions" style={styles.link}>Prescriptions</Link>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem',
    backgroundColor: '#f8f9fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  content: {
    textAlign: 'center',
    maxWidth: '600px',
    padding: '3rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '6rem',
    fontWeight: '800',
    margin: '0',
    color: '#2d3748',
    lineHeight: '1',
  },
  subtitle: {
    fontSize: '2rem',
    fontWeight: '600',
    margin: '0.5rem 0 1.5rem',
    color: '#4a5568',
  },
  message: {
    fontSize: '1.125rem',
    color: '#718096',
    margin: '1rem 0',
    lineHeight: '1.6',
  },
  instructions: {
    fontSize: '1rem',
    color: '#a0aec0',
    marginBottom: '2.5rem',
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    margin: '2rem 0',
    flexWrap: 'wrap',
  },
  homeButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#4299e1',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'background-color 0.2s',
    display: 'inline-block',
  },
  secondaryButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#e2e8f0',
    color: '#4a5568',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'background-color 0.2s',
    display: 'inline-block',
  },
  links: {
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e2e8f0',
  },
  link: {
    color: '#4299e1',
    textDecoration: 'none',
    fontSize: '0.9rem',
    margin: '0 0.5rem',
  },
  separator: {
    color: '#cbd5e0',
    margin: '0 0.5rem',
  },
};