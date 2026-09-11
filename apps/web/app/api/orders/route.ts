import { db } from "@/lib/db";
import { orders, orderItems, carts, cartItems } from "@e-commerce/db/schema";
import { requireAuth } from "@e-commerce/auth";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { addressId } = await req.json();
  if (!addressId) return NextResponse.json({ error: "Missing addressId" }, { status: 400 });

  return await db.transaction(async (tx) => {
    // 1. Get cart
    const cart = await tx.query.carts.findFirst({
      where: eq(carts.userId, session.user.id),
      with: {
        items: {
          with: {
            variant: {
              with: { product: true },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 2. Calculate total
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + Number(item.variant.priceOverride || item.variant.product.basePrice) * item.quantity,
      0
    );

    // 3. Create order
    const [order] = await tx.insert(orders).values({
      userId: session.user.id,
      addressId,
      totalAmount: totalAmount.toString(),
      status: "pending",
    }).returning();

    // 4. Create order items
    await tx.insert(orderItems).values(
      cart.items.map((item) => ({
        orderId: order.id,
        variantId: item.variantId,
        productName: item.variant.product.name,
        size: item.variant.size,
        color: item.variant.color,
        unitPrice: (item.variant.priceOverride || item.variant.product.basePrice).toString(),
        quantity: item.quantity,
      }))
    );

    // 5. Clear cart
    await tx.delete(cartItems).where(eq(cartItems.cartId, cart.id));
    await tx.delete(carts).where(eq(carts.id, cart.id));

    return NextResponse.json({ orderId: order.id });
  });
}
