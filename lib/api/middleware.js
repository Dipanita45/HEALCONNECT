
import Joi from 'joi';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import admin from '../firebaseAdmin';

// Rate Limiter Configuration
const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 1, // per 1 second by IP
});

/**
 * Middleware to handle errors globally.
 */
export function withErrorHandling(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('API Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error',
      });
    }
  };
}

/**
 * Middleware to restrict allowed HTTP methods.
 */
export function withMethods(allowedMethods, handler) {
  return async (req, res) => {
    if (!allowedMethods.includes(req.method)) {
      res.status(405).json({
        success: false,
        message: `Method ${req.method} not allowed`,
      });
      return;
    }
    await handler(req, res);
  };
}

/**
 * Middleware to validate request body or query against a Joi schema.
 * @param {Joi.Schema} schema - The Joi schema to validate against.
 * @param {string} source - 'body' or 'query' (default: 'body').
 */
export function validate(schema, source = 'body') {
  return (handler) => async (req, res) => {
    try {
      const dataToValidate = source === 'query' ? req.query : req.body;
      const { error, value } = schema.validate(dataToValidate, { abortEarly: false });

      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          details: error.details.map((d) => d.message),
        });
      }

      // Replace req[source] with validated value (sanitized)
      req[source] = value;
      return handler(req, res);
    } catch (err) {
      console.error('Validation Middleware Error:', err);
      return res.status(500).json({ success: false, message: 'Internal Validation Error' });
    }
  };
}

/**
 * Middleware to verify Firebase Auth Token.
 * Populates req.user with decoded token.
 */
export function withAuth(handler) {
  return async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      // Skip verification if strictly testing without credentials, but in prod essential
      // For development convenience, we might want a bypass if env is not set
      if (!process.env.FIREBASE_PROJECT_ID && process.env.NODE_ENV !== 'production') {
        console.warn('⚠️ Skipping Auth Verification due to missing credentials in DEV');
        req.user = { uid: 'dev-user', email: 'dev@example.com' };
        return handler(req, res);
      }

      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      return handler(req, res);
    } catch (error) {
      console.error('Auth verification failed:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }
  };
}

/**
 * Middleware for Rate Limiting.
 */
export function rateLimit(handler) {
  return async (req, res) => {
    try {
      await rateLimiter.consume(req.socket.remoteAddress || 'unknown-ip');
      return handler(req, res);
    } catch (rej) {
      return res.status(429).json({
        success: false,
        message: 'Too Many Requests',
      });
    }
  };
}

/**
 * Utility to compose multiple middlewares.
 * Executes from right to left (standard functional composition),
 * BUT our middleware signatures are `(handler) => (req, res) => ...`
 * So `compose(auth, validate)(handler)` -> `auth(validate(handler))`
 */
export function compose(...middlewares) {
  return (handler) => {
    return middlewares.reduceRight((acc, middleware) => {
      return middleware(acc);
    }, handler);
  };
}
