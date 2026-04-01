/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['@tabler/icons-react'],
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      import('workbox-webpack-plugin').then(({ GenerateSW }) => {
        config.plugins.push(
          new GenerateSW({
            swDest: '../public/sw.js',
            clientsClaim: true,
            skipWaiting: true,
            runtimeCaching: [
              {
                urlPattern: /^https?.*/,
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'offlineCache',
                  expiration: {
                    maxEntries: 200,
                  },
                },
              },
            ],
          })
        );
      }).catch(() => { /* bypass for now if unresolved in edge */ });
    }
    return config;
  },
};

export default nextConfig;
