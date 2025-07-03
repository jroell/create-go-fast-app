"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthConfig = getAuthConfig;
function getAuthConfig(config) {
    let imports = `import { NextAuthConfig } from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"`;
    if (config.includeDatabase) {
        imports += `\nimport { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"`;
    }
    const authConfigContent = `${imports}

export const authConfig = {
  ${config.includeDatabase ? 'adapter: DrizzleAdapter(db),' : ''}
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
    session: async ({ session, token }) => {
      if (token?.sub && session?.user) {
        session.user.id = token.sub
      }
      return session
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig`;
    return authConfigContent;
}
//# sourceMappingURL=auth-config.js.map