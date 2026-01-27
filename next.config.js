import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects.js'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[process.env.NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
      // UploadThing CDN domains
      {
        hostname: 'utfs.io',
        protocol: 'https',
      },
      {
        hostname: '**.utfs.io',
        protocol: 'https',
      },
      {
        hostname: 'uploadthing.com',
        protocol: 'https',
      },
      {
        hostname: '**.uploadthing.com',
        protocol: 'https',
      },
      // UploadThing newer format (ufs.sh)
      {
        hostname: '**.ufs.sh',
        protocol: 'https',
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ['sharp', 'graphql'],
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
