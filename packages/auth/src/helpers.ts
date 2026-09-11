import { auth } from "./index";
import { headers as nextHeaders } from "next/headers";

export async function requireAuth(headers?: Headers) {
  const h = headers || (await nextHeaders());
  const session = await auth.api.getSession({ headers: h });
  if (!session) {
    return { session: null, error: new Response("Unauthorized", { status: 401 }) };
  }
  return { session, error: null };
}

export async function requireAdmin(headers?: Headers) {
  const { session, error } = await requireAuth(headers);
  if (error) return { session: null, error };
  if (session.user.role !== "admin") {
    return { session: null, error: new Response("Forbidden", { status: 403 }) };
  }
  return { session, error: null };
}