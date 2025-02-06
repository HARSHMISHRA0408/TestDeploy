/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"], // ✅ Allow external image domain
  },
  reactStrictMode: true,
};

export default nextConfig;
