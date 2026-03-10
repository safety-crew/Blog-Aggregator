import { defineConfig } from "drizzle-kit";
import { readConfig } from "./src/config.ts";

// Retrieve the connection string from your ~/.gatorconfig.json
const config = readConfig();

export default defineConfig({
  // Points to where your table definitions will live
  schema: "./src/lib/db/schema.ts",
  // Points to where Drizzle will generate SQL migration files
  out: "./src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: config.dbUrl,
  },
});