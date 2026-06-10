import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/elenafirsova",
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["*"],
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
