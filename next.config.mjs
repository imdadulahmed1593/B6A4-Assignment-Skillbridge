/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/auth/:path*",
  //       destination: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/:path*`,
  //     },
  //   ];
  // },
};

export default nextConfig;
