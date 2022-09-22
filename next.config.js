/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["firebasestorage.googleapis.com", "localhost"],
  },
  experimental: {
    scrollRestoration: true,
  },
};

const withVideos = require("next-videos");

module.exports = nextConfig;
module.exports = withVideos();
