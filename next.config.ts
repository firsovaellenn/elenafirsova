import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },

  allowedDevOrigins: ["*"],

  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
