/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Evitamos que Vercel rompa el build invocando a su eslint obsoleto
    // porque el Monorepo confía en el Flat Config (eslint.config.mjs) en la raíz
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
