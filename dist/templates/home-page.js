"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHomePage = getHomePage;
function getHomePage(config) {
    let imports = `import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"`;
    let featuresContent = '';
    if (config.includeAI) {
        imports += `\nimport { Chat } from "@/components/chat"`;
        featuresContent += `
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
          </Card>`;
    }
    if (config.includeDatabase) {
        featuresContent += `
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
          </Card>`;
    }
    if (config.includeAuth) {
        featuresContent += `
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
          </Card>`;
    }
    const stackFeatures = [
        { icon: '⚡', title: 'Next.js 15', description: 'App Router with React Server Components' },
        { icon: '🎨', title: 'Tailwind CSS', description: 'Utility-first CSS framework' },
        { icon: '🧩', title: 'shadcn/ui', description: 'Beautiful and accessible components' },
        { icon: '🔥', title: 'TypeScript', description: 'Type-safe development' },
    ];
    if (config.template === 'full') {
        stackFeatures.push({ icon: '🔗', title: 'tRPC', description: 'End-to-end type safety' });
    }
    if (config.includeObservability) {
        stackFeatures.push({ icon: '📊', title: 'Observability', description: 'Sentry + OpenTelemetry' });
    }
    const stackCards = stackFeatures.map(feature => `
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">${feature.icon}</span>
                  ${feature.title}
                </CardTitle>
                <CardDescription>
                  ${feature.description}
                </CardDescription>
              </CardHeader>
            </Card>`).join('');
    const pageContent = `${imports}

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
          ${stackCards}
        </div>

        ${featuresContent ? `<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          ${featuresContent}
        </div>` : ''}

        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Welcome to ${config.projectName}</CardTitle>
              <CardDescription>
                Your project is ready to go! Start building amazing AI-powered applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-left">
                <p>✅ Next.js 15 with App Router</p>
                <p>✅ TypeScript configuration</p>
                <p>✅ Tailwind CSS + shadcn/ui</p>
                ${config.includeAuth ? '<p>✅ Authentication setup</p>' : ''}
                ${config.includeDatabase ? '<p>✅ Database configuration</p>' : ''}
                ${config.includeAI ? '<p>✅ AI integration</p>' : ''}
                ${config.template === 'full' ? '<p>✅ tRPC for API routes</p>' : ''}
                ${config.includeObservability ? '<p>✅ Observability tools</p>' : ''}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}`;
    return pageContent;
}
//# sourceMappingURL=home-page.js.map