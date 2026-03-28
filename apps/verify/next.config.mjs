/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // runtime: "edge", // Vercel edge functions are opt-in per route now in app dir
  }
};

export default nextConfig;
