/** @type {import('next').NextConfig} */
const nextConfig = {
  "experimental": {
    "serverComponentsExternalPackages": [
      "@node-rs/argon2"
    ]
  },
  "images": {
    "remotePatterns": [
      {
        "protocol": "https",
        "hostname": "*.supabase.co"
      },
      {
        "protocol": "https",
        "hostname": "*.supabase.in"
      },
      {
        "protocol": "https",
        "hostname": "avatars.githubusercontent.com"
      },
      {
        "protocol": "https",
        "hostname": "lh3.googleusercontent.com"
      }
    ]
  }
};


// Sentry configuration
const { withSentryConfig } = require('@sentry/nextjs');

const sentryWebpackPluginOptions = {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
