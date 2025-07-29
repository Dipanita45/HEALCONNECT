import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  const isActive = (pathname) => router.pathname === pathname;

  return (
    <nav style={{ display: 'flex', alignItems: 'center', padding: '1rem', background: '#203394', color: 'white' }}>
      <h2 style={{ marginRight: '2rem', fontWeight: 'bold' }}>HEALCONNECT</h2>
      <Link href="/" style={{ marginRight: 20, color: isActive('/') ? '#ffd700' : 'white' }}>Home</Link>
      <Link href="/prescriptions" style={{ marginRight: 20, color: isActive('/prescriptions') ? '#ffd700' : 'white' }}>Prescriptions</Link>
      <Link href="/appointments" style={{ marginRight: 20, color: isActive('/appointments') ? '#ffd700' : 'white' }}>Appointments</Link>
      <Link href="/monitoring" style={{ marginRight: 20, color: isActive('/monitoring') ? '#ffd700' : 'white' }}>Monitoring</Link>
      <Link href="/contact" style={{ marginRight: 20, color: isActive('/contact') ? '#ffd700' : 'white' }}>Contact</Link>
      <Link href="/login" style={{ marginLeft: 'auto', color: isActive('/login') ? '#ffd700' : 'white' }}>Login</Link>
    </nav>
  );
}
