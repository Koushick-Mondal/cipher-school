import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure Prisma Client is regenerated on server builds
      require('child_process').execSync('prisma generate', {
        stdio: 'inherit',
        cwd: process.cwd()
      });
    }
    return config;
  }
};

export default nextConfig;
