import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@e-commerce/db";
import { users, sessions, accounts, verifications } from "@e-commerce/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  user: {
    additionalFields: {
      fullName: { type: "string", required: true },
      phone: { type: "string", required: false },
      role: { type: "string", required: false, defaultValue: "customer" },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});