/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false, // Disable SWC minification to avoid binary issues
  // API proxy for development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
      {
        source: '/ai/:path*',
        destination: 'http://localhost:5001/:path*',
      },
    ]
  },
}

module.exports = nextConfig