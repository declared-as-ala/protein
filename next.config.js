/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'admin.protein.tn',
      },
      {
        protocol: 'https',
        hostname: 'admin.sobitas.tn',
      },
      {
        protocol: 'https',
        hostname: 'protein.tn',
      },
      {
        protocol: 'https',
        hostname: 'sobitas.tn',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    qualities: [75, 85, 90, 95, 100],
  },
  compress: true,
  poweredByHeader: false,
  // experimental: {
  //   optimizeCss: true, // Disabled - requires critters package
  // },
}

module.exports = nextConfig
