/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'images.unsplash.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'images.pexels.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'picsum.photos',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'via.placeholder.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'firebasestorage.googleapis.com',
            port: '',
            pathname: '/**',
          },
          // Common ImageKit default host
          {
            protocol: 'https',
            hostname: 'ik.imagekit.io',
            port: '',
            pathname: '/**',
          },
          // Dynamically allow ImageKit domain if provided via env
          ...(() => {
            try {
              if (!process.env.IMAGEKIT_URL) return []
              const { hostname, protocol } = new URL(process.env.IMAGEKIT_URL)
              return [{ protocol: protocol.replace(':',''), hostname, port: '', pathname: '/**' }]
            } catch {
              return []
            }
          })(),
        ],
      },
};

export default nextConfig;
