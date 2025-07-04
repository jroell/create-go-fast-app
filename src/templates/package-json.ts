import { ProjectConfig, PackageJson } from '../types';

export function getNextPackageJson(config: ProjectConfig): PackageJson {
  const basePackageJson: PackageJson = {
    name: config.projectName,
    version: "0.1.0",
    private: true,
    packageManager: "npm@11.4.1",
    scripts: {
      build: "next build",
      dev: "next dev",
      lint: "next lint",
      start: "next start",
      "type-check": "tsc --noEmit",
    },
    dependencies: {
      next: "^15.0.0",
      react: "^19.0.0",
      "react-dom": "^19.0.0",
      "@types/node": "^20.0.0",
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0",
      typescript: "^5.0.0",
      tailwindcss: "^3.4.0",
      autoprefixer: "^10.4.0",
      postcss: "^8.4.0",
      clsx: "^2.0.0",
      "tailwind-merge": "^2.0.0",
      "class-variance-authority": "^0.7.0",
      "lucide-react": "^0.400.0",
      "tailwindcss-animate": "^1.0.7",
    },
    devDependencies: {
      "@types/node": "^20.0.0",
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0",
      "eslint": "^8.0.0",
      "eslint-config-next": "^15.0.0",
      "@typescript-eslint/eslint-plugin": "^6.0.0",
      "@typescript-eslint/parser": "^6.0.0",
      "prettier": "^3.0.0",
      "prettier-plugin-tailwindcss": "^0.5.0",
    },
  };

  // Add shadcn/ui dependencies
  if (config.template !== 'minimal') {
    basePackageJson.dependencies = {
      ...basePackageJson.dependencies,
      "@radix-ui/react-accordion": "^1.2.1",
      "@radix-ui/react-alert-dialog": "^1.1.2",
      "@radix-ui/react-aspect-ratio": "^1.1.0",
      "@radix-ui/react-avatar": "^1.1.1",
      "@radix-ui/react-checkbox": "^1.1.2",
      "@radix-ui/react-collapsible": "^1.1.1",
      "@radix-ui/react-dialog": "^1.1.2",
      "@radix-ui/react-dropdown-menu": "^2.1.2",
      "@radix-ui/react-hover-card": "^1.1.2",
      "@radix-ui/react-label": "^2.1.0",
      "@radix-ui/react-menubar": "^1.1.2",
      "@radix-ui/react-navigation-menu": "^1.2.1",
      "@radix-ui/react-popover": "^1.1.2",
      "@radix-ui/react-progress": "^1.1.0",
      "@radix-ui/react-radio-group": "^1.2.1",
      "@radix-ui/react-scroll-area": "^1.2.0",
      "@radix-ui/react-select": "^2.1.2",
      "@radix-ui/react-separator": "^1.1.0",
      "@radix-ui/react-slider": "^1.2.1",
      "@radix-ui/react-slot": "^1.1.0",
      "@radix-ui/react-switch": "^1.1.1",
      "@radix-ui/react-tabs": "^1.1.1",
      "@radix-ui/react-toast": "^1.2.2",
      "@radix-ui/react-toggle": "^1.1.0",
      "@radix-ui/react-toggle-group": "^1.1.0",
      "@radix-ui/react-tooltip": "^1.1.3",
      "cmdk": "^1.0.0",
      "date-fns": "^4.1.0",
      "react-day-picker": "^9.1.3",
      "react-hook-form": "^7.54.0",
      "react-resizable-panels": "^2.1.6",
      "sonner": "^1.7.0",
      "vaul": "^1.1.1",
      "zod": "^3.24.1",
      "@hookform/resolvers": "^3.10.0",
    };
  }

  // Add AI dependencies
  if (config.includeAI) {
    basePackageJson.dependencies = {
      ...basePackageJson.dependencies,
      "ai": "^4.0.0",
      "@ai-sdk/openai": "^1.0.0",
      "@ai-sdk/anthropic": "^1.0.0",
      "@ai-sdk/google": "^1.0.0",
      "langchain": "^0.3.29",
      "@langchain/langgraph": "^0.3.0",
      "@langchain/openai": "^0.5.0",
      "@langchain/anthropic": "^0.3.24",
      "@langchain/community": "^0.3.48",
      "@langchain/core": "^0.3.58",
      "@lancedb/lancedb": "^0.21.0",
    };
  }

  // Add authentication dependencies
  if (config.includeAuth) {
    basePackageJson.dependencies = {
      ...basePackageJson.dependencies,
      "next-auth": "^5.0.0-beta.4",
      "@auth/drizzle-adapter": "^1.0.0",
      "@auth/core": "^0.30.0",
    };
  }

  // Add database dependencies
  if (config.includeDatabase) {
    basePackageJson.dependencies = {
      ...basePackageJson.dependencies,
      "drizzle-orm": "^0.30.0",
      "@supabase/supabase-js": "^2.39.0",
      "postgres": "^3.4.0",
      "pg": "^8.11.0",
      "@types/pg": "^8.11.0",
    };
    
    basePackageJson.devDependencies = {
      ...basePackageJson.devDependencies,
      "drizzle-kit": "^0.21.0",
    };
    
    basePackageJson.scripts = {
      ...basePackageJson.scripts,
      "db:generate": "drizzle-kit generate",
      "db:migrate": "drizzle-kit migrate",
      "db:studio": "drizzle-kit studio",
    };
  }

  // Add tRPC dependencies
  if (config.template === 'full') {
    basePackageJson.dependencies = {
      ...basePackageJson.dependencies,
      "@trpc/client": "^11.0.0",
      "@trpc/server": "^11.0.0",
      "@trpc/react-query": "^11.0.0",
      "@trpc/next": "^11.0.0",
      "@tanstack/react-query": "^5.0.0",
      "@tanstack/react-query-devtools": "^5.0.0",
      "superjson": "^2.2.0",
    };
  }

  // Add Electron dependencies
  if (config.includeElectron) {
    basePackageJson.dependencies = {
      ...basePackageJson.dependencies,
      "electron-is-dev": "^3.0.0",
      "electron-next": "^3.1.5",
    };
    
    basePackageJson.devDependencies = {
      ...basePackageJson.devDependencies,
      "electron": "^28.0.0",
      "electron-builder": "^24.0.0",
    };
    
    basePackageJson.scripts = {
      ...basePackageJson.scripts,
      "electron": "electron .",
      "electron-dev": "ELECTRON_IS_DEV=true electron .",
      "electron-build": "electron-builder",
      "build-electron": "npm run build && npm run electron-build",
    };
  }

  // Add observability dependencies
  if (config.includeObservability) {
    basePackageJson.dependencies = {
      ...basePackageJson.dependencies,
      "@sentry/nextjs": "^8.0.0",
      "@vercel/analytics": "^1.0.0",
      "@opentelemetry/api": "^1.7.0",
      "@opentelemetry/sdk-node": "^0.48.0",
      "@opentelemetry/auto-instrumentations-node": "^0.41.0",
      "@opentelemetry/exporter-jaeger": "^1.21.0",
      "@opentelemetry/exporter-prometheus": "^0.48.0",
      "langsmith": "^0.1.0",
    };
  }

  // Add Turborepo dependencies (but keep original scripts to avoid recursion)
  if (config.template === 'full') {
    basePackageJson.devDependencies = {
      ...basePackageJson.devDependencies,
      "turbo": "^2.5.0",
    };
    
    // Add turbo clean script only, keep other scripts as Next.js direct commands
    basePackageJson.scripts = {
      ...basePackageJson.scripts,
      "clean": "turbo clean",
    };
  }

  return basePackageJson;
}