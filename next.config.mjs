/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.fsroson.com',
      },
      {
        protocol: 'http',
        hostname: 'www.fsroson.com',
      },
      {
        protocol: 'https',
        hostname: 'www.pehpot.com',
      },
      {
        protocol: 'https',
        hostname: 'www.lionheartv.net',
      },
      {
        protocol: 'https',
        hostname: 'pda.com.ph',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/a3-dental-chair',
        destination: '/a3',
        permanent: true,
      },
      {
        source: '/dental-chairs',
        destination: '/dentalchairs',
        permanent: true,
      },
      {
        source: '/products',
        destination: '/dentalchairs',
        permanent: true,
      },
      {
        source: '/products/:path*',
        destination: '/dentalchairs',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
