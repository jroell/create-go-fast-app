"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDrizzleConfig = getDrizzleConfig;
function getDrizzleConfig(config) {
    return `import { type Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  out: "./drizzle",
  tablesFilter: ["${config.projectName.replace(/-/g, '_')}_*"],
} satisfies Config;`;
}
//# sourceMappingURL=drizzle-config.js.map