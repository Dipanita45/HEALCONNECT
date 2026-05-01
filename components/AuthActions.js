'use client'
import React from 'react'
import styles from './navbar.module.css'

export default function AuthActions({ 
  isMobile = false, 
  isLoaded, 
  user, 
  isLoggingOut, 
  handleDashboardRedirect, 
  handleLogout, 
  handleLoginRedirect 
}) {
  if (!isLoaded) return null;

  if (isMobile) {
    return (
      <div className={styles.mobileAuthSection}>
        {user ? (
          <>
            <button
              onClick={handleDashboardRedirect}
              className={`${styles.mobileAuthButton} ${styles.mobileAuthButtonPrimary}`}
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`${styles.mobileAuthButton} ${styles.mobileAuthButtonDanger} disabled:opacity-50`}
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </>
        ) : (
          <button
            onClick={handleLoginRedirect}
            className={`${styles.mobileAuthButton} ${styles.mobileAuthButtonPrimary}`}
          >
            Login
          </button>
        )}
      </div>
    );
  }

  // Desktop View
  return (
    <div className="flex items-center gap-2 lg:gap-3">
      {user ? (
        <>
          <button
            onClick={handleDashboardRedirect}
            className={`${styles.loginButton} bg-green-600 hover:bg-green-700`}
          >
            <span>Dashboard</span>
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`${styles.loginButton} bg-red-600 hover:bg-red-700 disabled:opacity-50 flex items-center gap-2`}
          >
            {isLoggingOut && (
              <div 
                className={styles.spinner} 
                style={{ 
                  width: '14px', 
                  height: '14px', 
                  border: '2px solid transparent', 
                  borderTop: '2px solid white', 
                  borderRadius: '50%' 
                }} 
              />
            )}
            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </>
      ) : (
        <button
          onClick={handleLoginRedirect}
          className={styles.loginButton}
        >
          <span>Login</span>
          <div className={styles.buttonPulse}></div>
        </button>
      )}
    </div>
  );
}
