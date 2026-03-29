/** @type {import("next").NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  transpilePackages: ["@biffco/ui", "@biffco/db", "@biffco/core", "@tabler/icons-react", "reactflow"]
};
export default nextConfig;
