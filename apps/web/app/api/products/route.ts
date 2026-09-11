import { db } from "@/lib/db";
import { products } from "@e-commerce/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allProducts = await db.query.products.findMany({
      with: {
        variants: true,
        category: true,
      },
    });
    return NextResponse.json(allProducts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}