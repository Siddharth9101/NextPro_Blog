import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    cacheComponents: true,
    images: {
        remotePatterns: [
            {
                hostname: "images.unsplash.com",
                protocol: "https",
                port: ""
            },
            {
                hostname: "stoic-wren-756.eu-west-1.convex.cloud",
                protocol: "https",
                port: ""
            },
            {
                hostname: "https://quixotic-sockeye-798.convex.cloud",
                protocol: "https",
                port: ""
            },
        ]
    }
};

export default nextConfig;
