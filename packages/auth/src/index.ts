import { randomUUID } from "crypto";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@e-commerce/db";
import { user, session, account, verification, rateLimit } from "@e-commerce/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: user,
      session: session,
      account: account,
      verification: verification,
      rateLimit: rateLimit,
    },
  }),

  advanced: {
    database: {
      generateId: () => randomUUID(),
    },
  },

  user: {
    additionalFields: {
      phone: { type: "string", required: false },
      role: { type: "string", required: false, defaultValue: "customer", input: false },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  
  rateLimit: {
  enabled: true,
  storage: "database",
  window: 60,
  max: 100,
  customRules: {
    "/sign-in/email": { window: 60, max: 5 },
    "/sign-up/email": { window: 3600, max: 3 },
  },
},
});

export type Session = typeof auth.$Infer.Session;
export { requireAuth, requireAdmin } from "./helpers";