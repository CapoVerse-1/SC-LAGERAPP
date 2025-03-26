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

  // Experimental features (keeping only essential ones)
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  
  // Ensure runtime config is used (for Vercel deployment)
  env: {
    NEXT_PUBLIC_RUNTIME_CHECK: 'configured',
  },
  
  // Enable runtime config
  serverRuntimeConfig: {
    PROJECT_ROOT: process.cwd(),
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    RUNTIME_ENV: process.env.NODE_ENV,
  },
}

export default nextConfig
