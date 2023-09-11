import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);
const db = drizzle(client);

// this will automatically run needed migrations on the database
await migrate(db, { migrationsFolder: "./drizzle" });
process.exit(0);
