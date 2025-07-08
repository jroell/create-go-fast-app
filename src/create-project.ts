import { join } from 'path';
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { ProjectConfig, PackageJson } from './types';
import { getNextPackageJson } from './templates/package-json';
import { getNextConfig } from './templates/next-config';
import { getTailwindConfig } from './templates/tailwind-config';
import { getComponentsJson } from './templates/components-json';
import { getEnvExample } from './templates/env-example';
import { getMainLayout } from './templates/main-layout';
import { getHomePage } from './templates/home-page';
import { getGlobalsCSS } from './templates/globals-css';
import { getAuthConfig } from './templates/auth-config';
import { getDrizzleConfig } from './templates/drizzle-config';
import { getSupabaseConfig } from './templates/supabase-config';
import { getTrpcConfig } from './templates/trpc-config';
import { getVercelConfig } from './templates/vercel-config';
import { getLangChainConfig } from './templates/langchain-config';
import { getTurboConfig } from './templates/turbo-config';
import { getReadme } from './templates/readme';
import { getApiRoute } from './templates/api-routes';
import { getChatComponent } from './templates/chat-component';
import { getElectronConfig } from './templates/electron-config';
import { getSentryConfig } from './templates/sentry-config';
import { 
  getButtonComponent, 
  getCardComponent, 
  getInputComponent, 
  getScrollAreaComponent,
  getAvatarComponent,
  getSeparatorComponent 
} from './templates/ui-components';

