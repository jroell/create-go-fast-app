"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = createProject;
const path_1 = require("path");
const fs_1 = require("fs");
const package_json_1 = require("./templates/package-json");
const next_config_1 = require("./templates/next-config");
const tailwind_config_1 = require("./templates/tailwind-config");
const components_json_1 = require("./templates/components-json");
const env_example_1 = require("./templates/env-example");
const main_layout_1 = require("./templates/main-layout");
const home_page_1 = require("./templates/home-page");
const globals_css_1 = require("./templates/globals-css");
const auth_config_1 = require("./templates/auth-config");
const drizzle_config_1 = require("./templates/drizzle-config");
const supabase_config_1 = require("./templates/supabase-config");
const trpc_config_1 = require("./templates/trpc-config");
const vercel_config_1 = require("./templates/vercel-config");
const langchain_config_1 = require("./templates/langchain-config");
const turbo_config_1 = require("./templates/turbo-config");
const readme_1 = require("./templates/readme");
const api_routes_1 = require("./templates/api-routes");
const chat_component_1 = require("./templates/chat-component");
const electron_config_1 = require("./templates/electron-config");
const sentry_config_1 = require("./templates/sentry-config");
const ui_components_1 = require("./templates/ui-components");
async function createProject(config) {
    const projectPath = (0, path_1.join)(process.cwd(), config.projectName);
    // Create project directory
    (0, fs_1.mkdirSync)(projectPath, { recursive: true });
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
        const fullPath = (0, path_1.join)(projectPath, dir);
        if (!(0, fs_1.existsSync)(fullPath)) {
            (0, fs_1.mkdirSync)(fullPath, { recursive: true });
        }
    });
    // Create package.json
    const packageJson = (0, package_json_1.getNextPackageJson)(config);
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));
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
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));
    // Create Next.js config
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'next.config.js'), (0, next_config_1.getNextConfig)(config));
    // Create Tailwind config
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'tailwind.config.js'), (0, tailwind_config_1.getTailwindConfig)(config));
    // Create PostCSS config
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'postcss.config.js'), `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`);
    // Create components.json for shadcn/ui
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'components.json'), JSON.stringify((0, components_json_1.getComponentsJson)(), null, 2));
    // Create environment files
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, '.env.example'), (0, env_example_1.getEnvExample)(config));
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, '.env.local'), (0, env_example_1.getEnvExample)(config));
    // Create Next.js App Router files
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/app/layout.tsx'), (0, main_layout_1.getMainLayout)(config));
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/app/page.tsx'), (0, home_page_1.getHomePage)(config));
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/app/globals.css'), (0, globals_css_1.getGlobalsCSS)());
    // Create loading and error pages
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/app/loading.tsx'), `export default function Loading() {
  return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
}
`);
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/app/error.tsx'), `'use client';

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
`);
    // Create lib utilities
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/lib/utils.ts'), `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`);
    // Create shadcn/ui components for non-minimal templates
    if (config.template !== 'minimal') {
        (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/components/ui/button.tsx'), (0, ui_components_1.getButtonComponent)());
        (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/components/ui/card.tsx'), (0, ui_components_1.getCardComponent)());
        (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/components/ui/input.tsx'), (0, ui_components_1.getInputComponent)());
        (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/components/ui/scroll-area.tsx'), (0, ui_components_1.getScrollAreaComponent)());
        (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/components/ui/avatar.tsx'), (0, ui_components_1.getAvatarComponent)());
        (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/components/ui/separator.tsx'), (0, ui_components_1.getSeparatorComponent)());
    }
    // Create auth configuration if needed
    if (config.includeAuth) {
        (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/lib/auth/config.ts'), (0, auth_config_1.getAuthConfig)(config));
        (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/app/api/auth/[...nextauth]/route.ts'), `import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth/config"

const handler = NextAuth(authConfig)

export { handler as GET, handler as POST }
`);
    }
    // Create database configuration if needed
    if (config.includeDatabase) {
        (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'drizzle.config.ts'), (0, drizzle_config_1.getDrizzleConfig)(config));
        (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/lib/db/index.ts'), (0, supabase_config_1.getSupabaseConfig)(config));
        (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/lib/db/schema.ts'), `import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

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
`);
    }
    // Create tRPC configuration if needed
    if (config.template === 'full') {
        (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/lib/trpc/client.tsx'), (0, trpc_config_1.getTrpcConfig)(config));
        (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/server/api/root.ts'), `import { createTRPCRouter } from "~/server/api/trpc";
import { postRouter } from "~/server/api/routers/post";

export const appRouter = createTRPCRouter({
  post: postRouter,
});

export type AppRouter = typeof appRouter;
`);
        (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/server/api/routers/post.ts'), `import { z } from "zod";
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
`);
        (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/server/api/trpc.ts'), `import { initTRPC } from "@trpc/server";
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
`);
        (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/app/api/trpc/[trpc]/route.ts'), (0, api_routes_1.getApiRoute)(config));
    }
    // Create AI configuration if needed
    if (config.includeAI) {
        (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/lib/ai/config.ts'), (0, langchain_config_1.getLangChainConfig)(config));
        (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/app/api/ai/chat/route.ts'), `import { openai } from '@ai-sdk/openai';
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
`);
        (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/components/chat.tsx'), (0, chat_component_1.getChatComponent)(config));
    }
    // Create Vercel configuration
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'vercel.json'), JSON.stringify((0, vercel_config_1.getVercelConfig)(config), null, 2));
    // Create Turborepo configuration if needed
    if (config.template === 'full') {
        (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'turbo.json'), JSON.stringify((0, turbo_config_1.getTurboConfig)(config), null, 2));
    }
    // Create Electron configuration if needed
    if (config.includeElectron) {
        (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'electron.js'), (0, electron_config_1.getElectronConfig)(config));
    }
    // Create observability configuration if needed
    if (config.includeObservability) {
        (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'sentry.config.js'), (0, sentry_config_1.getSentryConfig)(config));
        // Create global error handler for Sentry
        (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'src/app/global-error.tsx'), `"use client";

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
}`);
    }
    // Create README
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'README.md'), (0, readme_1.getReadme)(config));
    // Create .gitignore
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, '.gitignore'), `# Dependencies
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
`);
    // Install dependencies if not skipped
    if (!config.skipInstall) {
        const { installDependencies } = await Promise.resolve().then(() => __importStar(require('./install-strategies')));
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
//# sourceMappingURL=create-project.js.map