/**
 * Secure Logger Utility
 * 
 * Environment-aware logging that prevents sensitive data exposure in production.
 * 
 * Usage:
 *   import logger from '@lib/logger';
 *   logger.log('Debug message', data);
 *   logger.error('Error occurred', error);
 * 
 * Behavior:
 *   - Development: Logs everything to console with colors
 *   - Production: Suppresses all logs (no-op)
 */

const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * No-op function for production mode
 */
const noop = () => { };

/**
 * Logger object with environment-aware methods
 */
const logger = {
    /**
     * Standard log output (development only)
     */
    log: isDevelopment
        ? (...args) => console.log('🔍', ...args)
        : noop,

    /**
     * Error logging (development only)
     */
    error: isDevelopment
        ? (...args) => console.error('❌', ...args)
        : noop,

    /**
     * Warning logging (development only)
     */
    warn: isDevelopment
        ? (...args) => console.warn('⚠️', ...args)
        : noop,

    /**
     * Info logging (development only)
     */
    info: isDevelopment
        ? (...args) => console.info('ℹ️', ...args)
        : noop,

    /**
     * Debug logging (development only)
     */
    debug: isDevelopment
        ? (...args) => console.debug('🐛', ...args)
        : noop,

    /**
     * Check if logging is enabled
     */
    isEnabled: () => isDevelopment,
};

export default logger;
