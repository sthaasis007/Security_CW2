import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://192.168.137.1", "http://192.168.88.1", "http://localhost", "http://127.0.0.1"],
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: "http://localhost:5000/api/:path*",
        },
        {
          source: "/uploads/:path*",
          destination: "http://localhost:5000/uploads/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
