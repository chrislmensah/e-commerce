import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@e-commerce/auth";
import { db } from "@/lib/db";
import { orders } from "@e-commerce/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { adminWriteRateLimit } from "@/lib/rate-limit";

const statusSchema = z.object({
  status: z.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { success } = await adminWriteRateLimit.limit(session.user.id);
  if (!success) {
    return NextResponse.json({ error: "Too many requests, please slow down" }, { status: 429 });
  }

  const { orderId } = await params;

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid or missing JSON body" }, { status: 400 });
  }

  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existingOrder = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  });
  if (!existingOrder) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const [updated] = await db
    .update(orders)
    .set({ status: parsed.data.status, updatedAt: new Date() })
    .where(eq(orders.id, orderId))
    .returning();

  return NextResponse.json({ order: updated });
}