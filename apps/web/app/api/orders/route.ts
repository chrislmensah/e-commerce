import { db } from "@/lib/db";
import { orders, orderItems, carts, cartItems, inventory } from "@e-commerce/db/schema";
import { requireAuth } from "@e-commerce/auth";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid or missing JSON body" }, { status: 400 });
  }

  const { addressId } = body;
  if (!addressId) return NextResponse.json({ error: "Missing addressId" }, { status: 400 });

  try {
    return await db.transaction(async (tx) => {
      const cart = await tx.query.carts.findFirst({
        where: eq(carts.userId, session.user.id),
        with: {
          items: {
            with: {
              variant: {
                with: { product: true, inventory: true },
              },
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new Error("CART_EMPTY");
      }

      // Check stock for every item BEFORE writing anything
      for (const item of cart.items) {
        const stock = item.variant.inventory?.quantity ?? 0;
        if (stock < item.quantity) {
          throw new Error(
            `INSUFFICIENT_STOCK:${item.variant.product.name} (${item.variant.size}/${item.variant.color})`
          );
        }
      }

      const totalAmount = cart.items.reduce(
        (sum, item) =>
          sum + Number(item.variant.priceOverride || item.variant.product.basePrice) * item.quantity,
        0
      );

      const [order] = await tx
        .insert(orders)
        .values({
          userId: session.user.id,
          addressId,
          totalAmount: totalAmount.toString(),
          status: "pending",
        })
        .returning();

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

      // Decrement inventory for every item
      for (const item of cart.items) {
        const stock = item.variant.inventory?.quantity ?? 0;
        await tx
          .update(inventory)
          .set({ quantity: stock - item.quantity })
          .where(eq(inventory.variantId, item.variantId));
      }

      await tx.delete(cartItems).where(eq(cartItems.cartId, cart.id));
      await tx.delete(carts).where(eq(carts.id, cart.id));

      return NextResponse.json({ orderId: order.id });
    });
  } catch (err) {
    const message = (err as Error).message;
    if (message === "CART_EMPTY") {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    if (message.startsWith("INSUFFICIENT_STOCK:")) {
      return NextResponse.json(
        { error: `Insufficient stock for ${message.replace("INSUFFICIENT_STOCK:", "")}` },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}