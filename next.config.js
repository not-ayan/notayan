/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.tenor.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Ensure all files are included in the build
  webpack: (config, { isServer }) => {
    // Add any custom webpack config here if needed
    return config;
  },
  // Ensure all pages are included in the build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
}

module.exports = nextConfig 