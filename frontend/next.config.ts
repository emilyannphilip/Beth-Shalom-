import type { NextConfig } from "next";
import { apiPrefix } from "./src/lib/api-path";

const nextConfig: NextConfig = {
  agentRules: false,
  devIndicators: false,
  async rewrites() {
    const backendOrigin = new URL(process.env.API_ORIGIN ?? "http://127.0.0.1:3001");

    if (
      !["http:", "https:"].includes(backendOrigin.protocol) ||
      backendOrigin.href !== backendOrigin.origin + "/"
    ) {
      throw new Error("API_ORIGIN must be an HTTP(S) origin without a path or credentials.");
    }

    return {
      fallback: [
        {
          source: `${apiPrefix}/:path*`,
          destination: `${backendOrigin.origin}${apiPrefix}/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