export async function createProject(config: ProjectConfig): Promise<void> {
  const projectPath = join(process.cwd(), config.projectName);
  
  // Create project directory
  mkdirSync(projectPath, { recursive: true });
  
  // Create directory structure
  const dirs = [
    'src',
    'src/app',
    'src/app/api',
    'src/app/api/auth',
    'src/app/api/auth/[...nextauth]',
    'src/app/api/trpc',
    'src/app/api/trpc/[trpc]',
    'src/app/api/ai',
    'src/app/api/ai/chat',
    'src/components',
    'src/components/ui',
    'src/lib',
    'src/lib/auth',
    'src/lib/db',
    'src/lib/trpc',
    'src/lib/ai',
    'src/server',
    'src/server/api',
    'src/server/api/routers',
    'public',
    'drizzle',
    'prisma',
  ];
  
  dirs.forEach(dir => {
    const fullPath = join(projectPath, dir);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
    }
  });
  
  // Create package.json
  const packageJson = getNextPackageJson(config);
  writeFileSync(
    join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // Create TypeScript config
  const tsConfig = {
    compilerOptions: {
      target: 'ES2017',
      lib: ['dom', 'dom.iterable', 'ES6'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      forceConsistentCasingInFileNames: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'node',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      plugins: [
        {
          name: 'next',
        },
      ],
      baseUrl: '.',
      paths: {
        '~/*': ['./src/*'],
        '@/*': ['./src/*'],
      },
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules'],
  };
  
  writeFileSync(
    join(projectPath, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2)
  );
  
  // Create Next.js config
  writeFileSync(
    join(projectPath, 'next.config.js'),
    getNextConfig(config)
  );
  
  // Create Tailwind config
  writeFileSync(
    join(projectPath, 'tailwind.config.js'),
    getTailwindConfig(config)
  );
  
  // Create PostCSS config
  writeFileSync(
    join(projectPath, 'postcss.config.js'),
    `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`
  );
  
  // Create components.json for shadcn/ui
  writeFileSync(
    join(projectPath, 'components.json'),
    JSON.stringify(getComponentsJson(), null, 2)
  );
  
  // Create environment files
  writeFileSync(
    join(projectPath, '.env.example'),
    getEnvExample(config)
  );
  
  writeFileSync(
    join(projectPath, '.env.local'),
    getEnvExample(config)
  );
  
  // Create Next.js App Router files
  writeFileSync(
    join(projectPath, 'src/app/layout.tsx'),
    getMainLayout(config)
  );
  
  writeFileSync(
    join(projectPath, 'src/app/page.tsx'),
    getHomePage(config)
  );
  
  writeFileSync(
    join(projectPath, 'src/app/globals.css'),
    getGlobalsCSS()
  );
  
  // Create loading and error pages
  writeFileSync(
    join(projectPath, 'src/app/loading.tsx'),
    `export default function Loading() {
  return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
}
`
  );
  
  writeFileSync(
    join(projectPath, 'src/app/error.tsx'),
    `'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
}
`
  );
  
  // Create lib utilities
  writeFileSync(
    join(projectPath, 'src/lib/utils.ts'),
    `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`
  );
  
  // Create shadcn/ui components for non-minimal templates
  if (config.template !== 'minimal') {
    writeFileSync(
      join(projectPath, 'src/components/ui/button.tsx'),
      getButtonComponent()
    );
    
    writeFileSync(
      join(projectPath, 'src/components/ui/card.tsx'),
      getCardComponent()
    );
    
    writeFileSync(
      join(projectPath, 'src/components/ui/input.tsx'),
      getInputComponent()
    );
    
    writeFileSync(
      join(projectPath, 'src/components/ui/scroll-area.tsx'),
      getScrollAreaComponent()
    );
    
    writeFileSync(
      join(projectPath, 'src/components/ui/avatar.tsx'),
      getAvatarComponent()
    );
    
    writeFileSync(
      join(projectPath, 'src/components/ui/separator.tsx'),
      getSeparatorComponent()
    );
  }
  
  // Create auth configuration if needed
  if (config.includeAuth) {
    writeFileSync(
      join(projectPath, 'src/lib/auth/config.ts'),
      getAuthConfig(config)
    );
    
    writeFileSync(
      join(projectPath, 'src/app/api/auth/[...nextauth]/route.ts'),
      `import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth/config"

const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
`
    );
  }
  
  // Create database configuration if needed
  if (config.includeDatabase) {
    writeFileSync(
      join(projectPath, 'drizzle.config.ts'),
      getDrizzleConfig(config)
    );
    
    writeFileSync(
      join(projectPath, 'src/lib/db/index.ts'),
      getSupabaseConfig(config)
    );
    
    writeFileSync(
      join(projectPath, 'src/lib/db/schema.ts'),
      `import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content"),
  authorId: uuid("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
`
    );
  }
  
  // Create tRPC configuration if needed
  if (config.template === 'full') {
    writeFileSync(
      join(projectPath, 'src/lib/trpc/client.tsx'),
      getTrpcConfig(config)
    );
    
    writeFileSync(
      join(projectPath, 'src/server/api/root.ts'),
      `import { createTRPCRouter } from "~/server/api/trpc";
import { postRouter } from "~/server/api/routers/post";

export const appRouter = createTRPCRouter({
  post: postRouter,
});

export type AppRouter = typeof appRouter;
`
    );
    
    writeFileSync(
      join(projectPath, 'src/server/api/routers/post.ts'),
      `import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: \`Hello \${input.text}\`,
      };
    }),
});
`
    );
    
    writeFileSync(
      join(projectPath, 'src/server/api/trpc.ts'),
      `import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";

const t = initTRPC.create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
`
    );
    
    writeFileSync(
      join(projectPath, 'src/app/api/trpc/[trpc]/route.ts'),
      getApiRoute(config)
    );
  }
  
  // Create AI configuration if needed
  if (config.includeAI) {
    writeFileSync(
      join(projectPath, 'src/lib/ai/config.ts'),
      getLangChainConfig(config)
    );
    
    writeFileSync(
      join(projectPath, 'src/app/api/ai/chat/route.ts'),
      `import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
  });

  return result.toDataStreamResponse();
}
`
    );
    
    writeFileSync(
      join(projectPath, 'src/components/chat.tsx'),
      getChatComponent(config)
    );
  }
  
  // Create Vercel configuration
  writeFileSync(
    join(projectPath, 'vercel.json'),
    JSON.stringify(getVercelConfig(config), null, 2)
  );
  
  // Create Turborepo configuration if needed
  if (config.template === 'full') {
    writeFileSync(
      join(projectPath, 'turbo.json'),
      JSON.stringify(getTurboConfig(config), null, 2)
    );
  }
  
  // Create Electron configuration if needed
  if (config.includeElectron) {
    writeFileSync(
      join(projectPath, 'electron.js'),
      getElectronConfig(config)
    );
  }
  
  // Create observability configuration if needed
  if (config.includeObservability) {
    writeFileSync(
      join(projectPath, 'sentry.config.js'),
      getSentryConfig(config)
    );
    
    // Create global error handler for Sentry
    writeFileSync(
      join(projectPath, 'src/app/global-error.tsx'),
      `"use client";

import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <Error statusCode={undefined as any} />
      </body>
    </html>
  );
}`
    );
  }
  
  // Create README
  writeFileSync(
    join(projectPath, 'README.md'),
    getReadme(config)
  );
  
  // Create .gitignore
  writeFileSync(
    join(projectPath, '.gitignore'),
    `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
*.lcov

# Next.js
.next/
out/
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# Electron
app/
release/

# IDEs
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Turbo
.turbo/

# Sentry
.sentryclirc

# Drizzle
drizzle/
`
  );
  
  // Install dependencies if not skipped
  if (!config.skipInstall) {
    const { installDependencies } = await import('./install-strategies');
    const installResult = await installDependencies(projectPath, config.packageManager, config);
    
    if (!installResult.success) {
      const error = new Error(`Failed to install dependencies: ${installResult.error}`);
      if (installResult.fixInstructions) {
        console.log('\n💡 Troubleshooting steps:');
        console.log(installResult.fixInstructions);
      }
      throw error;
    }
    
    if (installResult.command !== `${config.packageManager} install`) {
      console.log(`\n✅ Dependencies installed using fallback strategy: ${installResult.command}`);
    }
  }
}