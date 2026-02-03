import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  images: {
    qualities: [75, 95, 100],
  },
};

export default nextConfig;
