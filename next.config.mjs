/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // ☠️ 85 HAS TO BE DECLARED OR IT IS A 400, NOT A FALLBACK. Next only serves the
    // qualities listed here; the default list is [75] alone, so a quality={85} anywhere in
    // the app returns "q parameter of 85 is not allowed" and the tile renders broken
    // rather than at 75. Jarich: "our images and videos should be high quality all".
    // 75 stays in the list because the news pages and product routes still ask for it.
    qualities: [75, 85],
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
        source: '/products/:path+',
        destination: '/dentalchairs',
        permanent: true,
      },
      {
        source: '/denjoy/imate3',
        destination: '/denjoy',
        permanent: true,
      },
      {
        source: '/denjoy/aike',
        destination: '/denjoy',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
