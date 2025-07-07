import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "next-auth/react"
import { TRPCProvider } from "@/lib/trpc/client"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "test-project",
  description: "Built with the GO FAST 🔥 STACK",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider><TRPCProvider>
          {children}
        </TRPCProvider></SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}