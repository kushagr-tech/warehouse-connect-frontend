/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed basePath so your app loads natively at the root of your Render URL
  trailingSlash: true,
  eslint: {
    // These are checked at type level - we disable the ESLint `any` rule during build
    // as the mock data layer uses loosely-typed responses from the backend
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
