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
};

export default nextConfig;
