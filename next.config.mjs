
let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV !== 'production',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV !== 'production',
  },
  images: {
    unoptimized: true,
    domains: ["hebbkx1anhila5yf.public.blob.vercel-storage.com"],
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  async headers() {
    return [
      {
        source: "/invoices/:path*",
        headers: [
          { key: "Content-Disposition", value: "attachment" }, // 🔹 Forzar descarga
        ],
      },
    ];
  },
};

export default nextConfig;
