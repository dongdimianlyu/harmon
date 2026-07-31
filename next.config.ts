import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      { source: "/app", destination: "/", permanent: true },
      { source: "/app/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
