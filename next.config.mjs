/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  serverExternalPackages: ['@better-auth/kysely-adapter', 'kysely'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/products/:path*',
        destination: 'http://localhost:5000/products/:path*',
      },
      {
        source: '/api/single-product/:path*',
        destination: 'http://localhost:5000/single-product/:path*',
      },
      {
        source: '/api/upload-product/:path*',
        destination: 'http://localhost:5000/upload-product/:path*',
      },
      {
        source: '/api/edit-product/:path*',
        destination: 'http://localhost:5000/edit-product/:path*',
      },
      {
        source: '/api/delete-product/:path*',
        destination: 'http://localhost:5000/delete-product/:path*',
      },
      {
        source: '/api/brands/:path*',
        destination: 'http://localhost:5000/brands/:path*',
      },
    ];
  },
};

export default nextConfig;