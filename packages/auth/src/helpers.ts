import { auth } from "./index"; // wherever your better-auth instance is exported
import { headers } from "next/headers";

export async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { session: null, error: new Response("Unauthorized", { status: 401 }) };
  }
  return { session, error: null };
}

export async function requireAdmin() {
  const { session, error } = await requireAuth();
  if (error) return { session: null, error };

  if (session.user.role !== "admin") {
    return { session: null, error: new Response("Forbidden", { status: 403 }) };
  }
  return { session, error: null };
}