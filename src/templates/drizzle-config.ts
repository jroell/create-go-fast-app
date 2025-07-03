import { ProjectConfig } from '../types';

export function getDrizzleConfig(config: ProjectConfig): string {
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