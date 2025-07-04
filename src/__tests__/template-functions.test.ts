import { describe, it, expect, beforeEach } from 'vitest';
import { ProjectConfig } from '../types';

// Import all template functions
import { getNextPackageJson } from '../templates/package-json';
import { getNextConfig } from '../templates/next-config';
import { getTailwindConfig } from '../templates/tailwind-config';
import { getComponentsJson } from '../templates/components-json';
import { getEnvExample } from '../templates/env-example';
import { getMainLayout } from '../templates/main-layout';
import { getHomePage } from '../templates/home-page';
import { getGlobalsCSS } from '../templates/globals-css';
import { getAuthConfig } from '../templates/auth-config';
import { getDrizzleConfig } from '../templates/drizzle-config';
import { getSupabaseConfig } from '../templates/supabase-config';
import { getTrpcConfig } from '../templates/trpc-config';
import { getVercelConfig } from '../templates/vercel-config';
import { getLangChainConfig } from '../templates/langchain-config';
import { getTurboConfig } from '../templates/turbo-config';
import { getReadme } from '../templates/readme';
import { getApiRoute } from '../templates/api-routes';
import { getChatComponent } from '../templates/chat-component';
import { getElectronConfig } from '../templates/electron-config';
import { getSentryConfig } from '../templates/sentry-config';
import {
  getButtonComponent,
  getCardComponent,
  getInputComponent,
  getScrollAreaComponent,
  getAvatarComponent,
  getSeparatorComponent
} from '../templates/ui-components';

