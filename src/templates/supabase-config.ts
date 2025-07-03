import { ProjectConfig } from '../types';

export function getSupabaseConfig(config: ProjectConfig): string {
  return `import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });

// Migration function
export async function runMigrations() {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("Migrations completed!");
}

// Supabase client for additional features
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Helper functions
export async function getUser(userId: string) {
  const result = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });
  return result;
}

export async function createUser(email: string, name?: string) {
  const [user] = await db.insert(schema.users).values({
    email,
    name,
  }).returning();
  return user;
}`;
}