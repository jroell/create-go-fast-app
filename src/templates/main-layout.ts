import { ProjectConfig } from '../types';

export function getMainLayout(config: ProjectConfig): string {
  let imports = `import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"`;

  let providers = [];
  let metadata = `export const metadata: Metadata = {
  title: "${config.projectName}",
  description: "Built with the GO FAST 🔥 STACK",
}`;

  if (config.includeAuth) {
    imports += `\nimport { SessionProvider } from "next-auth/react"`;
    providers.push('SessionProvider');
  }

  if (config.template === 'full') {
    imports += `\nimport { TRPCProvider } from "@/lib/trpc/client"`;
    providers.push('TRPCProvider');
  }

  if (config.includeObservability) {
    imports += `\nimport { Analytics } from "@vercel/analytics/react"`;
  }

  const layoutContent = `${imports}

const inter = Inter({ subsets: ["latin"] })

${metadata}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        ${providers.map(provider => `<${provider}>`).join('')}
          {children}
        ${providers.reverse().map(provider => `</${provider}>`).join('')}
        ${config.includeObservability ? '<Analytics />' : ''}
      </body>
    </html>
  )
}`;

  return layoutContent;
}