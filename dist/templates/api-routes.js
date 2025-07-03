"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiRoute = getApiRoute;
function getApiRoute(config) {
    return `import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ req }),
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              \`❌ tRPC failed on \${path ?? "<no-path>"}: \${error.message}\`
            );
          }
        : undefined,
  });

export { handler as GET, handler as POST };`;
}
//# sourceMappingURL=api-routes.js.map