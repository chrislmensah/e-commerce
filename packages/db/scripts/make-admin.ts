import { db } from "../index";
import { user } from "../schema"; // singular, matching your current schema
import { eq } from "drizzle-orm";

const email = process.argv[2];
if (!email) {
  console.error("Usage: tsx make-admin.ts <email>");
  process.exit(1);
}

await db.update(user).set({ role: "admin" }).where(eq(user.email, email));
console.log(`${email} is now an admin.`);