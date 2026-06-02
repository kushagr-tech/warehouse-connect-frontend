/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/warehouse-connect-frontend',
  trailingSlash: true,
  eslint: {
    // These are checked at type level - we disable the ESLint `any` rule during build
    // as the mock data layer uses loosely-typed responses from the backend
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
