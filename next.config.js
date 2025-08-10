/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export', // Enables static export
  trailingSlash: true, // Ensures proper routing on GitHub Pages
  basePath: '/HEALCONNECT',
  assetPrefix: '/HEALCONNECT/',
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
