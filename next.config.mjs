/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ["cdn1.iconfinder.com", "lh3.googleusercontent.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn1.iconfinder.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
