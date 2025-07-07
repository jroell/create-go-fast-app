import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chat } from "@/components/chat"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            GO FAST 🔥
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            The AI-First Tech Stack for 2025
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  Next.js 15
                </CardTitle>
                <CardDescription>
                  App Router with React Server Components
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🎨</span>
                  Tailwind CSS
                </CardTitle>
                <CardDescription>
                  Utility-first CSS framework
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🧩</span>
                  shadcn/ui
                </CardTitle>
                <CardDescription>
                  Beautiful and accessible components
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  TypeScript
                </CardTitle>
                <CardDescription>
                  Type-safe development
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🔗</span>
                  tRPC
                </CardTitle>
                <CardDescription>
                  End-to-end type safety
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Observability
                </CardTitle>
                <CardDescription>
                  Sentry + OpenTelemetry
                </CardDescription>
              </CardHeader>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          
          <Card>
            <CardHeader>
              <CardTitle>🤖 AI Chat</CardTitle>
              <CardDescription>
                Powered by Vercel AI SDK with multiple providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Chat />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>🗄️ Database</CardTitle>
              <CardDescription>
                Supabase Postgres with Drizzle ORM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Type-safe database queries with automatic migrations
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>🔐 Authentication</CardTitle>
              <CardDescription>
                NextAuth.js v5 with multiple providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Secure authentication with OAuth providers
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Welcome to test-project</CardTitle>
              <CardDescription>
                Your project is ready to go! Start building amazing AI-powered applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-left">
                <p>✅ Next.js 15 with App Router</p>
                <p>✅ TypeScript configuration</p>
                <p>✅ Tailwind CSS + shadcn/ui</p>
                <p>✅ Authentication setup</p>
                <p>✅ Database configuration</p>
                <p>✅ AI integration</p>
                <p>✅ tRPC for API routes</p>
                <p>✅ Observability tools</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}