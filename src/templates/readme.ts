import { ProjectConfig } from '../types';

export function getReadme(config: ProjectConfig): string {
  const features = [];
  
  if (config.template !== 'minimal') {
    features.push('⚡ **Next.js 15** with App Router and React Server Components');
    features.push('🎨 **Tailwind CSS** for utility-first styling');
    features.push('🧩 **shadcn/ui** for beautiful, accessible components');
  } else {
    features.push('⚡ **Next.js 15** with App Router');
    features.push('🎨 **Tailwind CSS** for styling');
  }
  
  if (config.includeAuth) {
    features.push('🔐 **NextAuth.js v5** for authentication');
  }
  
  if (config.includeDatabase) {
    features.push('🗄️ **Supabase** Postgres with **Drizzle ORM**');
  }
  
  if (config.includeAI) {
    features.push('🤖 **Vercel AI SDK** with streaming support');
    features.push('🧠 **LangChain.js** for AI workflows');
  }
  
  if (config.template === 'full') {
    features.push('🔗 **tRPC** for end-to-end type safety');
    features.push('📦 **Turborepo** for fast builds');
  }
  
  if (config.includeElectron) {
    features.push('🖥️ **Electron** for desktop applications');
  }
  
  if (config.includeObservability) {
    features.push('📊 **Sentry** + **OpenTelemetry** for observability');
  }

  const installCommand = config.packageManager === 'npm' ? 'npm install' :
                        config.packageManager === 'yarn' ? 'yarn' :
                        config.packageManager === 'pnpm' ? 'pnpm install' :
                        'bun install';

  const devCommand = config.packageManager === 'npm' ? 'npm run dev' :
                     config.packageManager === 'yarn' ? 'yarn dev' :
                     config.packageManager === 'pnpm' ? 'pnpm dev' :
                     'bun run dev';

  const buildCommand = config.packageManager === 'npm' ? 'npm run build' :
                       config.packageManager === 'yarn' ? 'yarn build' :
                       config.packageManager === 'pnpm' ? 'pnpm build' :
                       'bun run build';

  return `# ${config.projectName}

> Built with the **GO FAST 🔥 STACK** - The AI-First Tech Stack for 2025

## ✨ Features

${features.map(feature => `- ${feature}`).join('\\n')}

## 🚀 Quick Start

1. **Install dependencies:**
   \`\`\`bash
   ${installCommand}
   \`\`\`

2. **Set up environment variables:**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your environment variables in \`.env.local\`.

${config.includeDatabase ? `3. **Set up the database:**
   \`\`\`bash
   ${config.packageManager === 'npm' ? 'npm run' : config.packageManager} db:generate
   ${config.packageManager === 'npm' ? 'npm run' : config.packageManager} db:migrate
   \`\`\`

4. **Start the development server:**` : '3. **Start the development server:**'}
   \`\`\`bash
   ${devCommand}
   \`\`\`

5. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
${config.projectName}/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   └── ui/            # shadcn/ui components
│   ├── lib/               # Utility functions
${config.includeAuth ? '│   │   └── auth/          # Auth configuration' : ''}
${config.includeDatabase ? '│   │   └── db/            # Database configuration' : ''}
${config.includeAI ? '│   │   └── ai/            # AI configuration' : ''}
${config.template === 'full' ? '│   │   └── trpc/          # tRPC configuration' : ''}
${config.template === 'full' ? '│   └── server/           # Server-side code' : ''}
${config.includeDatabase ? '├── drizzle/              # Database migrations' : ''}
├── public/               # Static assets
└── package.json
\`\`\`

## 🛠️ Available Scripts

- \`${devCommand}\` - Start development server
- \`${buildCommand}\` - Build for production
- \`${config.packageManager === 'npm' ? 'npm run' : config.packageManager} lint\` - Run ESLint
- \`${config.packageManager === 'npm' ? 'npm run' : config.packageManager} type-check\` - Run TypeScript checks
${config.includeDatabase ? `- \`${config.packageManager === 'npm' ? 'npm run' : config.packageManager} db:generate\` - Generate database schema
- \`${config.packageManager === 'npm' ? 'npm run' : config.packageManager} db:migrate\` - Run database migrations
- \`${config.packageManager === 'npm' ? 'npm run' : config.packageManager} db:studio\` - Open Drizzle Studio` : ''}
${config.includeElectron ? `- \`${config.packageManager === 'npm' ? 'npm run' : config.packageManager} electron\` - Start Electron app
- \`${config.packageManager === 'npm' ? 'npm run' : config.packageManager} electron-dev\` - Start Electron in development
- \`${config.packageManager === 'npm' ? 'npm run' : config.packageManager} build-electron\` - Build Electron app` : ''}

## 🔧 Configuration

### Environment Variables

${config.includeAuth ? `#### Authentication
- \`NEXTAUTH_URL\` - Your app URL
- \`NEXTAUTH_SECRET\` - Random secret for JWT
- \`GITHUB_CLIENT_ID\` - GitHub OAuth client ID
- \`GITHUB_CLIENT_SECRET\` - GitHub OAuth client secret
- \`GOOGLE_CLIENT_ID\` - Google OAuth client ID
- \`GOOGLE_CLIENT_SECRET\` - Google OAuth client secret

` : ''}${config.includeDatabase ? `#### Database
- \`DATABASE_URL\` - PostgreSQL connection string
- \`SUPABASE_URL\` - Supabase project URL
- \`SUPABASE_ANON_KEY\` - Supabase anon key
- \`SUPABASE_SERVICE_ROLE_KEY\` - Supabase service role key

` : ''}${config.includeAI ? `#### AI Services
- \`OPENAI_API_KEY\` - OpenAI API key
- \`ANTHROPIC_API_KEY\` - Anthropic API key
- \`GOOGLE_AI_API_KEY\` - Google AI API key
- \`LANGCHAIN_API_KEY\` - LangSmith API key

` : ''}${config.includeObservability ? `#### Observability
- \`SENTRY_DSN\` - Sentry project DSN
- \`SENTRY_ORG\` - Sentry organization
- \`SENTRY_PROJECT\` - Sentry project name
- \`SENTRY_AUTH_TOKEN\` - Sentry auth token

` : ''}
## 📚 Documentation

${config.includeAuth ? '- [NextAuth.js Documentation](https://next-auth.js.org/)' : ''}
${config.includeDatabase ? '- [Drizzle ORM Documentation](https://orm.drizzle.team/)' : ''}
${config.includeDatabase ? '- [Supabase Documentation](https://supabase.com/docs)' : ''}
${config.includeAI ? '- [Vercel AI SDK Documentation](https://sdk.vercel.ai/)' : ''}
${config.includeAI ? '- [LangChain.js Documentation](https://js.langchain.com/)' : ''}
${config.template === 'full' ? '- [tRPC Documentation](https://trpc.io/)' : ''}
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy!

${config.includeDatabase ? `### Database Setup

1. Create a Supabase project
2. Copy the connection details to your environment variables
3. Run database migrations:
   \`\`\`bash
   ${config.packageManager === 'npm' ? 'npm run' : config.packageManager} db:migrate
   \`\`\`

` : ''}## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using the GO FAST 🔥 STACK**

*The AI-First Tech Stack for 2025*`;
}