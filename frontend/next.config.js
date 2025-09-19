/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Skip ESLint during production builds on Vercel
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'localhost',
      'lumina-africa.com',
      'www.lumina-africa.com',
      'images.unsplash.com',
      'via.placeholder.com',
      'lumina-csjl.onrender.com',
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://lumina-csjl.onrender.com' 
      : 'http://localhost:3001',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  },
  async rewrites() {
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? 'https://lumina-csjl.onrender.com' 
      : 'http://localhost:3001';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
