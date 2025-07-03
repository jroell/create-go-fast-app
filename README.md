# create-go-fast-app

> A CLI tool to create a new project with the **GO FAST 🔥 STACK** - The best AI-first tech stack in 2025

[![npm version](https://img.shields.io/npm/v/create-go-fast-app.svg)](https://www.npmjs.com/package/create-go-fast-app)
[![npm downloads](https://img.shields.io/npm/dm/create-go-fast-app.svg)](https://www.npmjs.com/package/create-go-fast-app)

## ✨ Features

The GO FAST 🔥 STACK includes:

- ⚡ **Next.js 15** with App Router and React Server Components
- 🎨 **Tailwind CSS** for utility-first styling
- 🧩 **shadcn/ui** for beautiful, accessible components
- 🔐 **NextAuth.js v5** for authentication
- 🗄️ **Supabase** Postgres with **Drizzle ORM**
- 🤖 **Vercel AI SDK** with streaming support
- 🧠 **LangChain.js** for AI workflows
- 🔗 **tRPC** for end-to-end type safety
- 📦 **Turborepo** for fast builds
- 🖥️ **Electron** for desktop applications (optional)
- 📊 **Sentry** + **OpenTelemetry** for observability

## 🚀 Quick Start

### Interactive Mode

```bash
npx create-go-fast-app my-app
```

### Quick Mode (uses defaults)

```bash
npx create-go-fast-app my-app --yes
```

### With Options

```bash
npx create-go-fast-app my-app --template=minimal --skip-install
```

## 📋 Templates

### Full Stack (Recommended)
Complete GO FAST stack with all features enabled:
- Next.js 15 + React 19
- Authentication (NextAuth.js v5)
- Database (Supabase + Drizzle)
- AI features (Vercel AI SDK + LangChain)
- tRPC for type-safe APIs
- Observability tools

### Frontend Only
Frontend-focused setup:
- Next.js 15 + React 19
- Tailwind CSS + shadcn/ui
- AI features (optional)

### Minimal
Basic Next.js setup:
- Next.js 15 + React 19
- Tailwind CSS
- Minimal configuration

## 🛠️ CLI Options

```bash
create-go-fast-app [project-name] [options]
```

### Options

- `-t, --template <template>` - Template to use (full|frontend|minimal)
- `-y, --yes` - Use default configuration
- `--skip-install` - Skip installing dependencies
- `-h, --help` - Display help
- `-V, --version` - Display version

### Interactive Prompts

When running without `--yes`, you'll be prompted to configure:

- Project name
- Template type
- Authentication setup
- Database configuration
- AI features
- Electron support
- Observability tools
- Package manager preference

## 🏗️ What Gets Created

```
my-app/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   └── ui/            # shadcn/ui components
│   ├── lib/               # Utility functions
│   │   ├── auth/          # Auth configuration
│   │   ├── db/            # Database configuration
│   │   ├── ai/            # AI configuration
│   │   └── trpc/          # tRPC configuration
│   └── server/            # Server-side code
├── public/                # Static assets
├── drizzle/              # Database migrations
├── package.json
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
└── README.md
```

## 🌟 Why GO FAST Stack?

### Unified TypeScript Everywhere
- No mental overhead switching contexts
- End-to-end type safety from database to UI

### Serverless-First
- Focus on product, not infrastructure
- Automatic scaling with Vercel

### AI-Native Primitives
- Built-in streaming, vector search, and agentic capabilities
- Multiple AI provider support

### Robust OSS Communities
- Massive ecosystem support
- Solutions always within reach

### One Codebase, Many Platforms
- Web today, desktop tomorrow, mobile next month

## 🔧 Development

### Setup

```bash
git clone https://github.com/jroell/create-go-fast-app.git
cd create-go-fast-app
npm install
```

### Build

```bash
npm run build
```

### Test

```bash
npm run dev
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/)
- [LangChain.js Documentation](https://js.langchain.com/)
- [tRPC Documentation](https://trpc.io/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with inspiration from:
- [create-next-app](https://nextjs.org/docs/api-reference/create-next-app)
- [create-t3-app](https://create.t3.gg/)
- The amazing open-source community

---

**Built with ❤️ for the AI-first future**

*GO FAST 🔥 - The AI-First Tech Stack for 2025*