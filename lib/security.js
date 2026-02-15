// Security configuration for HEALCONNECT
export const SECURITY_CONFIG = {
  // Password requirements
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
    SPECIAL_CHARS: '@$!%*?&',
    BCRYPT_ROUNDS: 12
  },

  // Rate limiting
  RATE_LIMITS: {
    GENERAL: {
      POINTS: 10, // requests
      DURATION: 1 // second
    },
    AUTH: {
      POINTS: 5, // requests
      DURATION: 60 // seconds (1 minute)
    },
    SIGNUP: {
      POINTS: 3, // attempts
      DURATION: 900 // seconds (15 minutes)
    }
  },

  // Account security
  ACCOUNT: {
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes in milliseconds
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
    REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000 // 30 days
  },

  // Input validation
  VALIDATION: {
    USERNAME: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 50,
      PATTERN: /^[a-zA-Z0-9_]+$/
    },
    EMAIL: {
      MAX_LENGTH: 254,
      PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    PHONE: {
      PATTERN: /^[0-9+\s-]{10,15}$/
    },
    NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 100,
      PATTERN: /^[a-zA-Z\s'-]+$/
    }
  },

  // Security headers
  HEADERS: {
    CONTENT_SECURITY_POLICY: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com;",
    X_FRAME_OPTIONS: 'DENY',
    X_CONTENT_TYPE_OPTIONS: 'nosniff',
    X_XSS_PROTECTION: '1; mode=block',
    REFERRER_POLICY: 'strict-origin-when-cross-origin',
    PERMISSIONS_POLICY: 'geolocation=(), microphone=(), camera=()'
  },

  // CORS settings
  CORS: {
    ORIGINS: process.env.NODE_ENV === 'production'
      ? ['https://yourdomain.com'] // Replace with your actual domain
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With'],
    CREDENTIALS: true,
    MAX_AGE: 86400 // 24 hours
  }
};

// Admin codes (in production, these should be stored securely)
export const ADMIN_CODES = {
  DEFAULT: 'HEALCONNECT2024',
  // Add more admin codes as needed
};

// Environment validation
export const validateEnvironment = () => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
    'JWT_SECRET'
  ];

  const missing = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing required environment variables for production');
    }
  }

  // Validate JWT secret strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️ JWT_SECRET is too short. Use at least 32 characters for security.');
  }
};