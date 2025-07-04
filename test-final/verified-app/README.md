# verified-app

> Built with the **GO FAST 🔥 STACK** - The AI-First Tech Stack for 2025

## ✨ Features

- ⚡ **Next.js 15** with App Router and React Server Components\n- 🎨 **Tailwind CSS** for utility-first styling\n- 🧩 **shadcn/ui** for beautiful, accessible components\n- 🔐 **NextAuth.js v5** for authentication\n- 🗄️ **Supabase** Postgres with **Drizzle ORM**\n- 🤖 **Vercel AI SDK** with streaming support\n- 🧠 **LangChain.js** for AI workflows\n- 🔗 **tRPC** for end-to-end type safety\n- 📦 **Turborepo** for fast builds\n- 📊 **Sentry** + **OpenTelemetry** for observability

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables in `.env.local`.

3. **Set up the database:**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
verified-app/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   └── ui/            # shadcn/ui components
│   ├── lib/               # Utility functions
│   │   └── auth/          # Auth configuration
│   │   └── db/            # Database configuration
│   │   └── ai/            # AI configuration
│   │   └── trpc/          # tRPC configuration
│   └── server/           # Server-side code
├── drizzle/              # Database migrations
├── public/               # Static assets
└── package.json
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks
- `npm run db:generate` - Generate database schema
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio


## 🔧 Configuration

### Environment Variables

#### Authentication
- `NEXTAUTH_URL` - Your app URL
- `NEXTAUTH_SECRET` - Random secret for JWT
- `GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `GITHUB_CLIENT_SECRET` - GitHub OAuth client secret
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

#### Database
- `DATABASE_URL` - PostgreSQL connection string
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

#### AI Services
- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key
- `GOOGLE_AI_API_KEY` - Google AI API key
- `LANGCHAIN_API_KEY` - LangSmith API key

#### Observability
- `SENTRY_DSN` - Sentry project DSN
- `SENTRY_ORG` - Sentry organization
- `SENTRY_PROJECT` - Sentry project name
- `SENTRY_AUTH_TOKEN` - Sentry auth token


## 📚 Documentation

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/)
- [LangChain.js Documentation](https://js.langchain.com/)
- [tRPC Documentation](https://trpc.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy!

### Database Setup

1. Create a Supabase project
2. Copy the connection details to your environment variables
3. Run database migrations:
   ```bash
   npm run db:migrate
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using the GO FAST 🔥 STACK**

*The AI-First Tech Stack for 2025*