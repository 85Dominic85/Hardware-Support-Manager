import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import bcrypt from "bcryptjs";
import * as schema from "./schema";

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("admin123", 10);

  await db
    .insert(schema.users)
    .values({
      name: "Administrador",
      email: "admin@hardware-support.local",
      passwordHash,
      role: "admin",
    })
    .onConflictDoNothing();

  console.log("Admin user created: admin@hardware-support.local / admin123");
  console.log("Seed completed!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
