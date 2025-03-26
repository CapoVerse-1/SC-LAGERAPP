/** @type {import('next').NextConfig} */
const nextConfig = {
  // Core configurations
  reactStrictMode: false,
  swcMinify: true,

  // Disable certain checks during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Image optimization
  images: {
    unoptimized: true,
  },

  // Turbo optimizations
  turbo: {
    enabled: true,
    fastRefresh: true,
    persistent: true,
    memoryLimit: 4096,
  },

  // Experimental features (keeping only essential ones)
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    optimizeCss: true,
  },
}

export default nextConfig
