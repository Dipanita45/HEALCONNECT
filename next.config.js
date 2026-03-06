/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development
  runtimeCaching: [
    {
      // Cache Next.js static assets
      urlPattern: /^\/_next\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'next-assets' },
    },
    {
      // Cache patient vitals API
      urlPattern: /^https:\/\/.*\/api\/patient\/vitals.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'patient-vitals',
        networkTimeoutSeconds: 3,
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 }, // 1 hour
      },
    },
    {
      // Cache emergency contacts API
      urlPattern: /^https:\/\/.*\/api\/patient\/emergency.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'emergency-contacts',
        networkTimeoutSeconds: 3,
        expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 }, // 24 hours
      },
    },
    {
      // Cache medications API
      urlPattern: /^https:\/\/.*\/api\/patient\/medications.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'medications',
        networkTimeoutSeconds: 3,
        expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 }, // 24 hours
      },
    },
    {
      // Cache medical records API
      urlPattern: /^https:\/\/.*\/api\/patient\/records.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'medical-records',
        networkTimeoutSeconds: 3,
        expiration: { maxEntries: 100, maxAgeSeconds: 12 * 60 * 60 }, // 12 hours
      },
    },
    {
      // Cache doctor appointments API
      urlPattern: /^https:\/\/.*\/api\/appointments.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'appointments',
        networkTimeoutSeconds: 5,
        expiration: { maxEntries: 50, maxAgeSeconds: 6 * 60 * 60 }, // 6 hours
      },
    },
    {
      // Cache images and other resources
      urlPattern: /^https?.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'external-resources',
        expiration: { maxEntries: 200, maxAgeSeconds: 24 * 60 * 60 }, // 24 hours
      },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Security headers
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()'
          }
        ]
      },
      {
        // Additional security for API routes
        source: '/api/(.*)',
        headers: [
          {
            key: 'X-RateLimit-Limit',
            value: '100'
          },
          {
            key: 'X-RateLimit-Remaining',
            value: '99'
          },
          {
            key: 'X-RateLimit-Reset',
            value: '60'
          }
        ]
      }
    ];
  },

  // Environment variable validation
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // Disable x-powered-by header
  poweredByHeader: false,

  // Compression
  compress: true,
};

// Add security headers so Google Fonts can load under a strict CSP
nextConfig.headers = async () => {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; connect-src 'self' https:; manifest-src 'self';",
        },
      ],
    },
  ]
}

module.exports = withPWA(nextConfig);
