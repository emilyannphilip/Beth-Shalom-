import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  devIndicators: false,
  distDir: process.env.NEXT_TEST_DIST_DIR || ".next",
  async headers() {
    return [
      "/beth-shalom/fonts/:asset",
      "/beth-shalom/assets/design/:asset",
    ].map((source) => ({
      source,
      headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
    }));
  },
};

export default nextConfig;
