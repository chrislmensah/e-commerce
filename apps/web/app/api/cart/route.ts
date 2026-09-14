import { db } from "@/lib/db";
import { carts, cartItems } from "@e-commerce/db/schema";
import { requireAuth } from "@e-commerce/auth";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  const userCart = await db.query.carts.findFirst({
    where: eq(carts.userId, session.user.id),
    with: {
      items: {
        with: {
          variant: true,
        },
      },
    },
  });

  return NextResponse.json(userCart || { items: [] });
}

export async function POST(req: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { variantId, quantity } = await req.json();

  let cart = await db.query.carts.findFirst({
    where: eq(carts.userId, session.user.id),
  });

  if (!cart) {
    [cart] = await db.insert(carts).values({ userId: session.user.id }).returning();
  }

  const existingItem = await db.query.cartItems.findFirst({
    where: and(eq(cartItems.cartId, cart.id), eq(cartItems.variantId, variantId)),
  });

  if (existingItem) {
    await db
      .update(cartItems)
      .set({ quantity: existingItem.quantity + quantity })
      .where(eq(cartItems.id, existingItem.id));
  } else {
    await db.insert(cartItems).values({
      cartId: cart.id,
      variantId,
      quantity,
    });
  }

  return NextResponse.json({ message: "Item added to cart" });
}