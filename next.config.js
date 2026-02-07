/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      // Cache Next.js static assets
      urlPattern: /^\/_next\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'next-assets' },
    },
    {
      // Cache API requests and dynamic data
      urlPattern: /^https:\/\/your-api-domain\.com\/.*/i, // Replace with your API domain
      handler: 'NetworkFirst', // Try network first, fallback to cache if offline
      options: {
        cacheName: 'api-data',
        networkTimeoutSeconds: 10, // fallback to cache if network takes too long
        expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 }, // cache up to 1 day
      },
    },
    {
      // Cache images and other resources
      urlPattern: /^https?.*/i,
      handler: 'NetworkFirst',
      options: { cacheName: 'external-resources' },
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
};

module.exports = withPWA(nextConfig);
