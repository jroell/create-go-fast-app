import { ProjectConfig } from '../types';

export function getEnvExample(config: ProjectConfig): string {
  let envContent = `# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

`;

  // Add authentication environment variables
  if (config.includeAuth) {
    envContent += `# Authentication (NextAuth.js)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
AUTH_SECRET=your-secret-key-here

# OAuth Providers
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

`;
  }

  // Add database environment variables
  if (config.includeDatabase) {
    envContent += `# Database (Supabase)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

`;
  }

  // Add AI environment variables
  if (config.includeAI) {
    envContent += `# AI Services
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
GOOGLE_AI_API_KEY=your-google-ai-api-key

# Vercel AI Gateway
VERCEL_AI_GATEWAY_URL=https://gateway.ai.vercel.app
VERCEL_AI_GATEWAY_TOKEN=your-gateway-token

# LangSmith (for observability)
LANGCHAIN_API_KEY=your-langchain-api-key
LANGCHAIN_PROJECT=your-project-name
LANGCHAIN_TRACING_V2=true

`;
  }

  // Add observability environment variables
  if (config.includeObservability) {
    envContent += `# Sentry
SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=your-sentry-project
SENTRY_AUTH_TOKEN=your-sentry-auth-token

# OpenTelemetry
OTEL_EXPORTER_JAEGER_ENDPOINT=http://localhost:14268/api/traces
OTEL_SERVICE_NAME=${config.projectName}
OTEL_RESOURCE_ATTRIBUTES=service.name=${config.projectName}

`;
  }

  // Add Vercel environment variables
  envContent += `# Vercel
VERCEL_URL=\${VERCEL_URL}
VERCEL_ENV=\${VERCEL_ENV}

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id

`;

  return envContent;
}