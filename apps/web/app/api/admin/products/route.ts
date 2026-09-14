import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@e-commerce/auth";
import { db } from "@e-commerce/db";
import { products, productVariants, inventory, categories } from "@e-commerce/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const variantSchema = z.object({
  size: z.string().min(1),
  color: z.string().min(1),
  priceOverride: z.number().positive().optional(),
  imageUrl: z.string().url().optional(),
  initialStock: z.number().int().min(0).default(0),
});

const createProductSchema = z.object({
  categoryId: z.string().uuid().optional(),
  name: z.string().min(1).max(150),
  description: z.string().optional(),
  basePrice: z.number().positive(),
  variants: z.array(variantSchema).min(1),
});

export async function POST(req: NextRequest) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const parsed = createProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { categoryId, name, description, basePrice, variants } = parsed.data;

  if (categoryId) {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, categoryId),
    });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 400 });
    }
  }

  try {
    const product = await db.transaction(async (tx) => {
      const [newProduct] = await tx
        .insert(products)
        .values({
          categoryId,
          name,
          description,
          basePrice: basePrice.toFixed(2),
        })
        .returning();

      for (const variant of variants) {
        const [newVariant] = await tx
          .insert(productVariants)
          .values({
            productId: newProduct.id,
            size: variant.size,
            color: variant.color,
            priceOverride: variant.priceOverride?.toFixed(2),
            imageUrl: variant.imageUrl,
          })
          .returning();

        await tx.insert(inventory).values({
          variantId: newVariant.id,
          quantity: variant.initialStock,
        });
      }

      return newProduct;
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}