describe('Template Functions', () => {
  let baseConfig: ProjectConfig;
  let minimalConfig: ProjectConfig;
  let frontendConfig: ProjectConfig;
  let fullConfig: ProjectConfig;

  beforeEach(() => {
    baseConfig = {
      projectName: 'test-project',
      template: 'minimal',
      includeAuth: false,
      includeDatabase: false,
      includeAI: false,
      includeElectron: false,
      includeObservability: false,
      packageManager: 'npm',
      skipInstall: false
    };

    minimalConfig = { ...baseConfig, template: 'minimal' };
    frontendConfig = { ...baseConfig, template: 'frontend', includeAI: true };
    fullConfig = {
      ...baseConfig,
      template: 'full',
      includeAuth: true,
      includeDatabase: true,
      includeAI: true,
      includeObservability: true
    };
  });

  describe('Package.json Generation', () => {
    it('should generate minimal package.json', () => {
      const packageJson = getNextPackageJson(minimalConfig);
      
      expect(packageJson.name).toBe('test-project');
      expect(packageJson.version).toBe('0.1.0');
      expect(packageJson.private).toBe(true);
      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts.dev).toBe('next dev');
      expect(packageJson.scripts.build).toBe('next build');
      expect(packageJson.scripts.deploy).toBe('vercel --prod');
      expect(packageJson.scripts['deploy-preview']).toBe('vercel');
      
      // Should include basic dependencies
      expect(packageJson.dependencies.next).toBe('^15.0.0');
      expect(packageJson.dependencies.react).toBe('^19.0.0');
      expect(packageJson.dependencies.tailwindcss).toBe('^3.4.0');
      
      // Should include Vercel CLI
      expect(packageJson.devDependencies.vercel).toBe('^37.0.0');
      
      // Should not include advanced features
      expect(packageJson.dependencies['next-auth']).toBeUndefined();
      expect(packageJson.dependencies['drizzle-orm']).toBeUndefined();
      expect(packageJson.dependencies.ai).toBeUndefined();
    });

    it('should generate frontend package.json with AI', () => {
      const packageJson = getNextPackageJson(frontendConfig);
      
      expect(packageJson.name).toBe('test-project');
      expect(packageJson.dependencies.ai).toBe('^4.0.0');
      expect(packageJson.dependencies.langchain).toBe('^0.3.29');
      expect(packageJson.dependencies['@ai-sdk/openai']).toBe('^1.0.0');
      
      // Should include shadcn/ui components for non-minimal
      expect(packageJson.dependencies['@radix-ui/react-button']).toBeUndefined();
      expect(packageJson.dependencies.cmdk).toBe('^1.0.0');
    });

    it('should generate full package.json with all features', () => {
      const packageJson = getNextPackageJson(fullConfig);
      
      expect(packageJson.name).toBe('test-project');
      
      // Auth dependencies
      expect(packageJson.dependencies['next-auth']).toBe('^5.0.0-beta.4');
      expect(packageJson.dependencies['@auth/drizzle-adapter']).toBe('^1.0.0');
      
      // Database dependencies
      expect(packageJson.dependencies['drizzle-orm']).toBe('^0.30.0');
      expect(packageJson.dependencies['@supabase/supabase-js']).toBe('^2.39.0');
      expect(packageJson.devDependencies['drizzle-kit']).toBe('^0.21.0');
      expect(packageJson.scripts['db:generate']).toBe('drizzle-kit generate');
      
      // AI dependencies
      expect(packageJson.dependencies.ai).toBe('^4.0.0');
      expect(packageJson.dependencies.langchain).toBe('^0.3.29');
      
      // tRPC dependencies
      expect(packageJson.dependencies['@trpc/client']).toBe('^11.0.0');
      expect(packageJson.dependencies['@trpc/server']).toBe('^11.0.0');
      
      // Observability dependencies
      expect(packageJson.dependencies['@sentry/nextjs']).toBe('^8.0.0');
      expect(packageJson.dependencies['@vercel/analytics']).toBe('^1.0.0');
      
      // Turborepo
      expect(packageJson.devDependencies.turbo).toBe('^2.5.0');
      expect(packageJson.scripts.clean).toBe('turbo clean');
    });

    it('should include Electron dependencies when enabled', () => {
      const electronConfig = { ...baseConfig, includeElectron: true };
      const packageJson = getNextPackageJson(electronConfig);
      
      expect(packageJson.dependencies['electron-is-dev']).toBe('^3.0.0');
      expect(packageJson.devDependencies.electron).toBe('^28.0.0');
      expect(packageJson.scripts.electron).toBe('electron .');
      expect(packageJson.scripts['electron-dev']).toBe('ELECTRON_IS_DEV=true electron .');
    });
  });

  describe('Next.js Configuration', () => {
    it('should generate basic Next.js config', () => {
      const config = getNextConfig(baseConfig);
      
      expect(config).toContain('/** @type {import(\'next\').NextConfig} */');
      expect(config).toContain('module.exports = nextConfig');
      expect(config).toContain('images');
      expect(config).toContain('remotePatterns');
    });

    it('should include Sentry config for observability', () => {
      const config = getNextConfig(fullConfig);
      
      expect(config).toContain('withSentryConfig');
      expect(config).toContain('sentryWebpackPluginOptions');
      expect(config).toContain('SENTRY_ORG');
    });

    it('should not include Sentry for non-observability configs', () => {
      const config = getNextConfig(minimalConfig);
      
      expect(config).not.toContain('withSentryConfig');
      expect(config).toContain('module.exports = nextConfig');
    });
  });

  describe('Tailwind Configuration', () => {
    it('should generate Tailwind config', () => {
      const config = getTailwindConfig(baseConfig);
      
      expect(config).toContain('module.exports');
      expect(config).toContain('darkMode');
      expect(config).toContain('content');
      expect(config).toContain('./src/**/*.{ts,tsx}');
      expect(config).toContain('tailwindcss-animate');
    });

    it('should include design system tokens', () => {
      const config = getTailwindConfig(baseConfig);
      
      expect(config).toContain('colors');
      expect(config).toContain('border');
      expect(config).toContain('primary');
      expect(config).toContain('secondary');
      expect(config).toContain('destructive');
      expect(config).toContain('muted');
    });
  });

  describe('Components Configuration', () => {
    it('should generate components.json for shadcn/ui', () => {
      const config = getComponentsJson();
      
      expect(config.style).toBe('default');
      expect(config.rsc).toBe(true);
      expect(config.tsx).toBe(true);
      expect(config.tailwind.config).toBe('tailwind.config.js');
      expect(config.tailwind.css).toBe('src/app/globals.css');
      expect(config.aliases.components).toBe('@/components');
      expect(config.aliases.utils).toBe('@/lib/utils');
    });
  });

  describe('Environment Configuration', () => {
    it('should generate basic environment variables', () => {
      const env = getEnvExample(minimalConfig);
      
      expect(env).toContain('# Next.js');
      expect(env).toContain('NEXT_PUBLIC_APP_URL');
      expect(env).toContain('NODE_ENV=development');
    });

    it('should include auth variables when enabled', () => {
      const env = getEnvExample({ ...baseConfig, includeAuth: true });
      
      expect(env).toContain('# Authentication (NextAuth.js)');
      expect(env).toContain('NEXTAUTH_SECRET');
      expect(env).toContain('GITHUB_CLIENT_ID');
      expect(env).toContain('GOOGLE_CLIENT_ID');
    });

    it('should include database variables when enabled', () => {
      const env = getEnvExample({ ...baseConfig, includeDatabase: true });
      
      expect(env).toContain('# Database (Supabase)');
      expect(env).toContain('DATABASE_URL');
      expect(env).toContain('SUPABASE_URL');
      expect(env).toContain('SUPABASE_ANON_KEY');
    });

    it('should include AI variables when enabled', () => {
      const env = getEnvExample({ ...baseConfig, includeAI: true });
      
      expect(env).toContain('# AI Services');
      expect(env).toContain('OPENAI_API_KEY');
      expect(env).toContain('ANTHROPIC_API_KEY');
      expect(env).toContain('LANGCHAIN_API_KEY');
    });

    it('should include observability variables when enabled', () => {
      const env = getEnvExample({ ...baseConfig, includeObservability: true });
      
      expect(env).toContain('# Sentry');
      expect(env).toContain('SENTRY_DSN');
      expect(env).toContain('# OpenTelemetry');
      expect(env).toContain('OTEL_SERVICE_NAME');
    });
  });

  describe('React Components', () => {
    it('should generate main layout', () => {
      const layout = getMainLayout(baseConfig);
      
      expect(layout).toContain('export default function RootLayout');
      expect(layout).toContain('import "./globals.css"');
      expect(layout).toContain('<html lang="en">');
      expect(layout).toContain('<body');
      expect(layout).toContain('children');
    });

    it('should generate home page', () => {
      const page = getHomePage(baseConfig);
      
      expect(page).toContain('export default function');
      expect(page).toContain('GO FAST');
      expect(page).toContain('The AI-First Tech Stack');
    });

    it('should generate globals CSS', () => {
      const css = getGlobalsCSS();
      
      expect(css).toContain('@tailwind base');
      expect(css).toContain('@tailwind components');
      expect(css).toContain('@tailwind utilities');
      expect(css).toContain(':root');
      expect(css).toContain('--background');
      expect(css).toContain('--foreground');
    });

    it('should generate chat component for AI configs', () => {
      const chat = getChatComponent({ ...baseConfig, includeAI: true });
      
      expect(chat).toContain('export function Chat');
      expect(chat).toContain('useChat');
      expect(chat).toContain('ai/react');
      expect(chat).toContain('messages');
      expect(chat).toContain('input');
    });
  });

  describe('Configuration Files', () => {
    it('should generate auth config', () => {
      const auth = getAuthConfig({ ...baseConfig, includeAuth: true });
      
      expect(auth).toContain('export const authConfig');
      expect(auth).toContain('Google');
      expect(auth).toContain('GitHub');
      expect(auth).toContain('NextAuthConfig');
    });

    it('should generate Drizzle config', () => {
      const drizzle = getDrizzleConfig({ ...baseConfig, includeDatabase: true });
      
      expect(drizzle).toContain('export default');
      expect(drizzle).toContain('schema');
      expect(drizzle).toContain('out');
      expect(drizzle).toContain('satisfies Config');
    });

    it('should generate Supabase config', () => {
      const supabase = getSupabaseConfig({ ...baseConfig, includeDatabase: true });
      
      expect(supabase).toContain('createClient');
      expect(supabase).toContain('drizzle');
      expect(supabase).toContain('export const db');
      expect(supabase).toContain('SUPABASE_URL');
    });

    it('should generate tRPC config', () => {
      const trpc = getTrpcConfig(fullConfig);
      
      expect(trpc).toContain('createTRPCReact');
      expect(trpc).toContain('httpBatchLink');
      expect(trpc).toContain('AppRouter');
    });

    it('should generate LangChain config', () => {
      const langchain = getLangChainConfig({ ...baseConfig, includeAI: true });
      
      expect(langchain).toContain('ChatOpenAI');
      expect(langchain).toContain('OPENAI_API_KEY');
      expect(langchain).toContain('temperature');
    });

    it('should generate Vercel config', () => {
      const vercel = getVercelConfig(baseConfig);
      
      expect(vercel).toBeDefined();
      expect(typeof vercel).toBe('object');
    });

    it('should generate Turbo config', () => {
      const turbo = getTurboConfig(fullConfig);
      
      expect(turbo).toBeDefined();
      expect(typeof turbo).toBe('object');
    });

    it('should generate API route', () => {
      const api = getApiRoute(fullConfig);
      
      expect(api).toContain('fetchRequestHandler');
      expect(api).toContain('appRouter');
      expect(api).toContain('export { handler as GET, handler as POST }');
    });

    it('should generate Electron config', () => {
      const electron = getElectronConfig({ ...baseConfig, includeElectron: true });
      
      expect(electron).toContain('BrowserWindow');
      expect(electron).toContain('app.whenReady');
      expect(electron).toContain('loadURL');
    });

    it('should generate Sentry config', () => {
      const sentry = getSentryConfig({ ...baseConfig, includeObservability: true });
      
      expect(sentry).toContain('withSentryConfig');
      expect(sentry).toContain('SENTRY_DSN');
      expect(sentry).toContain('sentry');
    });
  });

  describe('README Generation', () => {
    it('should generate project README', () => {
      const readme = getReadme(baseConfig);
      
      expect(readme).toContain('# test-project');
      expect(readme).toContain('GO FAST');
      expect(readme).toContain('npm run dev');
      expect(readme).toContain('Built with the');
    });

    it('should include feature-specific instructions', () => {
      const readme = getReadme(fullConfig);
      
      expect(readme).toContain('Authentication') || expect(readme).toContain('Auth');
      expect(readme).toContain('Database') || expect(readme).toContain('Data');
      expect(readme).toContain('AI') || expect(readme).toContain('Artificial Intelligence');
      expect(readme).toContain('Observability') || expect(readme).toContain('Monitoring');
    });
  });
});

