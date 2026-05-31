/** @type {import('next').NextConfig} */
const nextConfig = {
  // Internal packages are consumed as TypeScript source (see docs/ARCHITECTURE.md),
  // so Next must transpile them.
  transpilePackages: ['@repo/ui', '@repo/types', '@repo/utils'],
};

export default nextConfig;
