import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "puppeteer-core",
    "@sparticuz/chromium-min",
    "@anthropic-ai/sdk",
    "openai",
  ],
};

export default nextConfig;