describe('UI Components Generation', () => {
  describe('Button Component', () => {
    it('should generate button component with variants', () => {
      const button = getButtonComponent();
      
      expect(button).toContain('export { Button, buttonVariants }');
      expect(button).toContain('buttonVariants');
      expect(button).toContain('cva');
      expect(button).toContain('variant');
      expect(button).toContain('size');
      expect(button).toContain('default');
      expect(button).toContain('destructive');
      expect(button).toContain('outline');
      expect(button).toContain('secondary');
      expect(button).toContain('ghost');
      expect(button).toContain('link');
    });

    it('should include proper TypeScript types', () => {
      const button = getButtonComponent();
      
      expect(button).toContain('ButtonProps');
      expect(button).toContain('React.ButtonHTMLAttributes');
      expect(button).toContain('VariantProps');
      expect(button).toContain('asChild?: boolean');
    });
  });

  describe('Card Component', () => {
    it('should generate card component with sub-components', () => {
      const card = getCardComponent();
      
      expect(card).toContain('export { Card');
      expect(card).toContain('CardHeader');
      expect(card).toContain('CardTitle');
      expect(card).toContain('CardDescription');
      expect(card).toContain('CardContent');
      expect(card).toContain('CardFooter');
    });

    it('should include proper styling classes', () => {
      const card = getCardComponent();
      
      expect(card).toContain('rounded-lg border');
      expect(card).toContain('bg-card text-card-foreground');
      expect(card).toContain('shadow-sm');
    });
  });

  describe('Input Component', () => {
    it('should generate input component', () => {
      const input = getInputComponent();
      
      expect(input).toContain('export { Input }');
      expect(input).toContain('React.InputHTMLAttributes');
      expect(input).toContain('forwardRef');
      expect(input).toContain('className');
    });

    it('should include accessibility features', () => {
      const input = getInputComponent();
      
      expect(input).toContain('focus-visible:outline-none');
      expect(input).toContain('focus-visible:ring-2');
      expect(input).toContain('disabled:cursor-not-allowed');
      expect(input).toContain('disabled:opacity-50');
    });
  });

  describe('ScrollArea Component', () => {
    it('should generate scroll area with Radix UI', () => {
      const scrollArea = getScrollAreaComponent();
      
      expect(scrollArea).toContain('export { ScrollArea');
      expect(scrollArea).toContain('ScrollAreaPrimitive');
      expect(scrollArea).toContain('ScrollBar');
      expect(scrollArea).toContain('Viewport');
      expect(scrollArea).toContain('Corner');
    });
  });

  describe('Avatar Component', () => {
    it('should generate avatar component with fallback', () => {
      const avatar = getAvatarComponent();
      
      expect(avatar).toContain('export { Avatar');
      expect(avatar).toContain('AvatarImage');
      expect(avatar).toContain('AvatarFallback');
      expect(avatar).toContain('AvatarPrimitive');
      expect(avatar).toContain('rounded-full');
    });
  });

  describe('Separator Component', () => {
    it('should generate separator component', () => {
      const separator = getSeparatorComponent();
      
      expect(separator).toContain('export { Separator }');
      expect(separator).toContain('SeparatorPrimitive');
      expect(separator).toContain('orientation');
      expect(separator).toContain('horizontal');
      expect(separator).toContain('h-[1px] w-full');
    });
  });

  describe('Component Imports and Exports', () => {
    it('should have consistent import patterns', () => {
      const components = [
        getButtonComponent(),
        getCardComponent(),
        getInputComponent(),
        getScrollAreaComponent(),
        getAvatarComponent(),
        getSeparatorComponent()
      ];

      components.forEach(component => {
        expect(component).toContain('import * as React from "react"');
        expect(component).toContain('import { cn } from "~/lib/utils"');
      });
    });

    it('should use proper export patterns', () => {
      const button = getButtonComponent();
      const card = getCardComponent();
      
      expect(button).toContain('export { Button, buttonVariants }');
      expect(card).toContain('export { Card');
    });
  });
});