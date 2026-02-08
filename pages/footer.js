import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { 
  FaGithubAlt, 
  FaHeartbeat, 
  FaRegHospital, 
  FaHeart,
  FaInfoCircle,
  FaCog,
  FaCode,
  FaUsers,
  FaShieldAlt,
  FaFileContract,
  FaEnvelope,
  FaHeadset,
  FaDiscord,
  FaDownload
} from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';
import styles from './footer.module.css';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Check if PWA can be installed
    const checkInstallPrompt = () => {
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowInstallButton(true);
      };
      
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
    
    checkInstallPrompt();
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    try {
      const result = await deferredPrompt.prompt();
      if (result.outcome === 'accepted') {
        setShowInstallButton(false);
        setDeferredPrompt(null);
      }
    } catch (error) {
      console.error('Install error:', error);
    }
  };

  return (
    <footer className={styles.footer}>
      {/* Animated background elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.circleElement}></div>
        <div className={styles.circleElement}></div>
        <div className={styles.circleElement}></div>
      </div>
      
      <div className={styles.container}>
        <div className={`${styles.content} ${isVisible ? styles.visible : ''}`}>
          
          {/* Logo & Mission */}
          <div className={styles.section}>
            <div className={styles.logoSection}>
              <div className={styles.logo}>
                <div className={styles.logoIcon}>
                  <FaHeartbeat className={styles.logoHeart} />
                </div>
                <h2 className={styles.logoText}>HealConnect</h2>
              </div>
              <p className={styles.missionText}>
                Bridging healthcare and technology to deliver smarter, faster, and secure patient solutions.
              </p>
            </div>
          </div>

          {/* Explore */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Explore</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/about" className={styles.footerLink}>
                  <FaInfoCircle className={styles.linkIcon} />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className={styles.footerLink}>
                  <FaCog className={styles.linkIcon} />
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/open-source" className={styles.footerLink}>
                  <FaCode className={styles.linkIcon} />
                  Open Source
                </Link>
              </li>
              <li>
                <Link href="/open-source#contributors" className={styles.footerLink}>
                  <FaUsers className={styles.linkIcon} />
                  Contributors
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Support</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/privacy" className={styles.footerLink}>
                  <FaShieldAlt className={styles.linkIcon} />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className={styles.footerLink}>
                  <FaFileContract className={styles.linkIcon} />
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/contact" className={styles.footerLink}>
                  <FaHeadset className={styles.linkIcon} />
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Connect With Us</h4>
            <div className={styles.socialLinks}>
              <a
                href="https://github.com/Dipanita45/HEALCONNECT"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="GitHub"
              >
                <FaGithubAlt />
                <span className={styles.socialTooltip}>Visit our GitHub</span>
              </a>
              <a
                href="https://discord.gg/WbvxB2F4G"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Discord"
              >
                <FaDiscord />
                <span className={styles.socialTooltip}>Join our Discord</span>
              </a>
              {/* PWA Install Button */}
              {showInstallButton && (
                <button 
                  onClick={handleInstall} 
                  className={styles.pwaInstallButton}
                  aria-label="Install HEALCONNECT App"
                >
                  <FaDownload className={styles.installIcon} />
                  <span>Install App</span>
                </button>
              )}
            </div>
            <p className={styles.feedbackText}>
              Have feedback or ideas? Reach out — we had love to hear from you!
            </p>
            
            {/* Subscription form */}
            <div className={styles.subscription}>
              <p className={styles.subscriptionText}>Stay updated with our latest features</p>
              <form className={styles.subscriptionForm}>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className={styles.subscriptionInput}
                />
                <button type="submit" className={styles.subscriptionButton}>
                  <FaHeart />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className={styles.bottomFooter}>
          <div className={styles.copyright}>
            © {currentYear} HealConnect Inc. All rights reserved.
          </div>
          <div className={styles.madeWith}>
            Made with <span className={styles.heartPulse}><FaHeart /></span> for better healthcare
          </div>
        </div>
      </div>
    </footer>
  );
}