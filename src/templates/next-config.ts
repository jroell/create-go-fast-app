import { ProjectConfig } from '../types';

export function getNextConfig(config: ProjectConfig): string {
  const baseConfig = {
    experimental: {},
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '*.supabase.co',
        },
        {
          protocol: 'https',
          hostname: '*.supabase.in',
        },
        {
          protocol: 'https',
          hostname: 'avatars.githubusercontent.com',
        },
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
        },
      ],
    },
  };

  let configString = `/** @type {import('next').NextConfig} */
const nextConfig = ${JSON.stringify(baseConfig, null, 2)};

`;

  // Add Sentry configuration if observability is enabled
  if (config.includeObservability) {
    configString += `
// Sentry configuration
const { withSentryConfig } = require('@sentry/nextjs');

const sentryWebpackPluginOptions = {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
`;
  } else {
    configString += `module.exports = nextConfig;
`;
  }

  return configString;
}