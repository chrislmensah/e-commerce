import { NextResponse } from "next/server";
import { requireAdmin } from "@e-commerce/auth";
import { db } from "@/lib/db";
import { orders } from "@e-commerce/db/schema";
import { sql, eq } from "drizzle-orm";

export async function GET() {
  const { session, error } = await requireAdmin();
  if (error) return error;

  // Total orders + total revenue (excluding cancelled orders from revenue)
  const [totals] = await db
    .select({
      totalOrders: sql<number>`count(*)`,
      totalRevenue: sql<string>`coalesce(sum(${orders.totalAmount}) filter (where ${orders.status} != 'cancelled'), 0)`,
    })
    .from(orders);

  // Orders grouped by status
  const statusCounts = await db
    .select({
      status: orders.status,
      count: sql<number>`count(*)`,
    })
    .from(orders)
    .groupBy(orders.status);

  const ordersByStatus = statusCounts.reduce(
    (acc, row) => ({ ...acc, [row.status]: Number(row.count) }),
    {} as Record<string, number>
  );

  return NextResponse.json({
    totalOrders: Number(totals.totalOrders),
    totalRevenue: totals.totalRevenue,
    ordersByStatus,
  });
}