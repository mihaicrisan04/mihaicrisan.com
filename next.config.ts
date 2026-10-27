import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // dev server on mihais-box, opened from the mac over LAN/tailnet
  allowedDevOrigins: ["mihais-box", "*.ts.net", "100.93.86.56", "192.168.1.28"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/u/**",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/mihaicrisan/**",
      },
    ],
  },
};

export default nextConfig;
