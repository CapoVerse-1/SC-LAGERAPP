/** @type {import('next').NextConfig} */
const nextConfig = {
  // Core configurations
  reactStrictMode: false,
  
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

  // Experimental features - removing potentially problematic ones
  experimental: {
    // These features may cause issues with Vercel deployment
    // webpackBuildWorker: true,
    // parallelServerBuildTraces: true,
    // parallelServerCompiles: true,
  },
}

export default nextConfig
