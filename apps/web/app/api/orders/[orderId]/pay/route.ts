import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@e-commerce/auth";
import { db } from "@/lib/db";
import { orders } from "@e-commerce/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const { orderId } = await params;

  const order = await db.query.orders.findFirst({
    where: and(eq(orders.id, orderId), eq(orders.userId, session.user.id)),
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status !== "pending") {
    return NextResponse.json(
      { error: `Order is already ${order.status}, cannot initiate payment` },
      { status: 400 }
    );
  }

  // Paystack expects amount in the smallest currency unit (pesewas for GHS, kobo for NGN)
  const amountInSubunit = Math.round(Number(order.totalAmount) * 100);

  const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: session.user.email,
      amount: amountInSubunit,
      currency: "GHS",
      reference: `order_${order.id}_${Date.now()}`,
      callback_url: `${process.env.BETTER_AUTH_URL}/orders/${order.id}/confirmation`,
      metadata: {
        orderId: order.id,
        userId: session.user.id,
      },
    }),
  });

  const data = await paystackRes.json();

  if (!data.status) {
    return NextResponse.json({ error: data.message || "Failed to initialize payment" }, { status: 400 });
  }

  return NextResponse.json({
    authorizationUrl: data.data.authorization_url,
    reference: data.data.reference,
  });
}