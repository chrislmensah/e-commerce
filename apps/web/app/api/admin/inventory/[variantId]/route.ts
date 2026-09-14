import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@e-commerce/auth";
import { db } from "@e-commerce/db";
import { inventory, productVariants } from "@e-commerce/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateInventorySchema = z.object({
  quantity: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ variantId: string }> }
) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const { variantId } = await params;

  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, variantId),
  });
  if (!variant) {
    return NextResponse.json({ error: "Variant not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = updateInventorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [updated] = await db
    .update(inventory)
    .set(parsed.data)
    .where(eq(inventory.variantId, variantId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Inventory record not found for this variant" }, { status: 404 });
  }

  return NextResponse.json({ inventory: updated });
}