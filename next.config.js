/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rzhaurlqdvvcnhrusfvg.supabase.co",
        port: "",
        pathname: "/storage/v1/**",
      },
    ],
  },
};

module.exports = nextConfig;
