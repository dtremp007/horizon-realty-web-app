/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
  experimental: {
    scrollRestoration: true,
  },
};

module.exports = nextConfig;
