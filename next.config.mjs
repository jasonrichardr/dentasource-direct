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
        source: '/products/roson-s9',
        destination: '/s9',
        permanent: true,
      },
      {
        source: '/dental-chairs',
        destination: '/dentalchairs',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
