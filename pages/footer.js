import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaGithubAlt, FaHeartbeat, FaRegHospital, FaHeart } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';
import styles from './footer.module.css';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
                  <span className={styles.linkIcon}></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className={styles.footerLink}>
                  <span className={styles.linkIcon}></span>
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/open-source" className={styles.footerLink}>
                  <span className={styles.linkIcon}></span>
                  Open Source
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
                  <span className={styles.linkIcon}></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className={styles.footerLink}>
                  <span className={styles.linkIcon}></span>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/contact" className={styles.footerLink}>
                  <span className={styles.linkIcon}></span>
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